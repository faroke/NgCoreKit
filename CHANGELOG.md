# Changelog

## 2026-04-24

CHORE: Add scripts/dev.sh — opens browser tabs (web, Swagger, Redis Commander, Prisma Studio) automatically once each service is ready

CHORE: Add Redis Commander to docker-compose for dev Redis visualization on http://localhost:8081

CHORE: Update root `dev` script — runs `docker compose up -d` then `turbo run dev studio`; adds `studio` task to turbo.json and `studio` script to apps/api for Prisma Studio



CHORE: Add GitHub Actions CI workflow (.github/workflows/ci.yml) — lint, type check, build, and tests on every PR targeting main



CHORE: Expand init-project skill Step 5 with full env variable tables and stripe listen local webhook setup instructions



CHORE: Tighten .gitignore (add .planning/, .claude/memory/, .angular/, pnpm-debug.log*), fix apps/api/.env.example (add TRUSTED_ORIGINS, remove unused REDIS_URL), wire Angular environment files — create src/environments/environment.ts + environment.prod.ts, add fileReplacements in angular.json, provide API_URL token from environment in app.config.ts, remove apps/web/.env.example



FIX: Replace `.errors()?.some(` with `.errors().some(` across 12 components to resolve NG8107 warnings — `errors()` return type does not include `null`/`undefined`

## 2026-04-23

FEATURE: Phase 7 — Claude Code system (.claude/) for NestJS API and Angular frontend with hooks, agents, commands, rules, skills, and workspace CLAUDE.md files

FEATURE: Phase 6.5 — Toast System
- `apps/web/src/app/core/stores/toast.store.ts`: NgRx SignalStore; `Toast` type; `add(toast)` with auto-dismiss setTimeout; `dismiss(id)`
- `apps/web/src/app/core/services/toast.service.ts`: `success/error/warning/info` helpers delegating to ToastStore
- `apps/web/src/app/components/shared/toast.component.ts`: fixed bottom-right panel; Lucide icons per type; dismiss button; color-coded borders
- `apps/web/src/app/layouts/app/app-layout.component.ts`: `<app-toast />` added
- `apps/web/src/app/layouts/public/public-layout.component.ts`: `<app-toast />` added
- `apps/web/src/app/core/interceptors/error.interceptor.ts`: `toast.error(...)` on 5xx responses

FEATURE: Phase 6.3 — Account Settings (NestJS)
- `apps/api/src/account/dto/update-profile.dto.ts`: `name` optional, 2–64 chars
- `apps/api/src/account/dto/change-password.dto.ts`: `currentPassword` + `newPassword` (min 8)
- `apps/api/src/account/dto/change-email.dto.ts`: `newEmail` (email) + `password`
- `apps/api/src/account/dto/delete-account.dto.ts`: `password`
- `apps/api/src/account/account.service.ts`: `getProfile`, `updateProfile`, `changePassword` (verify via `better-auth/crypto`), `changeEmail`, `deleteAccount`
- `apps/api/src/account/account.controller.ts`: `GET /account/me`, `PATCH /account/profile`, `PATCH /account/change-password`, `PATCH /account/change-email`, `DELETE /account`
- `apps/api/src/account/account.module.ts`: AccountModule
- `apps/api/src/app.module.ts`: imported AccountModule
- `apps/web/src/app/core/services/account.service.ts`: Angular service for all account API calls
- `apps/web/src/app/core/services/api.service.ts`: added `deleteWithBody` method
- `apps/web/src/app/core/stores/account.store.ts`: NgRx SignalStore; `loadProfile`, `updateProfile`, `changePassword`, `changeEmail`, `deleteAccount` (signs out + navigates to `/`)
- `apps/web/src/app/layouts/account/account-layout.component.ts`: sidebar layout with Profile/Edit Profile/Password/Email/Notifications/Danger Zone nav
- `apps/web/src/app/pages/account/account-overview.component.ts`: overview with profile card and quick links
- `apps/web/src/app/pages/account/settings/account-settings.component.ts`: edit name form with toast on success
- `apps/web/src/app/pages/account/change-password/change-password.component.ts`: current+new+confirm password form; confirm match check
- `apps/web/src/app/pages/account/change-email/change-email.component.ts`: newEmail + password form
- `apps/web/src/app/pages/account/email-preferences/email-preferences.component.ts`: toggle UI for notification preferences
- `apps/web/src/app/pages/account/danger/account-danger.component.ts`: confirm-before-delete flow with password verification
- `apps/web/src/app/app.routes.ts`: `/account` route with `authGuard` and 6 children
- `apps/web/src/app/layouts/app/app-layout.component.ts`: Account link in sidebar

FEATURE: Phase 6.4 — Debug Panel + Tailwind Indicator
- `apps/web/src/app/core/stores/debug-panel.store.ts`: NgRx SignalStore; `isOpen`, `activeTab`; `toggle()`, `setTab()`
- `apps/web/src/app/components/dev/tailwind-indicator.component.ts`: fixed pill showing current Tailwind breakpoint; only renders in `isDevMode()`
- `apps/web/src/app/components/dev/debug-panel.component.ts`: fixed Bug-icon toggle button; panel with Session/Org tabs showing auth/org state; only renders in `isDevMode()`
- `apps/web/src/app/layouts/app/app-layout.component.ts`: `<app-tailwind-indicator />` and `<app-debug-panel />` added

REFACTOR: Migrate all Angular forms from template-driven (FormsModule/ngModel) to Angular Signal Forms (@angular/forms/signals)
- `apps/web/src/app/pages/auth/sign-in/sign-in.component.ts`: `form()` with `required` + `email` validators; `loginForm.invalid()` guards submit
- `apps/web/src/app/pages/auth/sign-up/sign-up.component.ts`: `form()` with `required`, `email`, `minLength(8)` validators
- `apps/web/src/app/pages/contact/contact.component.ts`: `form()` with `required`, `email`, `minLength(10)` on message
- `apps/web/src/app/pages/settings/members/org-members.component.ts`: invite form uses `form()`; reset via `inviteModel.update()` after invite; `[formField]` on `<select>`
- `apps/web/src/app/features/support/support-dialog.component.ts`: email pre-filled via `model.update()` in `ngOnInit()`
- `apps/web/src/app/pages/settings/details/org-details.component.ts`: model initialized from `orgStore.activeOrg()` at injection time
- `apps/web/src/app/features/feedback/feedback-popover.component.ts`: email optional (`email()` validator without `required()`); `rating` stays independent signal
- `apps/web/src/app/pages/orgs/new/new-org.component.ts`: slug auto-derived via `effect()` in constructor; removed `onNameChange()`
- `apps/web/src/app/pages/admin/users/admin-users-list.component.ts`: replaced `[ngModel]`/`(ngModelChange)` with `[value]`/`(input)` native binding; removed `FormsModule`
- `apps/web/src/app/pages/admin/organizations/admin-orgs-list.component.ts`: same search input migration as above
- `CLAUDE.md`: added Angular Signal Forms rules under new **Forms (apps/web)** section

FEATURE: Phase 5 — Marketing Pages and Content System
- `apps/web/src/app/core/content/content.types.ts`: `Post`, `Doc`, `ChangelogEntry` types
- `apps/web/src/app/core/content/posts.data.ts`: 3 sample blog posts (Tutorial, Architecture, Billing categories)
- `apps/web/src/app/core/content/docs.data.ts`: 3 sample docs pages (Introduction, Installation, Project Structure)
- `apps/web/src/app/core/content/changelog.data.ts`: 3 changelog entries (v1.0.0, v1.1.0, v1.2.0)
- `apps/web/src/app/core/services/content.service.ts`: `ContentService` — getPosts, getPost, getPostsByCategory, getDocs, getDoc, getChangelogs, getChangelog
- `apps/web/src/app/core/services/meta.service.ts`: `MetaService` — setPage, setPost (Angular Title + Meta)
- `apps/web/src/app/components/public/landing-header.component.ts`: sticky header with logo, nav links (Features, Pricing, Blog, Docs, Changelog), sign-in + get-started buttons
- `apps/web/src/app/components/public/footer.component.ts`: 4-column footer (Product, Resources, Legal, Company) with copyright
- `apps/web/src/app/layouts/public/public-layout.component.ts`: updated to include LandingHeader, Footer, FeedbackPopover; redirects authenticated users to /orgs via effect()
- `apps/web/src/app/pages/home/home.component.ts`: composes all home page sections
- `apps/web/src/app/pages/home/sections/hero-section.component.ts`: headline, subtitle, two CTA buttons, terminal preview box
- `apps/web/src/app/pages/home/sections/features-section.component.ts`: 6-feature grid with Lucide icons
- `apps/web/src/app/pages/home/sections/bento-section.component.ts`: 3-column bento grid with 4 cells
- `apps/web/src/app/pages/home/sections/pain-section.component.ts`: pain vs solution two-column layout
- `apps/web/src/app/pages/home/sections/stats-section.component.ts`: 4 stats (10k+ developers, 50+ features, 99.9% uptime, <5min setup)
- `apps/web/src/app/pages/home/sections/review-section.component.ts`: 3 testimonial cards
- `apps/web/src/app/pages/home/sections/pricing-section.component.ts`: 3 pricing tiers (Free, Pro $29, Team $99) with hardcoded data
- `apps/web/src/app/pages/home/sections/faq-section.component.ts`: 6-item accordion with signal-based open/close state
- `apps/web/src/app/pages/home/sections/cta-section.component.ts`: final CTA with get-started and docs links
- `apps/web/src/app/pages/blog/blog-list.component.ts`: blog listing with category badges, reading time, MetaService
- `apps/web/src/app/pages/blog/blog-post.component.ts`: post detail with [innerHTML] + DomSanitizer, MetaService.setPost()
- `apps/web/src/app/pages/blog/blog-category.component.ts`: filtered posts by route param category
- `apps/web/src/app/pages/docs/docs-shell.component.ts`: sidebar grouped by section with routerLinkActive, router-outlet
- `apps/web/src/app/pages/docs/docs-page.component.ts`: doc detail with [innerHTML] + prev/next navigation
- `apps/web/src/app/pages/changelog/changelog-list.component.ts`: timeline layout with version badges
- `apps/web/src/app/pages/changelog/changelog-detail.component.ts`: full changelog rendered via [innerHTML]
- `apps/web/src/app/features/changelog/changelog-manager.store.ts`: NgRx SignalStore tracking seen versions in localStorage (key: ngcorekit_seen_changelogs)
- `apps/web/src/app/features/changelog/changelog-dialog.component.ts`: fixed bottom-right dialog showing latest unseen changelog; mark-as-read and dismiss buttons
- `apps/web/src/app/features/changelog/changelog-sidebar-stack.component.ts`: stack of 3 most recent changelog version cards
- `apps/web/src/app/pages/legal/privacy.component.ts`: Privacy Policy placeholder page
- `apps/web/src/app/pages/legal/terms.component.ts`: Terms of Service placeholder page
- `apps/web/src/app/pages/about/about.component.ts`: mission statement + values grid + team section
- `apps/web/src/app/pages/contact/contact.component.ts`: contact form calling POST /api/support
- `apps/web/src/app/pages/errors/not-found.component.ts`: 404 page
- `apps/web/src/app/pages/errors/error.component.ts`: generic error page with input() code/title/description
- `apps/web/src/app/features/feedback/feedback-popover.component.ts`: floating "Feedback" button with star rating, message, optional email; calls POST /api/feedback
- `apps/web/src/app/features/support/support-dialog.component.ts`: modal with subject/message/email fields; pre-fills email from AuthStore
- `apps/api/src/support/dto/create-support.dto.ts`: CreateSupportDto with class-validator decorators
- `apps/api/src/support/support.service.ts`: logs support request and returns success
- `apps/api/src/support/support.controller.ts`: @Public() POST /api/support
- `apps/api/src/support/support.module.ts`: SupportModule
- `apps/api/src/seo/seo.controller.ts`: @Public() GET /sitemap.xml and GET /robots.txt
- `apps/api/src/seo/seo.module.ts`: SeoModule
- `apps/api/src/app.module.ts`: register SupportModule and SeoModule
- `apps/web/src/app/app.routes.ts`: add all public routes (/posts, /docs, /changelog, /legal/*, /about, /contact); replace ** redirect with NotFoundComponent

FEATURE: Phase 4 — Admin Panel
- `apps/api/prisma/schema/schema.prisma`: add `status String @default("new")` to `Feedback` model (run `pnpm prisma:migrate && pnpm prisma:generate`)
- `apps/api/src/feedback/`: new `FeedbackModule` — `POST /api/feedback` (authenticated submit), `FeedbackService` (create, list, findOne, update), `CreateFeedbackDto`, `UpdateFeedbackDto`
- `apps/api/src/admin/analytics/admin-analytics.controller.ts`: `GET /api/admin/analytics/stats` — userCount, orgCount, MRR, activeSubscriptions
- `apps/api/src/admin/users/admin-users.controller.ts`: user CRUD + impersonation behind `AdminGuard`; `stop-impersonating` guarded by `AuthGuard` only (impersonated sessions are not admin)
- `apps/api/src/admin/organizations/admin-orgs.controller.ts`: org list/detail/update/member removal behind `AdminGuard`
- `apps/api/src/admin/feedback/admin-feedback.controller.ts`: feedback list/detail/status-update behind `AdminGuard`
- `apps/api/src/admin/admin.module.ts`: bundles all admin controllers; imports `AuthModule` (for `AuthService`/impersonation) and `FeedbackModule`
- `apps/api/src/app.module.ts`: register `FeedbackModule` and `AdminModule`
- `packages/types/src/index.ts`: add `AdminStats`, `AdminUser`, `AdminUserDetail`, `AdminOrg`, `AdminOrgMember`, `AdminOrgDetail`, `FeedbackStatus`, `AdminFeedback`
- `apps/web/src/app/core/guards/admin.guard.ts`: `adminGuard` — requires `role === "admin"`, redirects to `/orgs` otherwise
- `apps/web/src/app/core/services/admin.service.ts`: Angular service wrapping all `/api/admin/**` endpoints
- `apps/web/src/app/layouts/admin/admin-layout.component.ts`: admin sidebar layout with impersonation banner
- `apps/web/src/app/components/shared/impersonation-banner.component.ts`: shows amber banner when `session.impersonatedBy` is set; "Stop impersonating" reloads auth and navigates to `/admin`
- `apps/web/src/app/pages/admin/dashboard/`: stats cards (users, orgs, MRR, subscriptions)
- `apps/web/src/app/pages/admin/users/`: users list with search/pagination; user detail with impersonate + delete
- `apps/web/src/app/pages/admin/organizations/`: orgs list with search/pagination; org detail with subscription + member removal
- `apps/web/src/app/pages/admin/feedback/`: feedback list with status filter/pagination; feedback detail with status update buttons
- `apps/web/src/app/app.routes.ts`: add `/admin` route tree with `adminGuard` and `AdminLayoutComponent`
- `apps/web/src/app/layouts/app/app-layout.component.ts`: add `ImpersonationBannerComponent` at top of main app layout

REFACTOR: Angular boilerplate compliance — standalone, zoneless, OnPush
- `apps/web/src/app/app.config.ts`: switched from `provideZoneChangeDetection` to `provideZonelessChangeDetection` (Angular 21 stable)
- All 17 components: added `standalone: true` and `changeDetection: ChangeDetectionStrategy.OnPush` to every `@Component` decorator
- `plans.component.ts`: migrated `@Input()`/`@Output()`/`OnChanges` to signal primitives (`input()`, `output()`); `injectQuery` reactive function now reads signal inputs so re-fetches on `orgSlug` change; removed empty `ngOnChanges`

FEATURE: Phase 3 — Stripe Billing
- `pnpm add stripe` in `apps/api`
- `packages/types`: `OrgPlan` updated (`enterprise` → `ultra`); added `OrgSubscription`, `OrgInvoice`, `BillingPlanPublic`, `CreateCheckoutRequest`, `CheckoutResponse`, `PortalResponse`
- `apps/api/src/billing/billing-plans.ts`: plan config (free/pro/ultra) with limits, prices, and free trials
- `apps/api/src/billing/dto/create-checkout.dto.ts`: validated `{ plan, interval }` DTO
- `apps/api/src/billing/billing.service.ts`: `getOrCreateStripeCustomer`, `getSubscription`, `getPlans`, `createCheckoutSession`, `createPortalSession`, `getInvoices`, webhook handlers
- `apps/api/src/billing/billing.controller.ts`: `GET/POST /orgs/:orgSlug/billing/*` behind `OrgGuard`
- `apps/api/src/billing/webhooks.controller.ts`: `@Public() POST /webhooks/stripe` — handles checkout + subscription events
- `apps/api/src/billing/billing.module.ts`: `STRIPE_CLIENT` factory token, imports `OrganizationsModule`
- `apps/api/src/app.module.ts`: add `BillingModule`
- `apps/api/src/main.ts`: `rawBody: true` for webhook signature verification
- `apps/api/src/organizations/organizations.service.ts`: fix map type annotation so subscription flows through
- `apps/api/.env.example`: add yearly/ultra Stripe price ID vars
- `apps/web/src/app/core/services/billing.service.ts`: Angular `BillingService` wrapping `ApiService`
- `apps/web/src/app/pages/settings/billing/plans.component.ts`: pricing grid with monthly/yearly toggle
- `apps/web/src/app/pages/settings/billing/billing.component.ts`: current plan card, plan grid, invoice table
- `apps/web/src/app/app.routes.ts`: add `billing` route under settings children
- `apps/web/src/app/layouts/app/app-layout.component.ts`: add "Billing" nav link to sidebar

FEATURE: Phase 1 — monorepo foundations
- Scaffold `apps/api` (NestJS 11) and `apps/web` (Angular 21) via CLI
- Add `packages/types` (shared DTOs: pagination, auth, org types) and `packages/config` (TS + ESLint configs)
- Configure Turbo pipeline (build, dev, lint, check-types, test:ci, test:e2e:ci)
- Add Docker Compose (PostgreSQL 16 + Redis 7)
- Fix esbuild version conflict (pnpm override to 0.27.7 + `.npmrc` hoist)

FEATURE: Phase 1 — NestJS skeleton
- `main.ts`: global prefix `/api`, CORS, ValidationPipe (whitelist), Swagger at `/api/docs`, Logger
- `AppModule`: ConfigModule (global), TerminusModule, PrismaModule (global), AuthModule
- `HttpExceptionFilter` registered globally
- `PrismaService` + `PrismaModule` as global provider
- `HealthController` → `GET /api/status` (public)
- Vitest configured with `unplugin-swc` for decorator support

FEATURE: Phase 1 — Angular skeleton
- Angular 21 standalone + signals, lazy-loaded routes
- TailwindCSS v4 with full CSS variable theme (dark mode ready, Shadcn-compatible palette)
- `AuthInterceptor` (cookie credentials) + `ErrorInterceptor` (401 → /sign-in)
- `ApiService` with `InjectionToken` for base URL
- `PublicLayoutComponent` + `AppLayoutComponent` (sidebar shell)
- TanStack Query + NgRx SignalStore in dependencies

FEATURE: Phase 1 — Database
- Prisma schema (multi-file): User, Session, Account, Verification, Organization, Member, Invitation, Subscription, Feedback
- `prisma.schema` config pointing to `prisma/schema/` directory

FEATURE: Phase 1 — Better Auth integration (NestJS)
- `AuthService` wraps `betterAuth()` instance, initialized with PrismaService
- `AuthController` wildcards all `/api/auth/**` to Better Auth node handler
- `AuthGuard` (global, reflector-based) validates sessions on all protected routes
- `AdminGuard` checks `user.role === "admin"` for platform admin routes
- `@Public()` decorator opt-out, `@CurrentUser()` + `@CurrentSession()` param decorators
- Plugins: organization (RBAC with ac/roles), emailOTP, admin, lastLoginMethod
- Auto-create org after user sign-up via `databaseHooks`

FEATURE: Phase 1 — Better Auth integration (Angular)
- `authClient` via `better-auth/client` with organization, admin, emailOTP plugins
- `AuthStore` (NgRx SignalStore) — session, user, isAuthenticated, activeOrgId signals
- `authGuard` + `guestGuard` functional route guards
- Sign-in + Sign-up components with FormsModule + error display
- Routes protected: `/orgs/**` → authGuard, `/sign-in` + `/sign-up` → guestGuard

FEATURE: Phase 2 — Multi-tenant Organizations (NestJS)
- `OrgGuard`: resolves org by `:orgSlug`, validates membership, attaches `req.org`
- `OrganizationsController`: `GET /orgs`, `GET /orgs/:orgSlug`, `PATCH /orgs/:orgSlug`, `DELETE /orgs/:orgSlug`
- `OrganizationsService`: `listForUser()`, `update()` (slug validation, reserved-slug check), `delete()` (owner only)
- `UpdateOrgDto` with class-validator + Swagger decorators
- `reserved-slugs.ts`: isReservedSlug(), isValidSlug() utilities
- `@CurrentOrg()` param decorator for org-scoped routes
- Fix: typed `members.map()` callback to eliminate implicit `any`

FEATURE: Phase 2 — Multi-tenant Organizations (Angular)
- `OrgContextStore` (NgRx SignalStore): activeOrg, orgs, isLoading signals; loadOrgs(), setActiveOrg(), createOrg(), removeOrg()
- `orgGuard`: loads orgs, resolves `:orgSlug`, sets active org or redirects to /orgs
- `OrgsListComponent`: lists orgs with auto-redirect to first org
- `NewOrgComponent`: create org form with auto-slug generation from name
- `AppLayoutComponent`: sidebar nav (Dashboard, Settings), org switcher, sign-out
- `DialogManagerStore` + `DialogManagerComponent`: global confirm/modal system
- Settings pages: OrgDetailsComponent (name/slug), OrgMembersComponent (invite + remove), OrgDangerComponent (delete)
- `DashboardComponent`: shows active org name + role card
- Full route tree: /orgs → /orgs/new → /orgs/:orgSlug/(dashboard|settings/*)
