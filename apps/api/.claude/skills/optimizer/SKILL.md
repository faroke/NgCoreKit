---
name: optimizer
description: This skill should be used when the user asks to "optimize", "improve performance", "add caching", "reduce N+1 queries", or mentions Redis, Prisma optimization, query performance for the NestJS API.
---

<objective>
Guide optimal patterns for NgCoreKit NestJS API development. Covers Redis caching, Prisma query optimization, N+1 query elimination, and response efficiency.
</objective>

<quick_start>
<decision_tree>
**Choose the right optimization:**

| Need | Solution |
|------|----------|
| Repeated expensive queries | Redis cache with TTL |
| N+1 queries | Prisma `include` or `select` |
| Paginated lists | Cursor-based or offset pagination |
| Heavy aggregations | Prisma `groupBy` + `_count` |
| Real-time data | Skip cache, use WebSockets |
| Auth session lookup | Cache in request scope |
</decision_tree>
</quick_start>

<redis_caching>
## Redis Caching (ioredis)

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class ResourceService {
  constructor(
    private prisma: PrismaService,
    @InjectRedis() private redis: Redis,
  ) {}

  async findAll(organizationId: string) {
    const cacheKey = `org:${organizationId}:resources`;
    const cached = await this.redis.get(cacheKey);

    if (cached) return JSON.parse(cached);

    const resources = await this.prisma.resource.findMany({
      where: { organizationId },
    });

    await this.redis.set(cacheKey, JSON.stringify(resources), 'EX', 300); // 5 min TTL
    return resources;
  }

  async invalidateCache(organizationId: string) {
    await this.redis.del(`org:${organizationId}:resources`);
  }
}
```

**Cache invalidation after mutations:**
```typescript
async create(organizationId: string, dto: CreateResourceDto) {
  const resource = await this.prisma.resource.create({ data: { ...dto, organizationId } });
  await this.invalidateCache(organizationId); // Always invalidate after write
  return resource;
}
```
</redis_caching>

<prisma_optimization>
## Prisma Query Optimization

### Eliminate N+1 with `include`
```typescript
// BAD - N+1 queries
const orgs = await this.prisma.organization.findMany();
for (const org of orgs) {
  org.members = await this.prisma.member.findMany({ where: { organizationId: org.id } });
}

// GOOD - single query
const orgs = await this.prisma.organization.findMany({
  include: { members: true },
});
```

### Select only needed fields
```typescript
// GOOD - avoid fetching unnecessary data
const users = await this.prisma.user.findMany({
  select: { id: true, name: true, email: true },
  // Omit: passwordHash, sensitiveField, largeJsonField
});
```

### Pagination
```typescript
// Offset pagination
async findAll(organizationId: string, page: number, limit: number) {
  const [items, total] = await Promise.all([
    this.prisma.resource.findMany({
      where: { organizationId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.resource.count({ where: { organizationId } }),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}
```

### Batch operations
```typescript
// GOOD - batch instead of loop
await this.prisma.resource.updateMany({
  where: { organizationId, status: 'pending' },
  data: { status: 'active' },
});
```
</prisma_optimization>

<success_criteria>
- N+1 queries eliminated with `include`/`select`
- Expensive repeated queries cached in Redis
- Cache invalidated after every write operation
- Pagination implemented for list endpoints
- `select` used to avoid fetching unnecessary fields
</success_criteria>
