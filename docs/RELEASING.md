# Release Process

## Overview

This documentation assumes that the update that is to be published is already done. Publishing an update to this package should follow these steps outlined in the checklist.

### Release Checklist

#### 1. Manual Testing

Test the SDK in multiple environments:

##### using npm (For React and Next.js applications)

```bash
# Run this command on @eusate/messenger-sdk's terminal to create a symbolic link to the project locally
npm link

# Go to your test project's terminal and run this command
npm link @eusate/messenger-sdk

# Start the app in development mode and use the package as written in the usage documentation
npm run dev # or npm start for react applications
```

##### Using CDN link

For now, you can create a folder called ui in this same project (the folder is noted in the .gitignore file it will not be tracked by git). Create an html template page and using this script at the bottom of the `<body>` tag:

```html
<script src="/dist/eusate-sdk.min.js"></script>
```

##### Manual test checklist

For both test cases, ensure to test for these:

- [ ] Verify initialization works
- [ ] Verify open/close works
- [ ] Verify destroy
- [ ] Verify no console errors

When you are done testing and we are good to go, ensure that chatbot-core project is deployed. Also, ensure that the update is properly committed and you have a clean tree before moving forward.

#### 2. Clean Install & Pre-release checks

```bash
# do a clean install on all project dependency.
npm ci

# Run the pre-release check
npm run prerelease
```

If checks fail, fix issues and start from [Manual Testing](https://github.com/EUSATE/eusate-messenger-sdk/blob/main/docs/RELEASING.md#manual-testing)

#### 3. Update CHANGELOG.md

- [ ] Open [CHANGELOG.md](https://github.com/EUSATE/eusate-messenger-sdk/blob/main/CHANGELOG.md)
- [ ] Move items from [Unreleased] section to new version section
- [ ] Add release date
- [ ] Add version comparison link at bottom
- [ ] Determine version number according to [VERSIONING.md](https://github.com/EUSATE/eusate-messenger-sdk/blob/main/docs/VERSIONING.md)
- [ ] Commit CHANGELOG: `git add CHANGELOG.md && git commit -m "doc(): update changelog for vX.Y.Z"` and push.

##### Example

```markdown
## [Unreleased]

## [0.1.1] - 2025-10-04

### Fixed

- Fixed memory leak in destroy method
- Corrected TypeScript type definitions

### Added

- Added initialization timeout handling

[0.1.1]: https://github.com/EUSATE/eusate-messenger-sdk/compare/v0.1.0...v0.1.1
```

#### 4. Run Version script

Run the appropriate version script according to [VERSIONING.md](https://github.com/EUSATE/eusate-messenger-sdk/blob/main/docs/VERSIONING.md)

##### What this does automatically:

1. [x] Runs pre-release checks again
2. [x] Bumps version in package.json
3. [x] Rebuilds with new version
4. [x] Creates git commit: "Release vX.Y.Z"
5. [x] Creates git tag: vX.Y.Z
6. [x] Pushes commit and tag to GitHub (via postversion hook)

#### 5. Create Github Release

- [ ] Verify the newly created tag on https://github.com/EUSATE/eusate-messenger-sdk/tags
- [ ] Go to: https://github.com/EUSATE/eusate-messenger-sdk/releases/new
- [ ] Choose tag: Select the tag you just created (vX.Y.Z)
- [ ] Release title: vX.Y.Z
- [ ] Description: Copy the changes from CHANGELOG.md for this version
- [ ] Click "Publish release"

or use Github CLI:

```bash
gh release create vX.Y.Z --notes "$(sed -n '/## \[X.Y.Z\]/,/## \[/p' CHANGELOG.md | head -n -1)"
```

#### 6. Authentication

This step logs you in to the eusate_ai account with a granular token

```bash
export NPM_TOKEN = $NPM_TOKEN
```

NPM_TOKEN can be gotten from [here](https://docs.google.com/document/d/1qPR7nnp9_Yo6cAspAzx05lm4gQjpziEUb3oyM02Wh4I/edit?tab=t.0)

Verify log in with this

```bash
> npm whoami
eusate_ai
```

#### 7. Publish to NPM

```bash
# This automatically runs prepublishOnly (lint, type-check, build)
npm publish
```

Note: You may be prompted for an OTP (one-time password) from your authenticator app.

##### What this does automatically:

1. [x] Runs prepublishOnly hook (lint, type-check, build)
2. [x] Packages the dist/ folder
3. [x] Uploads to NPM registry

#### 8. Verify Publication

```bash
# Check package is live
npm view @eusate/messenger-sdk

# Check version is listed
npm view @eusate/messenger-sdk versions

# Test installation
npm install @eusate/messenger-sdk@latest
```

Visit: https://www.npmjs.com/package/@eusate/messenger-sdk

#### 9. Post-Release

- [ ] Update public documentation
- [ ] Send a release note to the team
