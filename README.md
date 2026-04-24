# NgCoreKit

Production-ready SaaS boilerplate — Angular 21 frontend + NestJS 11 API, structured as a Turborepo monorepo.

## Stack

| Layer       | Technology                                                        |
| ----------- | ----------------------------------------------------------------- |
| Frontend    | Angular 21, NgRx Signals, TanStack Query, Tailwind CSS v4        |
| Backend     | NestJS 11, Prisma ORM, PostgreSQL, Redis                         |
| Auth        | Better Auth (email/password, OAuth: GitHub, Google)              |
| Billing     | Stripe (subscriptions, webhooks)                                 |
| Monorepo    | Turborepo + pnpm workspaces                                      |
| Infra (dev) | Docker Compose (Postgres 16, Redis 7, Stripe CLI)                |

## Workspaces

```
NgCoreKit/
├── apps/
│   ├── api/          # NestJS API (port 3001)
│   └── web/          # Angular app (port 4200)
└── packages/
    ├── config/       # Shared ESLint & TypeScript configs
    └── types/        # Shared TypeScript types
```

## Getting started

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- Docker & Docker Compose

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` and fill in the required values (see [Environment variables](#environment-variables)).

### 3. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL, Redis, and the Stripe CLI webhook forwarder.

### 4. Run database migrations

```bash
cd apps/api
pnpm prisma:migrate
```

### 5. Start dev servers

```bash
# From repo root
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:4200
- Swagger: http://localhost:3001/api/docs

## Commands

### Root

```bash
pnpm dev          # Start all apps in parallel
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm format       # Format with Prettier
pnpm check-types  # TypeScript type checking
```

### API (`apps/api`)

```bash
pnpm dev              # Watch mode
pnpm build            # Production build
pnpm test:ci          # Run tests with Vitest
pnpm prisma:generate  # Regenerate Prisma client
pnpm prisma:migrate   # Apply pending migrations
```

### Web (`apps/web`)

```bash
pnpm dev        # Angular dev server
pnpm build      # Production build
pnpm test:ci    # Run tests with Vitest
pnpm lint       # Angular ESLint
```

## Features

### Authentication & Authorization
- Email / password sign-up and sign-in via **Better Auth**
- OAuth: GitHub and Google
- Session-based auth with global `AuthGuard` on the API
- `@Public()` decorator to bypass auth on specific routes
- Admin guard for back-office routes

### Organizations (multi-tenant)
- Users belong to organizations
- Organization switcher in the UI
- Per-org settings, members, billing, and danger zone

### Billing
- Stripe subscription plans (Pro / Ultra, monthly & yearly)
- Checkout session creation and webhook handling
- Plans defined in `apps/api/src/billing/billing-plans.ts`

### Admin back-office
- User management (list, detail, impersonation)
- Organization management
- Feedback review and status tracking
- Analytics dashboard

### Frontend pages
- Public: Home (hero, features, pricing, FAQ, reviews), Blog, Docs, Changelog, About, Contact, Legal
- Auth: Sign-in, Sign-up
- App: Dashboard, Orgs, Settings
- Account: Profile, change email/password, email preferences, danger zone

## Environment variables

See `apps/api/.env.example` for the full list. Key variables:

| Variable                  | Description                                        |
| ------------------------- | -------------------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection string                       |
| `BETTER_AUTH_SECRET`      | Secret key for Better Auth sessions                |
| `BETTER_AUTH_URL`         | API base URL (used by Better Auth)                 |
| `TRUSTED_ORIGINS`         | Comma-separated allowed CORS origins               |
| `STRIPE_SECRET_KEY`       | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET`   | Stripe webhook signing secret                      |
| `GITHUB_CLIENT_ID/SECRET` | GitHub OAuth app credentials (optional)            |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth app credentials (optional)            |

## Project conventions

- **File naming**: kebab-case for all files
- **API modules**: feature modules with Controller -> Service -> Prisma pattern
- **Angular**: standalone components, Signal-based state (`@ngrx/signals`), TanStack Query for server state
- **Forms**: Angular Signal Forms (`@angular/forms/signals`)
- **Changelog**: every code change is logged in `CHANGELOG.md`

## License

MIT
