import {
  MessengerConfig,
  ERROR_MESSAGES,
  MessageObjectType,
  POST_MESSAGE_TYPES,
  PROD_CONFIG,
  Environment,
  ENVIRONMENT_URLS,
} from './utils'

class EusateMessenger {
  private static instance: EusateMessenger | null = null

  private container: HTMLDivElement
  private fabIframe: HTMLIFrameElement
  private chatIframe: HTMLIFrameElement
  private fabIcon: HTMLSpanElement
  private fab: HTMLButtonElement
  private apiKey: string
  private chatUrl: string
  private onReady?: () => void
  private onError?: (error: Error) => void
  private chatInitialized: boolean = false
  private isChatOpen: boolean = false
  private isDestroyed: boolean = false

  private fabClickHandler: (() => void) | null = null
  private messageHandler: ((evt: MessageEvent) => void) | null = null
  private initTimeout: NodeJS.Timeout | null = null

  private constructor(config: MessengerConfig) {
    this.apiKey = config?.apiKey.trim()
    this.onReady = config.onReady
    this.onError = config.onError
    this.chatUrl = ENVIRONMENT_URLS[config?.environment || Environment.PROD]

    this.container = document.createElement('div')
    this.fabIframe = document.createElement('iframe')
    this.chatIframe = document.createElement('iframe')
    this.fabIcon = document.createElement('span')
    this.fab = document.createElement('button')

    this.init()
  }

  static getInstance(config?: MessengerConfig): EusateMessenger {
    if (typeof window === 'undefined') {
      throw new Error('[Eusate] Cannot create instance on server-side')
    }
    if (EusateMessenger.instance) {
      if (config) {
        console.warn(ERROR_MESSAGES.ALREADY_INIT)
      }
      return EusateMessenger.instance
    }

    if (!config) {
      throw new Error(ERROR_MESSAGES.NO_API_KEY)
    }

    if (
      !config.apiKey ||
      typeof config.apiKey !== 'string' ||
      config.apiKey.trim() === ''
    ) {
      throw new Error(ERROR_MESSAGES.NO_API_KEY)
    }

    EusateMessenger.instance = new EusateMessenger(config)
    return EusateMessenger.instance
  }

  private init = () => {
    try {
      this.setupContainer()
      this.setupFabIframe()
      this.setupChatIframe()
      this.setupMessageHandlers()

      if (document.body) {
        document.body.appendChild(this.container)
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(this.container)
        })
      }

      this.loadFabButton()
    } catch (error) {
      this.handleError(
        new Error(`${ERROR_MESSAGES.ERROR}, ${(error as Error).message}`),
      )
    }
  }

  private setupContainer = () => {
    this.container.id = 'eusate-chat-widget-container'
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
    `

    this.container.setAttribute('data-eusate-widget', 'true')
  }

  private setupFabIframe = () => {
    this.fabIframe.id = 'eusate-chat-widget-fab'
    this.fabIframe.style.cssText = `
      position: relative;
      z-index: 1;
      height: 80px;
      width: 80px;
      border: none;
      background: transparent;
      box-shadow: 0px 40px 72px -12px #10192824;
    `

    this.fabIframe.setAttribute('title', 'Open chat support')
    this.fabIframe.setAttribute('aria-label', 'Open chat support')

    this.container.appendChild(this.fabIframe)
  }

  private setupChatIframe = () => {
    this.chatIframe.id = 'eusate-chat-widget'
    this.chatIframe.src = this.chatUrl

    this.chatIframe.style.cssText = `
      position: absolute;
      bottom: 100px;
      right: 0px;
      width: 390px;
      height: 576px;
      transform: scale(0);
      opacity: 0;
      transition-property: transform, translate, scale, rotate, opacity;
      transition-timing-function:  cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 500ms;
      border: none;
      transform-origin: bottom right;
      box-shadow: 0px 40px 72px -12px #10192824;
    `

    this.chatIframe.setAttribute('title', 'Eusate chat support')
    this.chatIframe.setAttribute('aria-hidden', 'true')

    // Set sandbox attributes for security
    this.chatIframe.setAttribute(
      'sandbox',
      'allow-scripts allow-forms allow-same-origin allow-popups',
    )

    this.chatIframe.onload = () => this.handleChatIframeLoad()
    this.chatIframe.onerror = () => this.handleIframeError()

    this.container.appendChild(this.chatIframe)
  }

  private handleChatIframeLoad = (): void => {
    // TODO: test this without setTimeout to see if it waits for the react app. It should, if it doesn't find a way.
    setTimeout(() => {
      const message: MessageObjectType = {
        type: POST_MESSAGE_TYPES.INIT,
        data: {
          apiKey: this.apiKey,
        },
        timestamp: Date.now(),
      }

      this.chatIframe.contentWindow?.postMessage(message, this.chatUrl)
    }, 1000) // this is to allow the react app load up

    this.initTimeout = setTimeout(() => {
      if (!this.isInitialized) {
        this.handleError(new Error(ERROR_MESSAGES.INIT_TIMEOUT))
      }
    }, 10 * 1000) // 10 seconds for timeout
  }

  private handleIframeError = (): void => {
    this.handleError(new Error(ERROR_MESSAGES.IFRAME_LOAD))
  }

  private setupMessageHandlers = (): void => {
    this.messageHandler = (evt: MessageEvent) => {
      if (evt.origin !== new URL(this.chatUrl).origin) return

      switch (evt.data.type) {
        case POST_MESSAGE_TYPES.READY:
          this.handleReady()
          break

        case POST_MESSAGE_TYPES.AUTH_ERROR:
          this.chatInitialized = false
          this.handleError(
            new Error(evt.data.message || 'Authentication failed'),
          )
          break

        case POST_MESSAGE_TYPES.CLOSE_CHAT:
          this.close()
          break
      }
    }

    window.addEventListener('message', this.messageHandler, false)
  }

  private handleReady = (): void => {
    this.chatInitialized = true

    if (this.initTimeout) {
      clearTimeout(this.initTimeout)
      this.initTimeout = null
    }

    if (this.fab) {
      this.fab.disabled = false
    }

    this.onReady?.()
  }

  private handleError = (error: Error): void => {
    console.error(error.message)

    if (this.initTimeout) {
      clearTimeout(this.initTimeout)
      this.initTimeout = null
    }

    this.destroy()

    // if we destroy the instance we do not need to the disable the fab
    // if (this.fab) {
    //   this.fab.disabled = true
    //   this.fab.style.opacity = '0.5'
    //   this.fab.style.cursor = 'not-allowed'
    // }

    this.onError?.(error) // safely call the onError callback
  }

  private loadFabButton = () => {
    const doc = this.fabIframe.contentDocument

    if (!doc) {
      setTimeout(() => this.loadFabButton(), 100)
      return
    }

    // head
    const head = doc.head || doc.createElement('head')

    // icomoon
    const icomoonLink = doc.createElement('link')
    icomoonLink.href = PROD_CONFIG.ICOMOON_URL
    icomoonLink.rel = 'stylesheet'
    head.appendChild(icomoonLink)

    // to avoid multiple head tags in the DOM
    if (!doc.head) {
      doc.documentElement.appendChild(head)
    }

    // body
    const body = doc.body || doc.createElement('body')
    body.style.cssText = `
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: none;
      outline: none;
    `

    //   button
    this.fab.id = 'eusate-messenger-fab-btn'
    this.fab.style.cssText = `
      width: 80px;
      height: 80px;
      background-color: #0a0a0a;
      border-radius: 50%;
      cursor: pointer;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: scale(0.95);
      transition: transform 0.2s ease;
      border: none;
      outline: none;
      `
    this.fab.disabled = true

    this.fab.onmouseenter = () => {
      if (!this.fab.disabled) {
        this.fab.style.transform = 'scale(1)'
      }
    }
    this.fab.onmouseleave = () => {
      if (!this.fab.disabled) {
        this.fab.style.transform = 'scale(0.95)'
      }
    }
    this.fab.onmousedown = () => {
      if (!this.fab.disabled) {
        this.fab.style.transform = 'scale(0.8)'
      }
    }

    // button icon
    this.fabIcon.id = 'button-icon'
    this.fabIcon.className = 'icon-eusate'
    this.fabIcon.style.cssText = `
      font-size: 36px;
    `

    this.fab.appendChild(this.fabIcon)
    body.appendChild(this.fab)

    if (!doc.body) {
      doc.documentElement.appendChild(body)
    }
    this.fabClickHandler = () => this.toggle()
    this.fab.addEventListener('click', this.fabClickHandler, false)
  }

  isInitialized = () => this.chatInitialized
  isOpen = () => this.isChatOpen

  open = (): void => {
    if (!this.chatInitialized) {
      console.warn(ERROR_MESSAGES.NOT_INIT_YET)
      return
    }

    if (this.isChatOpen) return

    this.isChatOpen = true
    this.chatIframe.style.transform = 'scale(1)'
    this.chatIframe.style.opacity = '1'

    // update FAB
    this.fabIcon.classList.add('icon-chevron-down')
    this.fabIcon.classList.remove('icon-eusate')
    this.fab.style.transform = 'scale(0.8)'

    this.chatIframe.contentWindow?.postMessage(
      {
        type: POST_MESSAGE_TYPES.OPEN_CHAT,
        timestamp: Date.now(),
      } as MessageObjectType,
      this.chatUrl,
    )
  }

  close = () => {
    if (!this.isChatOpen) return

    this.isChatOpen = false
    this.chatIframe.style.transform = 'scale(0)'
    this.chatIframe.style.opacity = '0'

    //   change the icon to chevron down
    this.fabIcon.classList.add('icon-eusate')
    this.fabIcon.classList.remove('icon-chevron-down')
    this.fab.style.transform = 'scale(0.95)'

    // send message to the messenger core
    this.chatIframe.contentWindow?.postMessage(
      {
        type: POST_MESSAGE_TYPES.CLOSE_CHAT,
        timestamp: Date.now(),
      } as MessageObjectType,
      this.chatUrl,
    )
  }

  toggle = () => {
    // Only allow toggling if chat is initialized
    if (!this.chatInitialized) {
      console.warn(ERROR_MESSAGES.NOT_INIT_YET)
      return
    }

    if (this.chatIframe.style.transform === 'scale(1)') {
      this.close()
    } else {
      this.open()
    }
  }

  destroy = () => {
    if (this.isDestroyed) {
      console.warn(ERROR_MESSAGES.DESTROYED_ALREADY)
      return
    }

    // Close chat if open
    if (this.isChatOpen) {
      this.close()
    }

    // clear timeouts
    if (this.initTimeout) {
      clearTimeout(this.initTimeout)
      this.initTimeout = null
    }

    // Remove event listeners
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler, false)
      this.messageHandler = null
    }

    if (this.fab && this.fabClickHandler) {
      this.fab.removeEventListener('click', this.fabClickHandler, false)
      this.fabClickHandler = null
    }

    // Send destroy message to iframe
    if (this.chatIframe.contentWindow) {
      this.chatIframe.contentWindow.postMessage(
        {
          type: POST_MESSAGE_TYPES.DESTROY,
          timestamp: Date.now(),
        } as MessageObjectType,
        this.chatUrl,
      )
    }

    // Remove iframes
    this.container.remove()

    // Clear references
    EusateMessenger.instance = null
    this.isDestroyed = true

    console.log('EusateMessenger instance destroyed successfully')
  }
}

export default EusateMessenger
