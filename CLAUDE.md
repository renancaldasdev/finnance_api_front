# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Stack

**Nuxt 4** (full-stack Vue framework) + **Vue 3** + **TypeScript** with server-side rendering and static generation capabilities. This is a minimal starter template.

## Development Commands

```bash
npm run dev        # Start dev server on http://localhost:3000 with HMR
npm run build      # Build for production (outputs to .output/)
npm run preview    # Preview production build locally
npm run generate   # Generate static site (for SSG)
npm install        # Install dependencies + run nuxt prepare (auto-generates types)
```

The project uses **npm** as the package manager by default.

## Project Structure

```
app/
  app.vue          # Root Vue component (entry point)
  
public/            # Static assets served as-is (favicon, robots.txt)
  
nuxt.config.ts     # Nuxt configuration (env, modules, devtools, etc.)

tsconfig.json      # TypeScript config (references auto-generated .nuxt/ configs)

.nuxt/             # Auto-generated build artifacts and type definitions (excluded from git)
```

### Auto-Generated Nuxt Directories (in .gitignore)

- `.nuxt/` — Built assets, type definitions (components.d.ts, imports.d.ts, etc.), Nitro server routes
- `.output/` — Production build output (SPA or SSR)
- `.nitro/` — Nitro (Nuxt server engine) build cache

These are regenerated on `npm install` and `npm run build`. Do not edit them.

## Key Architecture Patterns

### Vue Components & Auto-Imports

Nuxt auto-discovers and imports:
- **Components** from `app/components/**/*.vue` → use as `<ComponentName />` without imports
- **Composables** from `app/composables/**/*.ts` → use as `useComposableName()` without imports
- **Utils** from `app/utils/**/*.ts` → auto-imported functions

Type definitions are auto-generated in `.nuxt/components.d.ts` and `.nuxt/imports.d.ts` after `npm install`.

### Routing

Nuxt uses **file-based routing**. Create pages in `app/pages/` and they become routes:
- `app/pages/index.vue` → `/`
- `app/pages/about.vue` → `/about`
- `app/pages/[id].vue` → `/dynamic-route/:id`

No explicit router setup needed—Vue Router is auto-configured by Nuxt.

### TypeScript Setup

TypeScript is pre-configured. The `tsconfig.json` references auto-generated configs in `.nuxt/`:
- `.nuxt/tsconfig.app.json` — App-side types
- `.nuxt/tsconfig.server.json` — Server-side (Nitro) types
- `.nuxt/tsconfig.shared.json` — Shared types
- `.nuxt/tsconfig.node.json` — Build tool types

Types are generated on `npm install` and updated by `nuxt prepare`.

## Development Flow

1. **Create a page** in `app/pages/MyPage.vue`
2. **Route is automatic** (no router config needed)
3. **Components and composables auto-import** (just use them)
4. **TypeScript types auto-generate** (checked on save in editor)
5. **HMR works** — changes reflect instantly in `npm run dev`

## Key Configuration

**nuxt.config.ts** is minimal. Common patterns to add:
- `modules` — Install Nuxt modules (UI libraries, auth, etc.)
- `routeRules` — Cache & prerender control for hybrid rendering
- `ssr` — Toggle SSR on/off (default: true)
- `devtools.enabled` — Nuxt DevTools (enabled by default)

See [nuxt.com/docs/api/configuration/nuxt-config](https://nuxt.com/docs/api/configuration/nuxt-config) for all options.

## Server Routes & Nitro

Nuxt uses **Nitro** as the backend. Create API endpoints in `app/server/routes/` or `app/server/api/`:
- `app/server/api/users.get.ts` → `GET /api/users`
- `app/server/middleware/` — Server middleware
- `app/server/utils/` — Server-side utilities

Nitro runs in production and dev server (no separate backend needed for basic APIs).

## Environment Variables

Create `.env` file in the root:
```
NUXT_PUBLIC_API_BASE=http://localhost:3000  # Public vars prefixed with NUXT_PUBLIC_
NUXT_SECRET_KEY=...                          # Private server-only vars
```

Access in components with `process.env.NUXT_PUBLIC_*` or use `useRuntimeConfig()` for both public and private.

## Deployment

- **SSR (default)** — Deploy `.output/` folder to any Node.js host or Vercel/Netlify
- **SSG** — Run `npm run generate` to pre-render all pages, deploy `dist/` as static site
- **SPA** — Set `ssr: false` in `nuxt.config.ts`, deploy `dist/` folder

## When Something Breaks

- **`npm run dev` fails with "options.hostname.toLowerCase is not a function"?** → Known issue with Nuxt 4.6.3+ and Node 26+. Fixed in this project (uses Nuxt 4.5.1). If it happens again, downgrade Nuxt: `npm install nuxt@4.5.1`
- **Types not updating?** → Run `npm install` (triggers `nuxt prepare`)
- **Imports not found?** → Check file is in auto-import directory (`components/`, `composables/`, `utils/`, `server/`)
- **Module not found?** → Run `npm install`, check tsconfig error in `.nuxt/`
- **Page not routing?** → Ensure file is in `app/pages/` with `.vue` extension

## Next Steps to Extend This Project

- Add UI framework: `npm install @nuxt/ui` and configure in `nuxt.config.ts`
- Add state management: use `useState()` (Nuxt composable) or install Pinia
- Add database: create server routes in `app/server/api/` and connect to your finance API
- Style: add `app.css` and import in `app.vue`, or use Tailwind via `@nuxtjs/tailwindcss`
