---
description: Build Angular components and services using Test-Driven Development with Vitest unit tests
allowed-tools: Read, Write, Edit, Glob, Bash(pnpm test:ci *)
---

<objective>
Build Angular components and services using TDD with Vitest unit tests. Write tests FIRST, then implement.
</objective>

<process>
1. **Research**: Read 3+ similar files (MANDATORY)
   - Check existing `*.spec.ts` files in `apps/web/src/`
   - Check `apps/web/src/app/app.spec.ts` for test setup patterns

2. **Plan**: Define component/service structure

3. **Create test**: Write unit test FIRST as `<name>.spec.ts` alongside the source file

4. **Create component/service**: Implement the feature

5. **Run test**: `pnpm test:ci <test-file-pattern>`

6. **Iterate**: Fix until test passes
   </process>

<component_test_template>

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],  // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Expected Title');
  });
});
```

</component_test_template>

<service_test_template>

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MyService } from './my.service';
import { ApiService } from '../core/services/api.service';

describe('MyService', () => {
  let service: MyService;
  const mockApiService = { get: vi.fn(), post: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyService,
        { provide: ApiService, useValue: mockApiService },
      ],
    });

    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

</service_test_template>

<ngrx_store_test_template>

```typescript
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { MyStore } from './my.store';

describe('MyStore', () => {
  let store: InstanceType<typeof MyStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyStore],
    });
    store = TestBed.inject(MyStore);
  });

  it('should initialize with default state', () => {
    expect(store.items()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });
});
```

</ngrx_store_test_template>

<rules>
- Write test FIRST - no exceptions
- Read 3 files minimum before creating
- Use `TestBed.configureTestingModule` with `imports: [StandaloneComponent]`
- Mock all external dependencies (ApiService, HttpClient, etc.)
- ALWAYS run `pnpm test:ci` (NEVER interactive `pnpm test`)
</rules>

<success_criteria>

- Test written before component
- Component follows existing Angular patterns
- Test passes with `pnpm test:ci`
  </success_criteria>

---

Create unit test for: $ARGUMENTS
