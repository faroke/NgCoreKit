# Architecture Overview — Angular Frontend

## Technology Stack

- **Framework**: Angular 21.2 (standalone components, signals)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4 + Zard UI (CVA-based component variants)
- **State**: NgRx SignalStore (`@ngrx/signals`)
- **Forms**: Angular Signal Forms (`@angular/forms/signals`)
- **Data Fetching**: TanStack Query Angular (`@tanstack/angular-query-experimental`)
- **HTTP**: Angular HttpClient via `ApiService`
- **Icons**: Lucide Angular
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Package Manager**: pnpm

## Project Structure

```
apps/web/src/
├── app/
│   ├── app.config.ts          # App providers, routes, HttpClient, QueryClient
│   ├── app.routes.ts          # Root routing with lazy-loaded feature routes
│   ├── app.ts                 # Root component
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.client.ts     # Better Auth client
│   │   │   └── auth.store.ts      # NgRx SignalStore for auth state
│   │   ├── guards/
│   │   │   ├── auth.guard.ts      # Route guard: requires authentication
│   │   │   ├── guest.guard.ts     # Route guard: requires no auth (login page)
│   │   │   ├── org.guard.ts       # Route guard: requires active org
│   │   │   └── admin.guard.ts     # Route guard: requires admin role
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts    # Adds session cookie to API calls
│   │   │   └── error.interceptor.ts   # Global error handling
│   │   ├── services/
│   │   │   ├── api.service.ts     # HTTP client wrapper (always use this)
│   │   │   ├── meta.service.ts    # Page title/meta management
│   │   │   ├── toast.service.ts   # Toast notifications
│   │   │   └── ...
│   │   ├── stores/
│   │   │   ├── auth.store.ts          # Auth state
│   │   │   ├── org-context.store.ts   # Current org state
│   │   │   ├── account.store.ts       # User account state
│   │   │   └── debug-panel.store.ts   # Dev debug panel
│   │   └── content/               # Static content data
│   ├── layouts/
│   │   ├── public/               # Public pages layout
│   │   ├── app/                  # Authenticated app layout
│   │   ├── admin/                # Admin panel layout
│   │   └── account/              # Account settings layout
│   ├── pages/                    # Page components (route endpoints)
│   ├── features/                 # Feature-specific components
│   └── components/               # Shared UI components
├── environments/                 # Environment configuration
└── main.ts                       # Bootstrap
```

## Key Architectural Decisions

### Standalone Components
All components use `standalone: true`. No NgModules.

### Signal-first Reactivity
- Use Angular signals (`signal()`, `computed()`, `effect()`) for reactive state
- Prefer `linkedSignal()` for derived writable state
- Use `resource()` for async data loading in components

### Route Guards
All authenticated routes are protected by `AuthGuard`. Org routes use `OrgGuard`.

### HTTP Layer
**NEVER** use `HttpClient` directly in components. Always use `ApiService` or TanStack Query hooks.

## Path Aliases

```
@/*  →  src/*  (e.g., @/app/core/services/api.service)
```
