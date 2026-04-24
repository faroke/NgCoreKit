---
name: create-tests
description: This skill should be used when the user asks to "create tests", "write tests", "add unit tests", "add integration tests", or mentions testing, Vitest, Supertest, or test coverage for the NestJS API.
---

<objective>
Create comprehensive tests for the NgCoreKit NestJS API using Vitest for unit tests and Supertest for integration tests. Ensure proper mocking, organization data isolation, and test data cleanup.
</objective>

<quick_start>
<unit_test>
Create unit test alongside source file (`*.spec.ts`):

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MyService } from './my.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  myModel: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
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
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  afterEach(() => vi.clearAllMocks());
});
```

Run: `pnpm test:ci`
</unit_test>

<integration_test>
Create integration test in `test/` directory:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { describe, it, beforeAll, afterAll } from 'vitest';
import { AppModule } from '../src/app.module';

describe('Feature (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(() => app.close());

  it('GET /endpoint - returns 200', () => {
    return request(app.getHttpServer())
      .get('/endpoint')
      .set('Cookie', 'better-auth.session_token=test-token')
      .expect(200);
  });
});
```

Run: `pnpm test:ci`
</integration_test>
</quick_start>

<test_commands>
**CRITICAL - Always use CI commands:**

- `pnpm test:ci` - All tests (non-interactive)
- `pnpm test:ci <pattern>` - Specific tests by file pattern
- `pnpm test:cov` - With coverage report

**NEVER use interactive commands** (`pnpm test`)
</test_commands>

<directory_structure>
```
apps/api/
├── src/
│   └── <module>/
│       ├── <module>.service.ts
│       └── <module>.service.spec.ts   # Unit tests co-located
├── test/
│   └── <feature>.spec.ts              # Integration tests
└── vitest.config.ts
```
</directory_structure>

<when_to_use_which>
| Test Type | Use For | Location |
|-----------|---------|----------|
| **Unit** | Services, isolated logic, validators | `src/**/*.spec.ts` |
| **Integration** | Controller endpoints, full request/response | `test/*.spec.ts` |

**Unit tests**: Fast, mocked dependencies, no real database
**Integration tests**: Real NestJS app, real database, full HTTP stack
</when_to_use_which>

<security_in_tests>
Always test organization isolation:

```typescript
it('should not return resources from other orgs', async () => {
  mockPrisma.resource.findMany.mockResolvedValue([]);
  await service.findAll('org-id-1');
  expect(mockPrisma.resource.findMany).toHaveBeenCalledWith({
    where: { organizationId: 'org-id-1' },
  });
});
```
</security_in_tests>

<success_criteria>
- Tests in correct directory (`src/` for unit, `test/` for integration)
- Mock providers use `vi.fn()` for all dependencies
- Organization filter always tested for org-scoped data
- Tests pass with `pnpm test:ci`
- Test data cleaned up in `afterAll`
</success_criteria>
