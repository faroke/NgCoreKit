# Testing — NestJS API

## Test Runner

**Vitest** — not Jest. Configuration in `vitest.config.ts` at `apps/api/`.

## Commands

```bash
# ALWAYS use CI commands (non-interactive)
pnpm test:ci                    # Run all tests
pnpm test:ci <pattern>          # Run specific tests
pnpm test:cov                   # Run with coverage

# NEVER use interactive commands
# pnpm test  <- NEVER (interactive, not compatible with Claude Code)
```

## Unit Tests

Located in `apps/api/src/` as `*.spec.ts` files alongside source files.

Use `Test.createTestingModule` to create an isolated NestJS module:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MyService', () => {
  let service: MyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: OtherService, useValue: { method: vi.fn() } },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
  });
});
```

## Mock Patterns

```typescript
// Mock a service
const mockService = {
  findAll: vi.fn().mockResolvedValue([]),
  findOne: vi.fn().mockResolvedValue({ id: '1', name: 'test' }),
  create: vi.fn().mockResolvedValue({ id: '1', name: 'test' }),
};

// Mock Prisma model
const mockPrismaService = {
  resource: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

// Reset mocks between tests
afterEach(() => vi.clearAllMocks());

// Assert Prisma always filters by org
expect(mockPrismaService.resource.findMany).toHaveBeenCalledWith({
  where: { organizationId: 'test-org-id' },
});
```

## Integration Tests

Located in `apps/api/test/` as `*.spec.ts` files.

Use real `NestApplication` with Supertest:

```typescript
import * as request from 'supertest';

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();
});

it('GET /resources', async () => {
  await request(app.getHttpServer())
    .get('/resources')
    .set('Cookie', 'session=test-token')
    .expect(200);
});
```

## Test File Naming

- Unit: `src/<module>/<name>.spec.ts`
- Integration: `test/<feature>.spec.ts`
