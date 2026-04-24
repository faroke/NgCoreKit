# Security — NestJS API

## Multi-tenant Security Checklist

Before every code review or PR, verify:

### 1. Authentication on every endpoint
```typescript
// GOOD — AuthGuard is global, every endpoint is protected
// GOOD — use @Public() ONLY for intentionally public endpoints
@Get('status')
@Public()
async status() { return 'ok'; }

// BAD — never bypass auth without @Public()
```

### 2. Organization data isolation
```typescript
// GOOD — always filter by organizationId
await this.prisma.resource.findMany({
  where: { organizationId: org.id },
});

// BAD — cross-tenant data leak
await this.prisma.resource.findMany(); // NEVER
await this.prisma.resource.findFirst({ where: { id } }); // MISSING org filter
```

### 3. Ownership verification before mutation
```typescript
// GOOD — verify resource belongs to org before update/delete
async update(id: string, orgId: string, dto: UpdateDto) {
  const resource = await this.prisma.resource.findFirst({
    where: { id, organizationId: orgId }, // verify ownership
  });
  if (!resource) throw new NotFoundException();
  return this.prisma.resource.update({ where: { id }, data: dto });
}
```

### 4. DTO validation on all inputs
```typescript
// GOOD — class-validator decorators on all DTOs
export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

// BAD — accepting raw body without validation
@Post()
async create(@Body() body: any) { ... } // NEVER use `any`
```

### 5. Role-based access for sensitive operations
```typescript
// Admin operations require AdminGuard
@UseGuards(AdminGuard)
@Delete('users/:id')
async deleteUser(@Param('id') id: string) { ... }

// Org-scoped operations require OrgGuard
@UseGuards(OrgGuard)
@Get('members')
async getMembers(@CurrentOrg() org: OrgContext) { ... }
```

### 6. Never expose sensitive fields in responses
```typescript
// GOOD — response DTO excludes sensitive fields
export class UserDto {
  id: string;
  name: string;
  email: string;
  // No: passwordHash, sessionTokens, stripeCustomerId (unless needed)
}

// Never return raw Prisma objects — always use DTOs
```

### 7. Stripe webhook validation
```typescript
// Webhook endpoints must validate Stripe signature
@Public()
@Post('webhooks/stripe')
async handleWebhook(@Headers('stripe-signature') sig: string, @Body() body: Buffer) {
  const event = this.stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  ...
}
```

## OWASP Top 10 Reminders

- **Injection**: Use Prisma (parameterized queries) — never string interpolation in SQL
- **Auth failures**: `AuthGuard` is global — always check `@Public()` is intentional
- **Sensitive data**: Use DTOs to strip sensitive fields from responses
- **IDOR**: Always combine `id` with `organizationId` in where clauses
- **Misconfiguration**: Validate all env vars at startup in `ConfigModule`
