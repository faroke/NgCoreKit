---
description: Build NestJS endpoints using Test-Driven Development with Supertest integration tests and real database
allowed-tools: Read, Write, Edit, Glob, Bash(pnpm test:ci *)
---

<objective>
Build NestJS endpoints using TDD with Supertest integration tests. Write tests FIRST, then implement. Uses real NestJS application with HTTP requests.
</objective>

<process>
1. **Research**: Read 3+ similar files (MANDATORY)
   - Check existing integration tests in `apps/api/test/`
   - Check `apps/api/src/organizations/organizations.controller.ts` for patterns

2. **Plan**: Define endpoint structure, DTOs, and expected responses

3. **Create test**: Write integration test FIRST in `apps/api/test/<feature>.spec.ts`

4. **Create implementation**: Controller, Service, Module, DTOs

5. **Run test**: `pnpm test:ci <test-file-pattern>`

6. **Iterate**: Fix until test passes
   </process>

<test_template>

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('FeatureName (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.myModel.deleteMany({ where: { name: { startsWith: 'test-' } } });
    await app.close();
  });

  it('GET /resource - returns list', async () => {
    const response = await request(app.getHttpServer())
      .get('/resource')
      .set('Cookie', 'session=test-session-token')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('POST /resource - creates resource', async () => {
    const response = await request(app.getHttpServer())
      .post('/resource')
      .set('Cookie', 'session=test-session-token')
      .send({ name: 'test-resource' })
      .expect(201);

    expect(response.body).toMatchObject({ name: 'test-resource' });
  });
});
```

</test_template>

<patterns>
```typescript
// Auth header
.set('Cookie', 'better-auth.session_token=<token>')

// Org header (for org-scoped endpoints)
.set('x-org-slug', 'test-org')

// JSON body
.send({ field: 'value' })

// Query params
.query({ page: 1, limit: 10 })

// Status assertions
.expect(200)
.expect(201)
.expect(401)
.expect(403)
.expect(404)
```
</patterns>

<rules>
- Write test FIRST - no exceptions
- Read 3 files minimum before creating
- Integration tests use real NestJS application and real database
- Always clean up test data in `afterAll`
- ALWAYS run `pnpm test:ci` (NEVER interactive `pnpm test`)
- Use `ValidationPipe` in test app for realistic behavior
</rules>

<success_criteria>

- Test written before implementation
- Controller follows existing NestJS patterns
- Test passes with `pnpm test:ci`
  </success_criteria>

---

Create integration test for: $ARGUMENTS
