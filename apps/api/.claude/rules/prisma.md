# Prisma — Database Conventions

## PrismaService

```typescript
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}
}
```

## Multi-file Schema

Schema is split across multiple files in `prisma/schema/`:
- `schema.prisma` — Main application models
- `better-auth.prisma` — Auth models (auto-generated, do NOT edit manually)

## CRITICAL: Organization Filtering

**ALL queries on org-scoped models MUST filter by `organizationId`.**
This is the #1 multi-tenant security rule.

```typescript
// CORRECT - always filter by org
async findAll(organizationId: string) {
  return this.prisma.resource.findMany({
    where: { organizationId },
  });
}

// WRONG - exposes cross-tenant data
async findAll() {
  return this.prisma.resource.findMany(); // NEVER
}
```

## Query Patterns

```typescript
// Find all for org
await this.prisma.resource.findMany({
  where: { organizationId: org.id },
  orderBy: { createdAt: 'desc' },
});

// Find one — always verify org ownership
async findOne(id: string, organizationId: string) {
  const resource = await this.prisma.resource.findFirst({
    where: { id, organizationId },  // BOTH conditions
  });
  if (!resource) throw new NotFoundException('Resource not found');
  return resource;
}

// Create — always include organizationId
async create(organizationId: string, userId: string, dto: CreateResourceDto) {
  return this.prisma.resource.create({
    data: { ...dto, organizationId, createdById: userId },
  });
}

// Update — verify ownership before updating
async update(id: string, organizationId: string, dto: UpdateResourceDto) {
  await this.findOne(id, organizationId); // Verify ownership
  return this.prisma.resource.update({
    where: { id },
    data: dto,
  });
}

// Delete — verify ownership before deleting
async remove(id: string, organizationId: string) {
  await this.findOne(id, organizationId); // Verify ownership
  return this.prisma.resource.delete({ where: { id } });
}
```

## Commands

```bash
pnpm prisma:generate    # Generate Prisma client after schema changes
pnpm prisma:migrate     # Run migrations in dev
pnpm prisma:seed        # Seed database
```

## Migrations

- Migration files in `prisma/schema/migrations/`
- NEVER modify existing migration files
- Use `/migration-rename` command to safely rename columns
- Run `pnpm prisma:generate` after schema changes to update the client
