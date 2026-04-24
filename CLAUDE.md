# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a **Turborepo + pnpm** monorepo with two active workspaces:

```
NgCoreKit/
├── apps/api/           # NestJS API — see apps/api/CLAUDE.md for rules
├── apps/web/           # Angular 21 frontend — see apps/web/CLAUDE.md for rules
├── packages/
│   ├── config/         # Shared configuration
│   └── types/          # Shared TypeScript types
├── .claude/            # Claude Code configuration (hooks, commands, agents, skills)
├── turbo.json          # Task pipeline (build, lint, check-types, dev)
├── pnpm-workspace.yaml
└── package.json        # Root scripts (delegate to Turbo)
```

**Active development** happens in `apps/api/` (NestJS) and `apps/web/` (Angular).
Each workspace has its own `CLAUDE.md` and `.claude/rules/` with detailed guidance.

## Commands

### Root (run from repo root)

```bash
pnpm dev          # Start all apps in dev mode
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm format       # Format with Prettier (*.ts, *.tsx, *.md)
pnpm check-types  # TypeScript type checking across all packages
```

## Critical Rules

### Before Editing Any File

Read at least 3 related existing files (similar features + imported dependencies) before making changes. This is mandatory for consistency.

### Changelog

After every code change, add an entry to `CHANGELOG.md` under today's date using one of: `FIX:`, `FEATURE:`, `REFACTOR:`, or `CHORE:`.

## Forms (apps/web — Angular)

Angular forms in `apps/web` use **Angular Signal Forms** (`@angular/forms/signals`), available natively in Angular 21.2+.

- Use `FormField` in `imports` — never `FormsModule` or `ngModel`
- Declare a typed model signal and a `form()` instance as class properties
- Gate all error messages on `.touched()` so they don't appear on initial load
- Optional fields: add format validators (e.g. `email()`) without `required()` — empty string passes
- Pre-filled fields: initialize `model` with empty string, then `model.update()` in `ngOnInit()`
- Derived fields: use `effect()` on the model signal inside `constructor()`
- Disable submit with `[disabled]="form.invalid()"` — never read model directly for guard

```typescript
import { FormField, form, required, email, minLength } from '@angular/forms/signals';

protected readonly model = signal({ email: '', password: '' });
protected readonly loginForm = form(this.model, (s) => {
  required(s.email);
  email(s.email, { message: 'Enter a valid email address.' });
  required(s.password);
});
```

```html
<input [formField]="loginForm.email" type="email" />
@if (loginForm.email.touched() && loginForm.email.errors()?.['required']) {
  <p class="text-xs text-destructive mt-1">This field is required.</p>
}
<button [disabled]="loginForm.invalid() || isLoading()">Submit</button>
```
