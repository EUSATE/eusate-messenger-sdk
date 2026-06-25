import { PROD_CONFIG } from './constants'

export const debug = (...args: unknown[]) => {
  if (PROD_CONFIG.DEBUG) {
    console.log('[Eusate SDK Debug]', ...args)
  }
}

export const minifyCSS = (css: string): string =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1')
    .trim()
