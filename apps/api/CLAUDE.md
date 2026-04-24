# CLAUDE.md — apps/api (NestJS API)

## About

NestJS API for NgCoreKit — a multi-tenant SaaS boilerplate with organization management, Better Auth authentication, Stripe billing, and PostgreSQL via Prisma.

## Key Files

| File | Purpose |
|------|---------|
| `src/auth/auth.config.ts` | Better Auth configuration |
| `src/auth/guards/auth.guard.ts` | Global auth guard (all endpoints protected by default) |
| `src/auth/guards/admin.guard.ts` | Admin role guard |
| `src/auth/decorators/current-user.decorator.ts` | `@CurrentUser()` — extract user from request |
| `src/auth/decorators/current-org.decorator.ts` | `@CurrentOrg()` — extract org from request |
| `src/auth/decorators/public.decorator.ts` | `@Public()` — exempt endpoint from auth |
| `src/organizations/org.guard.ts` | OrgGuard — validates org membership |
| `src/prisma/prisma.service.ts` | Prisma client singleton |
| `prisma/schema/schema.prisma` | Main database schema |
| `prisma/schema/better-auth.prisma` | Auth schema (auto-generated, do NOT edit) |

## TypeScript Imports

Path alias: `@/*` → `src/*` (e.g., `@/prisma/prisma.service`)

## Critical Rules

### Before Editing Any File
Read at least 3 related existing files (similar features + imported dependencies) before making changes.

### Authentication
- `AuthGuard` is applied **globally** — every endpoint is protected by default
- Use `@Public()` decorator to exempt endpoints that should be public
- Org-scoped endpoints require `@UseGuards(OrgGuard)` and use `@CurrentOrg()`

### Database — Multi-tenant Isolation
- **ALL org-scoped Prisma queries MUST filter by `organizationId`**
- Always verify ownership (`{ id, organizationId }`) before update/delete
- NEVER expose data across organization boundaries

### DTOs
- All `@Body()` params MUST use DTOs with `class-validator` decorators
- Use response DTOs — never return raw Prisma entities

### Changelog
After every code change, add an entry to `CHANGELOG.md` at the repo root.

## Commands

```bash
pnpm test:ci          # Run unit tests (ALWAYS — never interactive pnpm test)
pnpm lint             # ESLint with auto-fix
pnpm lint:ci          # ESLint without auto-fix (CI)
pnpm check-types      # TypeScript type check
pnpm prisma:migrate   # Run Prisma migrations
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:seed      # Seed database
```

## Detailed Rules

See `.claude/rules/` for detailed architectural guidance:

- `architecture-overview.md` — Project structure, key decisions
- `api-routes.md` — Controllers, guards, DTOs, decorators
- `authentication.md` — Auth guard, decorators, types
- `prisma.md` — Database conventions, org filtering, query patterns
- `testing.md` — Vitest, TestBed patterns, mock strategies
- `file-naming.md` — Naming conventions for all file types
- `security.md` — Multi-tenant security checklist, OWASP reminders
