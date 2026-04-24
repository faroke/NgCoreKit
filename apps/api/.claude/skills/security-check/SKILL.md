---
name: security-check
description: This skill should be used when reviewing NestJS controllers, services, or guards for security. Use when the user asks to "security check", "review security", "audit code", or mentions authentication, authorization, multi-tenant, or access control for the API.
---

<objective>
Validate security patterns in NgCoreKit NestJS API. Ensures controllers, services, and Prisma queries follow proper authentication, authorization, and multi-tenant isolation patterns.
</objective>

<quick_start>
When reviewing code for security:

1. **Identify code type** — Controller, Service, or Guard
2. **Check auth level** — Is the endpoint protected appropriately?
3. **Check org isolation** — Does every Prisma query filter by `organizationId`?
4. **Check DTO validation** — Are all inputs validated?
5. **Report issues** — List security violations found
</quick_start>

<security_checklist>
## Controller Security Checklist

```
□ AuthGuard is global — verify @Public() usage is intentional
□ Org-scoped endpoints use OrgGuard
□ Admin endpoints use AdminGuard
□ All @Body() params use DTOs (never `any`)
□ Response uses DTO (never raw Prisma entity)
□ Webhook endpoints validate signatures (@Public() + signature check)
```

## Service Security Checklist

```
□ findMany always includes { where: { organizationId } }
□ findFirst/findUnique includes organizationId in where clause
□ update/delete verifies ownership before mutation
□ create always sets organizationId from authenticated context
□ No user-controlled input directly in where: { id } without org filter
```

## Prisma Query Checklist (CRITICAL for multi-tenant)

```typescript
// SECURE — always both id AND organizationId
await this.prisma.resource.findFirst({
  where: { id, organizationId },  // ✓
});

// INSECURE — ID alone allows cross-tenant access
await this.prisma.resource.findFirst({
  where: { id },  // ✗ MISSING organizationId
});
```
</security_checklist>

<common_violations>
**Critical security issues to check:**

1. **Missing @Public() — auth bypass risk**
   - Every endpoint without `@Public()` requires a valid session
   - Check that `@Public()` is only used for truly public endpoints

2. **Missing organizationId filter — cross-tenant data leak**
   - MOST CRITICAL: any Prisma query without `organizationId` in `where`
   - Can expose other customers' data

3. **Direct ID lookup without org validation**
   - `findFirst({ where: { id } })` — never OK for org-scoped resources
   - Always: `findFirst({ where: { id, organizationId } })`

4. **Missing DTO validation**
   - `@Body() body: any` — never acceptable
   - All DTOs must have class-validator decorators

5. **Sensitive data in responses**
   - Raw Prisma entities may include `passwordHash`, session tokens
   - Always use response DTOs with explicit fields

6. **Missing ownership check before mutation**
   - Find resource with `{ id, organizationId }` before update/delete
   - Throw `NotFoundException` if not found (not `ForbiddenException` — avoid info leakage)
</common_violations>

<success_criteria>
- Every endpoint is appropriately protected (AuthGuard global, @Public() intentional)
- All org-scoped Prisma queries filter by organizationId
- All inputs validated via DTOs with class-validator
- Responses use DTOs (no raw Prisma entities)
- Ownership verified before every mutation
- Stripe webhooks validate signatures
</success_criteria>
