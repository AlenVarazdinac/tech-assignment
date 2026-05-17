# Nordhealth Sign-Up Assignment

A client-side sign-up form built with **Nuxt 3**, the **Nordhealth VET design system**, and **TypeScript**.

## Features

- Sign-up form with real-time validation (email format, password strength)
- Password visibility toggle and live requirements checklist
- Dark/light theme toggle with system preference detection and localStorage persistence
- Accessible: `aria-live` regions, `autocomplete` attributes, keyboard navigation, focus management on errors
- Protected `/success` route via global Nuxt route middleware
- Unit tests (Vitest) and E2E tests (Playwright)

## Stack

| Concern | Choice |
|---|---|
| Framework | Nuxt 3 (SPA, `ssr: false`) |
| Design system | @nordhealth/components, VET theme |
| Styling | Nordhealth CSS + Tailwind CSS v4 |
| State | Vue `useState` |
| Testing | Vitest + @nuxt/test-utils, Playwright |
| Deployment | Docker (multi-stage) |

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

## Scripts

```bash
npm run build            # Production build
npm test                 # All tests (unit + E2E), single run - use this in CI
npm run test:unit        # Unit tests only (single run)
npm run test:unit:watch  # Unit tests in watch mode
npm run test:e2e         # E2E tests only (starts dev server automatically)
npm run test:e2e:ui      # E2E tests with Playwright UI
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
```

## Architecture decisions

**SPA mode (`ssr: false`)** - Required by the assignment. Nuxt renders a single HTML shell; everything runs in the browser. This simplifies the theme switching and plugin setup (single Vite build, no hydration concerns). Note: requires `experimental: { viteEnvironmentApi: true }` as a workaround for a [known Nuxt issue](https://github.com/nuxt/nuxt/issues/34957) affecting SPA mode dev server startup.

**No validation library** - The form has two fields with straightforward rules. A custom composable (`useSignUpForm`) is sufficient and avoids the bundle overhead and framework indirection of Vuelidate or VeeValidate. If the form grows (async server checks, cross-field rules, many fields), migrating to a dedicated library at that point would be the right call.

**No Pinia** - `useState` provides reactive state with auto-deduplication across composables. A separate store layer adds indirection without benefit at this scale. Pinia would be the right choice once the app has multiple feature areas sharing state or needs DevTools inspection.

**Theme switching via CSS injection** - Both `vet.css` and `vet-dark.css` target `:root`. Loading both in `nuxt.config` means dark always wins. The solution: import `vet-dark.css` as a raw string (`?raw`), then dynamically inject it as a `<style>` tag via `document.createElement` only when dark mode is active. Since the injected tag comes after the bundled CSS in the document, the cascade works correctly. `@nuxtjs/color-mode` doesn't work here because it operates on class toggling, not stylesheet injection.

**Colon-namespaced keys** (`color-scheme:dark`, `auth:user`) - Groups related keys in `localStorage`/`useState` and avoids collisions with third-party code.

**Shared types in `types/index.ts`** - All shared interfaces (`AuthUser`, `FieldErrors`, `PasswordRequirement`) live in `types/index.ts`. With `imports: { dirs: ['types'] }` in `nuxt.config.ts`, Nuxt generates global type declarations from that directory - no explicit imports needed in composables or pages. `interface` is used for object shapes (marginally faster TypeScript compilation due to caching); `type` would be the choice for unions, primitives, or mapped types.

**Pre-commit hook with lint-staged** - `simple-git-hooks` runs `lint-staged` on every commit, which runs ESLint (with auto-fix) only on staged `.ts`, `.vue`, and `.js` files. Fast (<1s), focused on what's actually being committed.

## CI

GitHub Actions runs on every push and pull request to `main` (`.github/workflows/ci.yml`):

1. Install dependencies (`npm ci`)
2. Unit tests
3. Install Playwright + Chromium
4. E2E tests (dev server starts automatically via `webServer` in `playwright.config.ts`)

If E2E tests fail, the Playwright HTML report is uploaded as an artifact and available for download from the Actions tab for 7 days.

## Docker

```bash
# Build
docker build -t nordhealth-assignment .

# Run
docker run -p 3000:3000 nordhealth-assignment
```

The image uses a multi-stage build: dependencies and source are compiled in a `build` stage, and only the `.output` directory is copied into the lean `runtime` stage. Final image size is roughly 180 MB.
