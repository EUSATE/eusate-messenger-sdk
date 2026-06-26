import {
  MessengerConfig,
  ERROR_MESSAGES,
  MessageObjectType,
  POST_MESSAGE_TYPES,
  EusateEnvironment,
  ENVIRONMENT_URLS,
  minifyCSS,
} from './utils'

const CHAT_WIDGET_STYLE = minifyCSS(`
  #eusate-chat-widget-container {
    position: fixed;
    bottom: 0px;
    right: 0px;
    z-index: 10000;
    width: 0px;
    height: 0px;
  }
  #eusate-chat-widget-container #eusate-chat-widget {
    position: absolute;
    z-index: 1;
    bottom: 64px;
    right: 16px;
    width: 340px;
    max-width: calc(100dvw - 40px);
    max-height: calc(100dvh - 140px);
    outline: none;
    height: 576px;
    transform: scale(0);
    opacity: 0;
    transition-property: transform, translate, scale, rotate, opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
    border: none;
    transform-origin: bottom right;
    box-shadow: 0px 40px 72px -12px #10192824;
    pointer-events: none;
    border-radius: 12px;
  }
  #eusate-chat-widget-container #eusate-chat-widget.isOpen {
    transform: scale(1);
    opacity: 1;
    pointer-events: all;
  }
  #eusate-chat-widget-container #eusate-chat-widget-fab {
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 1;
    height: 40px;
    width: 40px;
    border: none;
    background: transparent;
  }
  @media only screen and (max-width: 640px) {
    #eusate-chat-widget-container #eusate-chat-widget {
      height: 100dvh;
      width: 100dvw;
      bottom: 0px;
      right: 0px;
      max-height: 100dvh;
      max-width: 100dvw;
      border-radius: 0px;
    }
  }
  @media only screen and (max-height: 500px) {
    #eusate-chat-widget-container #eusate-chat-widget {
      height: 100dvh;
      bottom: 0px;
      max-height: 100dvh;
    }
  }
`)
const CHAT_ICON_SVG = `
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.33323 16.0002C1.33323 7.90016 7.8999 1.3335 15.9999 1.3335C24.0999 1.3335 30.6666 7.90016 30.6666 16.0002C30.6666 24.1002 24.0999 30.6668 15.9999 30.6668H0.26123L4.08256 24.5522C2.29012 22.0613 1.32813 19.0689 1.33323 16.0002ZM15.9172 10.0002C15.21 10.0002 14.5317 10.2811 14.0316 10.7812C13.5315 11.2813 13.2506 11.9596 13.2506 12.6668V13.4082H10.5839V12.6668C10.5839 11.2523 11.1458 9.89579 12.146 8.89559C13.1462 7.8954 14.5027 7.3335 15.9172 7.3335C17.3317 7.3335 18.6883 7.8954 19.6885 8.89559C20.6887 9.89579 21.2506 11.2523 21.2506 12.6668V14.0068L20.8026 14.4042L17.2506 17.5615V19.3335H14.5839V16.3642L15.0306 15.9668L18.5839 12.8082V12.6668C18.5839 11.9596 18.3029 11.2813 17.8028 10.7812C17.3028 10.2811 16.6245 10.0002 15.9172 10.0002ZM14.5839 24.0002V21.3335H17.2506V24.0002H14.5839Z" fill="white"/>
    </svg>`
const CHEVRON_DOWN_SVG = `
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.8402 17.8999L26.8002 30.9399C25.2602 32.4799 22.7402 32.4799 21.2002 30.9399L8.16016 17.8999" stroke="white" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
const FAB_STYLE = minifyCSS(`
  body {
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
  }
  #eusate-messenger-fab-btn {
    width: 100%;
    height: 100%;
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
  }
  #eusate-messenger-fab-btn:not(:disabled):hover { transform: scale(1); }
  #eusate-messenger-fab-btn:not(:disabled):active { transform: scale(0.9); }
  #eusate-messenger-fab-btn.is-open { transform: scale(0.9); }
  #eusate-messenger-fab-btn.is-open:not(:disabled):hover { transform: scale(1); }
  .fab-icon-chevron { display: none; }
  #eusate-messenger-fab-btn.is-open .fab-icon-chat { display: none; }
  #eusate-messenger-fab-btn.is-open .fab-icon-chevron { display: block; }
`)

class EusateMessenger {
  private static instance: EusateMessenger | null = null

  private container: HTMLDivElement
  private fabIframe: HTMLIFrameElement
  private chatIframe: HTMLIFrameElement
  private fab: HTMLButtonElement
  private apiKey: string
  private chatUrl: string
  private onReady?: () => void
  private onError?: (error: Error) => void
  private chatInitialized: boolean = false
  private isChatOpen: boolean = false
  private isDestroyed: boolean = false

  private chatOrigin: string = ''
  private fabClickHandler: (() => void) | null = null
  private messageHandler: ((evt: MessageEvent) => void) | null = null
  private initTimeout: NodeJS.Timeout | null = null

  private constructor(config: MessengerConfig) {
    this.apiKey = config?.apiKey.trim()
    this.onReady = config.onReady
    this.onError = config.onError
    this.chatUrl =
      ENVIRONMENT_URLS[config?.environment || EusateEnvironment.PROD]
    this.chatOrigin = new URL(this.chatUrl).origin

    this.container = document.createElement('div')
    this.fabIframe = document.createElement('iframe')
    this.chatIframe = document.createElement('iframe')
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
    } catch (error) {
      this.handleError(
        new Error(`${ERROR_MESSAGES.ERROR}, ${(error as Error).message}`),
      )
    }
  }

  private setupContainer = () => {
    this.container.id = 'eusate-chat-widget-container'
    this.container.setAttribute('data-eusate-widget', 'true')
  }

  private setupFabIframe = () => {
    this.fabIframe.id = 'eusate-chat-widget-fab'
    this.fabIframe.setAttribute('title', 'Open chat support')
    this.fabIframe.setAttribute('aria-label', 'Open chat support')

    this.container.appendChild(this.fabIframe)
  }

  private setupChatIframe = () => {
    this.chatIframe.id = 'eusate-chat-widget'
    this.chatIframe.src = this.chatUrl

    let style = document.querySelector('#eusate-chat-widget')

    // create style tag on page's head
    if (!style) {
      style = document.createElement('style')
      style.id = 'eusate-chat-widget'
      document.head.append(style)
    }

    style.textContent = CHAT_WIDGET_STYLE

    this.chatIframe.setAttribute('title', 'Eusate chat support')
    this.chatIframe.setAttribute('aria-hidden', 'true')
    this.chatIframe.setAttribute(
      'sandbox',
      'allow-scripts allow-downloads allow-popups-to-escape-sandbox allow-forms allow-same-origin allow-popups allow-modals',
    )
    this.chatIframe.setAttribute('allow', `microphone ${this.chatUrl};`)

    this.chatIframe.onload = () => this.handleChatIframeLoad()
    this.chatIframe.onerror = () => this.handleIframeError()

    this.container.appendChild(this.chatIframe)
  }

  private handleChatIframeLoad = (): void => {
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
    }, 10 * 1000)
  }

  private handleIframeError = (): void => {
    this.handleError(new Error(ERROR_MESSAGES.IFRAME_LOAD))
  }

  private setupMessageHandlers = (): void => {
    this.messageHandler = (evt: MessageEvent) => {
      if (evt.origin !== this.chatOrigin) return

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
    this.loadFab()
  }

  private handleError = (error: Error): void => {
    if (this.initTimeout) {
      clearTimeout(this.initTimeout)
      this.initTimeout = null
    }

    this.destroy()

    this.onError?.(error)
  }

  private loadFab = () => {
    const doc = this.fabIframe.contentDocument
    if (!doc) {
      setTimeout(() => this.loadFab(), 100)
      return
    }

    const head = doc.head || doc.createElement('head')
    const style = doc.createElement('style')
    style.textContent = FAB_STYLE
    head.appendChild(style)
    if (!doc.head) doc.documentElement.appendChild(head)

    const body = doc.body || doc.createElement('body')
    this.fab.id = 'eusate-messenger-fab-btn'
    this.fab.innerHTML = `
      <span class="fab-icon-chat">${CHAT_ICON_SVG}</span>
      <span class="fab-icon-chevron">${CHEVRON_DOWN_SVG}</span>`

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
    this.chatIframe.classList.add('isOpen')
    this.fab.classList.add('is-open')

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
    this.chatIframe.classList.remove('isOpen')
    this.fab.classList.remove('is-open')

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
    if (!this.chatInitialized) {
      console.warn(ERROR_MESSAGES.NOT_INIT_YET)
      return
    }

    if (this.isChatOpen) {
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

    // remove css styles
    document.querySelector('#eusate-chat-widget')?.remove()
  }
}

export default EusateMessenger
