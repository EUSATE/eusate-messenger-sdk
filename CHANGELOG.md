# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/EUSATE/eusate-messenger-sdk/compare/v0.1.1...HEAD
[0.2.0]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.2.0
[0.1.2]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.1.2
[0.1.1]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.1.1
[0.1.0]: https://github.com/EUSATE/eusate-messenger-sdk/releases/tag/v0.1.0
