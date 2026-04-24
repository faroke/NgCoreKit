# API Routes — Controllers, Guards & Decorators

## Controller Structure

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OrgGuard } from '../organizations/org.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CurrentOrg, OrgContext } from '../auth/decorators/current-org.decorator';

@ApiTags('resources')
@Controller('resources')
@UseGuards(AuthGuard, OrgGuard)  // Add OrgGuard only for org-scoped endpoints
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  @ApiOperation({ summary: 'List all resources for the current organization' })
  @ApiResponse({ status: 200, type: [ResourceDto] })
  async findAll(@CurrentOrg() org: OrgContext): Promise<ResourceDto[]> {
    return this.resourceService.findAll(org.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiResponse({ status: 201, type: ResourceDto })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @CurrentOrg() org: OrgContext,
    @Body() dto: CreateResourceDto,
  ): Promise<ResourceDto> {
    return this.resourceService.create(org.id, user.id, dto);
  }
}
```

## Auth Levels

| Scenario | Guards | Decorator |
|----------|--------|-----------|
| Public endpoint | `@Public()` | — |
| Authenticated only | `AuthGuard` (global) | `@CurrentUser()` |
| Org-scoped | `AuthGuard` + `OrgGuard` | `@CurrentUser()` + `@CurrentOrg()` |
| Admin only | `AuthGuard` + `AdminGuard` | `@CurrentUser()` |

## @Public() — Exempt from Auth

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Get('health')
@Public()
async health(): Promise<string> {
  return 'ok';
}
```

## DTOs with Validation

```typescript
import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ example: 'My Resource' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Optional description' })
  @IsString()
  @IsOptional()
  description?: string;
}
```

## OrgGuard — Organization Header

The OrgGuard reads the `x-org-slug` header (or org param) to validate org membership.
Controllers using OrgGuard will have `req.org` populated via `@CurrentOrg()`.

## Response DTOs

Always return DTOs, never raw Prisma entities:

```typescript
export class ResourceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  createdAt: Date;
}
```
