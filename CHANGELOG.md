# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `minifyCSS` utility in `utils/helpers` — strips CSS comments and collapses whitespace around block delimiters (`{`, `}`, `;`), safe for `calc()` expressions and pseudo-selectors
- `CHAT_WIDGET_STYLE` and `FAB_STYLE` module-level CSS constants consolidate all widget styles (container, iframe sizing, chat widget animation, responsive breakpoints, FAB states) in one place, evaluated once at module load via `minifyCSS`
- Inline SVG constants (`CHAT_ICON_SVG`, `CHEVRON_DOWN_SVG`) replace the icomoon font dependency; both icons are rendered once into the DOM and toggled by CSS class, eliminating the `innerHTML` swap on every open/close

### Changed

- Resized FAB iframe and button from 80×80px to 40×40px; repositioned 16px from the bottom-right edge
- Reduced chat widget width from 390px to 340px; repositioned to `bottom: 64px` / `right: 16px`
- FAB visual states (rest, hover, press, open) are now fully CSS-driven via `:hover`, `:active`, `:not(:disabled)`, and an `.is-open` class toggle — all JS mouse event handlers and imperative `style.transform` calls removed
- `open()` and `close()` are now pure state methods that toggle classes and dispatch postMessages with no visual side-effects
- `chatOrigin` cached as an instance field at construction time instead of allocating `new URL()` on every incoming `message` event

### Fixed

- Added `border-radius: 12px` to the chat widget (reset to `0` on the mobile full-screen breakpoint)
- Removed duplicate `transform: scale(0)` and `opacity: 0` declarations from the injected stylesheet

## [0.2.6] - 2026-05-26

### Update

- Expanded chat iframe sandbox to include `allow-downloads` and `allow-popups-to-escape-sandbox`, enabling file download flows and allowing popups (e.g. OAuth redirects, external links) to escape sandbox restrictions

## [0.2.5] - 2026-02-14

### Update

- The chat iframe attributes were updated to allow modals and also access to the host page's microphone

## [0.2.4] - 2026-02-08

### Update

- Syncing versions for both CDN and npm package

## [0.2.3] - 2026-02-06

### Fixed

- Fixed frozen screen on mobile when chat is closed.

## [0.2.2] - 2026-02-06

### Fixed

- Cleaned up styles added to the head of the parent page properly on destruction and creation to avoid duplicate stylesheet
- Controlled the open and close state with variables and class names instead of manually using style properties
- Ensured that the height doesn't overflow the screen on the top no matter the height of the device

### Updated

- Exported the EusateEnvironment enum for test purposes

## [0.2.1] - 2026-02-06

### Updated

- Release documentation to include the use of granular access token for authentication

### Changed

- Made the chat screen fullscreen on mobile

### Fixed

- Fixed the FAB flicker on initialization

## [0.2.0] - 2026-01-30

### Added

- Support for dev internal testing by allowing input for environment selection

## [0.1.2] - 2025-10-08

### Changed

- Chat url to target production

### Fixes

- Github action error due to ACLs fixed.

## [0.1.1] - 2025-10-08

#### Added

- Github actions to deploy sdk file to cdn link

### Fixes

- Checkbox now rendering correctly in docs

## [0.1.0] - 2025-10-05

### Added

- Initial release of Eusate Messenger SDK
- Singleton pattern implementation with proper cleanup
- `window.Eusate` global API for browser usage
- Direct ES module support for bundlers (Next.js, Vite, etc.)
- IIFE build for CDN usage
- SSR-safe implementation (works with Next.js App Router)
- TypeScript support with full type definitions
- Secure postMessage communication with chatbot-core
- Chat widget with open/close/destroy methods
- Support for initialization callbacks (onReady, onError)
- API key-based authentication
- Automatic session management

### Security

- API key never exposed in URL parameters
- Strict origin validation for postMessage
- Sandboxed iframe with restricted permissions
- httpOnly cookie session management in chatbot-core

[Unreleased]: https://github.com/EUSATE/eusate-messenger-sdk/compare/v0.2.6...HEAD
[0.2.6]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.2.6
[0.2.5]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.2.5
[0.2.4]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.2.4
[0.2.3]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.2.3
[0.2.2]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.2.2
[0.2.1]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.2.1
[0.2.0]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.2.0
[0.1.2]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.1.2
[0.1.1]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.1.1
[0.1.0]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.1.0
