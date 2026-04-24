# Testing — Angular Frontend

## Test Runner

**Vitest** — not Karma/Jasmine. Configuration in `vitest.config.ts` at `apps/web/`.

## Commands

```bash
# ALWAYS use CI commands (non-interactive)
pnpm test:ci                    # Run all unit tests
pnpm test:ci <pattern>          # Run specific tests by pattern
pnpm test:cov                   # Run with coverage

# E2E tests (Playwright)
pnpm test:e2e:ci                # Run headless (from apps/web/ or repo root)

# NEVER use interactive commands
# pnpm test  <- NEVER
```

## Unit Tests — Vitest + TestBed

Located alongside source files as `*.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MyComponent } from './my.component';
import { ApiService } from '@/app/core/services/api.service';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  const mockApiService = { get: vi.fn(), post: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],  // Standalone components go in imports
      providers: [
        { provide: ApiService, useValue: mockApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Service Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyService,
        { provide: ApiService, useValue: { get: vi.fn() } },
      ],
    });
    service = TestBed.inject(MyService);
  });

  afterEach(() => vi.clearAllMocks());
});
```

## NgRx SignalStore Tests

```typescript
import { TestBed } from '@angular/core/testing';

describe('MyStore', () => {
  let store: InstanceType<typeof MyStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MyStore] });
    store = TestBed.inject(MyStore);
  });

  it('should have initial state', () => {
    expect(store.items()).toEqual([]);
  });
});
```

## E2E Tests — Playwright

Located in `apps/web/e2e/*.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByLabel(/email/i).fill('user@example.com');
  await page.getByLabel(/password/i).fill('password');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});
```

## Test File Naming

- Unit: `src/app/**/<name>.spec.ts` — co-located with source
- E2E: `e2e/<feature>.spec.ts`
