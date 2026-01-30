import { PROD_CONFIG } from './constants'

export const debug = (...args: unknown[]) => {
  if (PROD_CONFIG.DEBUG) {
    console.log('[Eusate SDK Debug]', ...args)
  }
}
