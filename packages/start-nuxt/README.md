# start-nuxt

**Nuxt 3 start page with Supabase authentication for Universo Platformo**

[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82.svg)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E.svg)](https://supabase.com/)

[🇷🇺 Русская версия](./README-RU.md)

## 📖 Overview

`packages/start-nuxt` is the entry-point application for Universo Platformo built with
**Nuxt 3** as a fullstack framework. It implements the start pages and Supabase
authentication following the architecture of the React reference implementation.

The frontend **never communicates with Supabase directly**. All Supabase access
happens exclusively through Nuxt server API routes, keeping all credentials
server-side only.

## 🗂 Package Structure

```
packages/start-nuxt/
├── app.vue                        # Root Nuxt application component
├── nuxt.config.ts                 # Nuxt configuration
├── package.json                   # Package dependencies
├── tsconfig.json                  # TypeScript configuration
├── .env.example                   # Required environment variables template
│
├── pages/
│   ├── index.vue                  # Start page (guest or authenticated view)
│   └── auth.vue                   # Login / register page
│
├── components/
│   ├── AppBar.vue                 # Top navigation bar
│   ├── GuestStartPage.vue         # Landing page for unauthenticated users
│   ├── AuthenticatedStartPage.vue # Onboarding wizard for authenticated users
│   ├── Hero.vue                   # Hero section with CTA
│   ├── Testimonials.vue           # Universo ecosystem product cards
│   ├── StartFooter.vue            # Footer (guest / internal variants)
│   └── OnboardingWizard.vue       # Multi-step onboarding wizard
│
├── composables/
│   └── useAuth.ts                 # SSR-safe auth state (useState)
│
├── server/
│   ├── utils/
│   │   └── supabase.ts            # Supabase client factories (server-only)
│   └── api/v1/
│       ├── auth/
│       │   ├── login.post.ts      # POST /api/v1/auth/login
│       │   ├── logout.post.ts     # POST /api/v1/auth/logout
│       │   ├── me.get.ts          # GET  /api/v1/auth/me
│       │   └── register.post.ts   # POST /api/v1/auth/register
│       └── onboarding/
│           ├── items.get.ts       # GET  /api/v1/onboarding/items
│           └── join.post.ts       # POST /api/v1/onboarding/join
│
├── i18n/locales/
│   ├── en.json                    # English translations
│   └── ru.json                    # Russian translations
│
└── assets/css/
    └── main.css                   # Global styles
```

## 🚀 Features

### Pages

| Route   | Description                                                     |
| ------- | --------------------------------------------------------------- |
| `/`     | Start page — shows `GuestStartPage` or `AuthenticatedStartPage` |
| `/auth` | Login / register form with toggle and error display             |

### Authentication Flow

1. User submits email + password on `/auth`
2. `POST /api/v1/auth/login` calls Supabase server-side and sets HTTP-only cookies
3. Subsequent requests carry cookies — the frontend never stores tokens in JS
4. `GET /api/v1/auth/me` validates the cookie and auto-refreshes expired tokens
5. `POST /api/v1/auth/logout` invalidates the Supabase session and clears cookies

### Onboarding Wizard

Five-step wizard displayed for authenticated users:

1. **Welcome** — introduction message
2. **Projects** — select Global Goals
3. **Campaigns** — select Personal Interests
4. **Clusters** — select Platform Features
5. **Completion** — confirmation with option to update preferences

## 🛠 Technology Stack

| Layer             | Technology                       |
| ----------------- | -------------------------------- |
| Framework         | Nuxt 3 (Vue 3 + Nitro)           |
| Language          | TypeScript (strict)              |
| Auth / Database   | Supabase (via server routes)     |
| Internationalisation | @nuxtjs/i18n (en + ru)        |
| Styling           | Scoped CSS (no external UI lib)  |
| Package manager   | PNPM                             |

## 🔒 Security Architecture

- **Supabase credentials are server-only**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
  and `SUPABASE_SERVICE_ROLE_KEY` are never sent to the browser.
- **HTTP-only cookies**: Access and refresh tokens live in `HttpOnly; SameSite=Lax`
  cookies — inaccessible to JavaScript running in the browser.
- **Three Supabase client types**:
  - `createSupabaseAdminClient()` — service role, bypasses RLS (privileged ops only)
  - `createSupabaseAuthClient()` — anon key, no user token (sign-in / refresh)
  - `createSupabaseUserClient(token)` — anon key + user JWT, respects RLS

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase project credentials:

```bash
cp .env.example .env
```

| Variable                   | Required | Description                          |
| -------------------------- | -------- | ------------------------------------ |
| `SUPABASE_URL`             | ✅       | Supabase project URL                 |
| `SUPABASE_ANON_KEY`        | ✅       | Public anon key (server-only here)   |
| `SUPABASE_SERVICE_ROLE_KEY`| ✅       | Service role key (privileged ops)    |
| `JWT_SECRET`               | optional | Additional JWT validation secret     |
| `NODE_ENV`                 | optional | `development` (default) / `production` |

## 🧩 Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
cd packages/start-nuxt
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm typecheck
```

## 🌐 Internationalisation

Translation files are in `i18n/locales/`. The default locale is **Russian** (`ru`).
The app also supports **English** (`en`). Locale detection uses a browser cookie
(`i18n_redirected`).

## 📄 License

MIT — see [LICENSE](../../LICENSE)
