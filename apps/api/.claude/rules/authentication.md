# Authentication — NestJS API

## How Auth Works

Better Auth handles session management. The `AuthGuard` validates sessions on every request (globally applied).

## AuthGuard (Global)

Applied globally in `app.module.ts` — all endpoints protected by default:

```typescript
// src/auth/guards/auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = await this.authService.getSession(req);

    if (!session?.user) throw new UnauthorizedException('Not authenticated');

    req.user = { id, name, email, image, role };
    req.session = { id, activeOrganizationId };

    return true;
  }
}
```

## Decorators

```typescript
// Get authenticated user
@CurrentUser() user: AuthenticatedUser
// { id, name, email, image, role }

// Get current session
@CurrentSession() session: { id: string; activeOrganizationId: string | null }

// Get current org (requires OrgGuard)
@CurrentOrg() org: OrgContext
// { id, name, slug, logo, metadata, stripeCustomerId, email, currentUserRole }
```

## @Public() — Skip Auth

```typescript
import { Public } from '@/auth/decorators/public.decorator';

@Get('webhook')
@Public()
async handleWebhook(@Body() body: unknown): Promise<void> { ... }
```

## AdminGuard

```typescript
import { AdminGuard } from '@/auth/guards/admin.guard';

@UseGuards(AdminGuard)
@Get('admin/users')
async adminListUsers(): Promise<UserDto[]> { ... }
```

## OrgGuard — Organization Membership

```typescript
import { OrgGuard } from '@/organizations/org.guard';

@UseGuards(OrgGuard)
@Get()
async findAll(@CurrentOrg() org: OrgContext): Promise<ResourceDto[]> { ... }
```

## Auth Configuration

`src/auth/auth.config.ts` — Better Auth configuration with:
- Session management
- Organization support
- OAuth providers
- Email/password flow

## Types

```typescript
type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
};

type OrgContext = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: string | null;
  stripeCustomerId: string | null;
  email: string | null;
  currentUserRole: string;
};
```
