---
description: Build NestJS services and controllers using Test-Driven Development with Vitest unit tests
allowed-tools: Read, Write, Edit, Glob, Bash(pnpm test:ci *)
---

<objective>
Build NestJS services and controllers using TDD with Vitest unit tests. Write tests FIRST, then implement.
</objective>

<process>
1. **Research**: Read 3+ similar files (MANDATORY)
   - Check existing `*.spec.ts` files in `apps/api/src/`
   - Check `apps/api/src/auth/auth.service.ts` and its test for patterns

2. **Plan**: Define service/controller structure and dependencies

3. **Create test**: Write unit test FIRST in `apps/api/src/<module>/<file>.spec.ts`

4. **Create implementation**: Write the service/controller

5. **Run test**: `pnpm test:ci <test-file-pattern>`

6. **Iterate**: Fix until test passes
   </process>

<test_template>

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MyService } from './my.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  myModel: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

describe('MyService', () => {
  let service: MyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should do something', async () => {
    mockPrismaService.myModel.findMany.mockResolvedValue([]);
    const result = await service.findAll('org-id');
    expect(result).toEqual([]);
    expect(mockPrismaService.myModel.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'org-id' },
    });
  });
});
```

</test_template>

<mock_patterns>

```typescript
// Mock NestJS providers
{ provide: ServiceName, useValue: { method: vi.fn() } }

// Mock with spy
const spy = vi.spyOn(service, 'method').mockResolvedValue(result);

// Reset mocks between tests
afterEach(() => vi.clearAllMocks());
```

</mock_patterns>

<rules>
- Write test FIRST - no exceptions
- Read 3 files minimum before creating
- Unit tests for services WITHOUT database (mock PrismaService)
- Mock ALL external dependencies with `vi.fn()`
- Use `Test.createTestingModule` for NestJS DI
- ALWAYS run `pnpm test:ci` (NEVER interactive `pnpm test`)
</rules>

<success_criteria>

- Test written before implementation
- Service follows existing NestJS patterns
- Test passes with `pnpm test:ci`
  </success_criteria>

---

Create unit test for: $ARGUMENTS
