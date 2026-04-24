---
name: create-tests
description: This skill should be used when the user asks to "create tests", "write tests", "add unit tests", "add e2e tests", or mentions testing, Vitest, TestBed, Playwright, or test coverage for the Angular frontend.
---

<objective>
Create comprehensive tests for the NgCoreKit Angular frontend using Vitest + TestBed for unit tests and Playwright for e2e tests.
</objective>

<quick_start>
<unit_test>
Create unit test alongside source file:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

Run: `pnpm test:ci`
</unit_test>

<e2e_test>
Create e2e test in `e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test('user flow description', async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByLabel(/email/i).fill('user@example.com');
  await page.getByLabel(/password/i).fill('password');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/);
  await expect(page.getByRole('heading')).toBeVisible();
});
```

Run: `pnpm test:e2e:ci`
</e2e_test>
</quick_start>

<test_commands>
**CRITICAL - Always use CI commands:**

- `pnpm test:ci` - Unit tests (non-interactive)
- `pnpm test:e2e:ci` - E2E tests (headless)

**NEVER use interactive commands** (`pnpm test`, `pnpm test:e2e`)
</test_commands>

<directory_structure>
```
apps/web/
├── src/
│   └── app/
│       └── <feature>/
│           ├── <feature>.component.ts
│           └── <feature>.component.spec.ts  # Co-located unit tests
├── e2e/
│   └── <feature>.spec.ts                   # Playwright e2e tests
└── vitest.config.ts
```
</directory_structure>

<when_to_use_which>
| Test Type | Use For | Location |
|-----------|---------|----------|
| **Unit** | Components, services, stores, pipes | `src/**/*.spec.ts` |
| **E2E** | User flows, auth, navigation, forms | `e2e/*.spec.ts` |

**Unit tests**: Fast, mocked dependencies, DOM assertions
**E2E tests**: Real browser, real API, full user journeys
</when_to_use_which>

<signal_testing>
Testing Angular signals:

```typescript
it('should update count signal', () => {
  const component = fixture.componentInstance;
  // Signals are functions — call them to get value
  expect(component.count()).toBe(0);

  // Trigger update
  component.increment();
  fixture.detectChanges();

  expect(component.count()).toBe(1);
});
```
</signal_testing>

<success_criteria>
- Tests in correct location (`*.spec.ts` or `e2e/`)
- Standalone components use `imports: [Component]` in TestBed
- Services mocked with `{ provide: X, useValue: { method: vi.fn() } }`
- Tests pass with `pnpm test:ci` or `pnpm test:e2e:ci`
</success_criteria>
