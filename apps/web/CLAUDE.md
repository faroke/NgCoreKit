# CLAUDE.md — apps/web (Angular Frontend)

## About

Angular 21.2 frontend for NgCoreKit — a multi-tenant SaaS boilerplate. Uses standalone components, Angular signals, NgRx SignalStore for state, Angular Signal Forms, and TanStack Query for server data.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/app.config.ts` | App providers, routing, HttpClient, QueryClient |
| `src/app/app.routes.ts` | Root routing with lazy-loaded feature routes |
| `src/app/core/auth/auth.client.ts` | Better Auth client |
| `src/app/core/auth/auth.store.ts` | Auth state (NgRx SignalStore) |
| `src/app/core/guards/auth.guard.ts` | Route guard: requires authentication |
| `src/app/core/guards/guest.guard.ts` | Route guard: redirect if already logged in |
| `src/app/core/guards/org.guard.ts` | Route guard: requires active organization |
| `src/app/core/guards/admin.guard.ts` | Route guard: requires admin role |
| `src/app/core/services/api.service.ts` | HTTP client wrapper — always use this |
| `src/app/core/stores/org-context.store.ts` | Current organization state |
| `src/app/core/stores/debug-panel.store.ts` | Dev debug panel |

## TypeScript Imports

Path alias: `@/*` → `src/*` (e.g., `@/app/core/services/api.service`)

## Critical Rules

### Before Editing Any File
Read at least 3 related existing files (similar features + imported dependencies) before making changes.

### Components
- All components are **standalone** (`standalone: true`) — no NgModules
- Use Angular signals (`signal()`, `computed()`, `effect()`) for reactive state
- Use `inject()` for dependency injection — not constructor injection

### Forms
- Use **Angular Signal Forms** (`@angular/forms/signals`) for ALL forms
- **NEVER** use `FormsModule`, `ngModel`, `ReactiveFormsModule`, or `FormGroup`
- See `.claude/rules/forms.md` for detailed patterns

### Data Fetching
- **NEVER** inject `HttpClient` directly in components — use `ApiService`
- Use `resource()` for simple component-local data fetches
- Use TanStack Query (`injectQuery`) for shared/cached server data

### State Management
- Use **NgRx SignalStore** for shared application state
- Read existing stores before creating new ones — what you need may already exist

### Changelog
After every code change, add an entry to `CHANGELOG.md` at the repo root.

## Commands

```bash
pnpm test:ci          # Run unit tests (ALWAYS — never interactive pnpm test)
pnpm test:e2e:ci      # Run Playwright e2e tests (headless)
pnpm lint             # Angular ESLint with auto-fix
pnpm lint:ci          # ESLint without auto-fix (CI)
pnpm check-types      # TypeScript type check
```

## Detailed Rules

See `.claude/rules/` for detailed architectural guidance:

- `architecture-overview.md` — Project structure, key decisions
- `angular-patterns.md` — Signals, DI, control flow, resource()
- `state-management.md` — NgRx SignalStore patterns
- `forms.md` — Angular Signal Forms (the ONLY approved form solution)
- `fetching-patterns.md` — resource() vs TanStack Query vs NgRx
- `ui-ux.md` — Zard UI, TailwindCSS v4, Lucide icons, spacing rules
- `testing.md` — Vitest + TestBed, Playwright patterns
- `file-naming.md` — Naming conventions for all Angular file types
