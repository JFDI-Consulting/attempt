# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-11-15

### Added
- **Generic error type parameter**: You can now specify custom error types for both `attempt` and `attemptPromise`
  - Both functions now accept two type parameters: `<T, E = Error>`
  - The error type defaults to `Error` for backward compatibility
  - Example: `attempt<User, ValidationError>(() => ...)`
- Package metadata:
  - `sideEffects: false` for better tree-shaking support
  - `engines` field specifying Node.js ^20.19.0 || >=22.12.0

### Changed
- **Major dependency upgrades**:
  - ESLint: 8.54.0 → 9.39.1 (migrated to flat config format)
  - TypeScript: 5.3.2 → 5.9.3
  - Vite: 5.0.2 → 7.2.2
  - Vitest: 0.34.6 → 4.0.9
  - Prettier: 2.8.8 → 3.6.2
  - All other dev dependencies updated to latest versions
- Build tooling:
  - Migrated ESLint configuration from `.eslintrc.json` to `eslint.config.js` (flat config)
  - Updated package.json exports order (types before import/require)
  - Replaced deprecated `@vitest/coverage-c8` with `@vitest/coverage-v8`

### Fixed
- Package.json exports now list types first for better IDE support

## [1.3.9] - Previous release

### Changed
- Type export improvements
- CJS package fixes

## [1.2.x] - Previous releases

### Removed
- `attemptAllPromise` function (caused confusion, may be replaced with better implementation in future)
