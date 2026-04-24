# Architecture Overview — NestJS API

## Technology Stack

- **Framework**: NestJS 11 (modular, decorator-based)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM (multi-file schema)
- **Authentication**: Better Auth with organization support
- **Validation**: class-validator + class-transformer (DTOs)
- **Documentation**: Swagger (@nestjs/swagger)
- **Payments**: Stripe integration
- **Testing**: Vitest for unit and integration tests
- **Package Manager**: pnpm

## Project Structure

```
apps/api/src/
├── auth/                    # Authentication module
│   ├── auth.config.ts       # Better Auth configuration
│   ├── auth.controller.ts   # Auth endpoints (proxy to Better Auth)
│   ├── auth.module.ts
│   ├── auth.service.ts      # Session validation
│   ├── auth-permissions.ts  # Permission metadata
│   ├── guards/
│   │   ├── auth.guard.ts    # Global auth guard (use @Public() to exempt)
│   │   └── admin.guard.ts   # Admin role guard
│   └── decorators/
│       ├── current-user.decorator.ts  # @CurrentUser()
│       ├── current-org.decorator.ts   # @CurrentOrg()
│       └── public.decorator.ts        # @Public()
├── prisma/
│   ├── prisma.service.ts    # Prisma client singleton
│   └── prisma.module.ts
├── organizations/           # Organization management
│   ├── org.guard.ts         # OrgGuard — validates org membership
│   ├── organizations.controller.ts
│   ├── organizations.service.ts
│   └── organizations.module.ts
├── billing/                 # Stripe billing
│   ├── billing.controller.ts
│   ├── billing.service.ts
│   ├── billing-plans.ts
│   ├── webhooks.controller.ts
│   └── billing.module.ts
├── health/
│   └── health.controller.ts
├── common/
│   └── filters/
│       └── http-exception.filter.ts
├── app.module.ts            # Root module
├── app.controller.ts
├── app.service.ts
└── main.ts                  # Bootstrap (Swagger, ValidationPipe, global guards)
```

## Key Architectural Decisions

### Global Auth Guard
`AuthGuard` is applied **globally** in `app.module.ts`. Every endpoint is protected by default. Use `@Public()` decorator to exempt public endpoints.

### Organization Scoping
Protected org-scoped endpoints use `OrgGuard` to validate org membership and populate `req.org`. Access org data via `@CurrentOrg()` decorator.

### Multi-tenant Data
ALL Prisma queries on org-scoped models MUST include `where: { organizationId: org.id }`. Never expose data across organization boundaries.

### Validation
All request bodies MUST use DTOs with class-validator decorators. `ValidationPipe` is applied globally with `{ whitelist: true, transform: true }`.

## Path Aliases

```
@/*  →  src/*  (e.g., @/prisma/prisma.service)
```
