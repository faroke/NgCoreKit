# File Naming Conventions — Angular Frontend

## Component Files

All Angular files follow: `<name>.<type>.ts`

| Type | Suffix | Example |
|------|--------|---------|
| Component | `.component.ts` | `dashboard.component.ts` |
| Service | `.service.ts` | `api.service.ts` |
| Store (NgRx Signal) | `.store.ts` | `auth.store.ts` |
| Guard | `.guard.ts` | `auth.guard.ts` |
| Interceptor | `.interceptor.ts` | `auth.interceptor.ts` |
| Pipe | `.pipe.ts` | `format-date.pipe.ts` |
| Directive | `.directive.ts` | `auto-focus.directive.ts` |
| Resolver | `.resolver.ts` | `org-data.resolver.ts` |
| Unit Test | `.spec.ts` | `dashboard.component.spec.ts` |
| Types | `.types.ts` | `content.types.ts` |

## Naming Conventions

- **kebab-case** for file names: `org-settings.component.ts`
- **PascalCase** for class names: `OrgSettingsComponent`
- **camelCase** for selectors is fine: `app-org-settings`

## Directory Structure

Feature-specific components:

```
src/app/
├── pages/
│   └── dashboard/
│       ├── dashboard.component.ts
│       ├── dashboard.component.html
│       └── dashboard.component.spec.ts
├── features/
│   └── organizations/
│       ├── org-card/
│       │   ├── org-card.component.ts
│       │   └── org-card.component.html
│       └── org-list/
│           ├── org-list.component.ts
│           └── org-list.component.html
└── components/
    └── ui/
        ├── button.component.ts
        └── card.component.ts
```

## Pages vs Features vs Components

- **`pages/`** — Route endpoint components (one per route)
- **`features/`** — Feature-specific composed components (used in pages)
- **`components/`** — Shared/reusable UI components (used everywhere)
- **`core/`** — Services, stores, guards, interceptors (singleton/global)

## HTML Templates

Prefer inline templates for simple components (< 20 lines).
Use `templateUrl` for complex templates.

```typescript
// Simple: inline template
@Component({
  standalone: true,
  template: `<p>Hello {{ name() }}</p>`,
})

// Complex: external template
@Component({
  standalone: true,
  templateUrl: './my.component.html',
})
```
