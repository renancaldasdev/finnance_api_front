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

## Laravel Sanctum Integration

This project is pre-configured to work with Laravel Sanctum authentication via `http://localhost`.

### Setup

1. Create `.env` file with:

```
NUXT_PUBLIC_API_BASE=http://localhost
```

2. Ensure your Laravel API is running and has Sanctum enabled:

```bash
# Laravel backend
php artisan serve --port=8000
```

### How It Works

- **useAuth()** — Login, register, logout, get current user
- **useApi()** — Make authenticated requests to `/api/*` endpoints (auto-includes Bearer token)
- **useTransactions()** — Example CRUD composable for transactions (pattern for other entities)
- **auth middleware** — Protects pages, redirects to `/login` if not authenticated

### Creating New API Composables

Follow the `useTransactions()` pattern. Example for accounts:

```typescript
// app/composables/useAccounts.ts
export const useAccounts = () => {
  const { get, post, put, del } = useApi();

  const accounts = ref<any[]>([]);
  const fetchAccounts = async () => {
    const data = await get('/accounts');
    accounts.value = data.data || data;
  };

  return { accounts, fetchAccounts /* ... */ };
};
```

Then use in pages: `const { accounts, fetchAccounts } = useAccounts()`

### Token Storage

- Token stored in `localStorage` as `auth_token`
- Automatically sent as `Authorization: Bearer <token>` header on all requests
- 401 response auto-clears token and redirects to `/login`

### API Response Format

Expected Laravel responses:

- **Login/Register:** `{ token: "...", user: {...} }`
- **GET /api/resource:** `{ data: [...] }` or `[...]`
- **POST/PUT/PATCH:** `{ data: {...} }` or `{...}`
- **DELETE:** any response

Adapters in composables handle both formats.

## Finannce Design System & Styling

**CRITICAL: Always use Tailwind CSS classes, never `<style scoped>` blocks.**

All styling must follow the Finannce design system from `docs/finnance_design/design-system/`:

- **Design tokens**: CSS variables defined in `app/app.css` (colors, spacing, typography, radius)
  - Colors: `--brand`, `--ink`, `--surface-raised`, `--line`, `--danger`, `--warning-soft`, etc.
  - Spacing: `--space-1` (4px) through `--space-10` (40px)
  - Radius: `--radius-sm` (8px), `--radius-md` (10px), `--radius-lg` (16px), `--radius-xl`, `--radius-pill`
  - Fonts: `--font-sans` (Manrope), weights 400–800

- **Tailwind configuration**: Tokens are mapped to Tailwind utilities in `nuxt.config.ts` via `@theme`
  - Use `bg-surface`, `text-brand`, `border-line`, `rounded-lg`, `p-6`, `gap-4`, etc.
  - Never hardcode colors—use token-based utilities

- **Layout rules from design guide**:
  - Content padding: `32px clamp(16px, 3vw, 40px) 48px`
  - Cards: `bg-surface-raised border border-line rounded-lg p-6`
  - Sidebar: 240px base width, no `position: sticky` or `100vh`, uses `flex-wrap`
  - Buttons: min-height `--control-height` (44px), use brand color with hover to brand-strong

### API Values & Amount Formatting

**Backend returns amounts in decimal R$ (not centavos):** e.g., `6320.15` = R$ 6.320,15

- **Do NOT divide by 100** when displaying amounts—API already returns correct values
- Format with `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- When form inputs collect amounts in R$, send them directly to API (no multiplication)

## Next Steps to Extend This Project

- Add UI framework: `npm install @nuxt/ui` and configure in `nuxt.config.ts`
- Add more composables for other API entities (accounts, categories, budgets, etc.)
- Add charts/analytics: install `chart.js` or `plotly.js` for financial dashboards
- Add validation: use `vee-validate` + `zod` for form validation
- Customize styles: create `app.css` or use Tailwind via `@nuxtjs/tailwindcss`
