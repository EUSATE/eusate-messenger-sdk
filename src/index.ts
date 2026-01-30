import EusateMessenger from './MessengerUI'
import {
  ERROR_MESSAGES,
  EusateMessengerSDK,
  MessengerConfig,
  PROD_CONFIG,
} from './utils'

declare global {
  interface Window {
    Eusate: object
  }
}

const Eusate: EusateMessengerSDK = {
  init: (config: string | MessengerConfig) => {
    if (typeof window === 'undefined') {
      console.warn(
        '[Eusate] Cannot initialize on server-side. Will initialize when browser loads.',
      )
      return
    }
    try {
      const configuration: MessengerConfig =
        typeof config === 'string' ? { apiKey: config } : config

      EusateMessenger.getInstance(configuration)
    } catch (error) {
      console.error(ERROR_MESSAGES.ERROR, error)
      throw error
    }
  },
  open: () => {
    if (typeof window === 'undefined') return
    try {
      EusateMessenger.getInstance().open()
    } catch (error) {
      console.error(ERROR_MESSAGES.ERROR, error)
    }
  },
  close: () => {
    if (typeof window === 'undefined') return
    try {
      EusateMessenger.getInstance().close()
    } catch (error) {
      console.error(ERROR_MESSAGES.ERROR, error)
    }
  },
  destroy: () => {
    if (typeof window === 'undefined') return
    try {
      EusateMessenger.getInstance().destroy()
    } catch (error) {
      console.error(ERROR_MESSAGES.ERROR, error)
    }
  },
  isInitialized: () => {
    if (typeof window === 'undefined') return false
    try {
      return EusateMessenger.getInstance().isInitialized()
    } catch {
      return false
    }
  },
  isOpen: () => {
    if (typeof window === 'undefined') return false
    try {
      return EusateMessenger.getInstance().isOpen()
    } catch {
      return false
    }
  },
  version: PROD_CONFIG.VERSION,
}

if (typeof window !== 'undefined') {
  window.Eusate = Eusate
}

export default Eusate
