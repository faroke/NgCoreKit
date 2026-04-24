---
description: Create end-to-end tests using Playwright for Angular application user flows
allowed-tools: Read, Write, Edit, Glob, Bash(pnpm test:e2e:ci *)
---

<objective>
Create comprehensive E2E tests using Playwright for the NgCoreKit Angular frontend, testing real user flows against the NestJS API.
</objective>

<process>
1. **Research**: Read 3+ similar files (MANDATORY)
   - Check existing `apps/web/e2e/` tests for patterns
   - Check `apps/web/e2e/utils/` for test utilities (auth helpers, etc.)

2. **Plan**: Define test scenarios (happy path, edge cases)

3. **Create test**: Write in `apps/web/e2e/<feature>.spec.ts`

4. **Run test**: `pnpm test:e2e:ci -g "test-name"` (from `apps/web/`)

5. **Iterate**: Fix until test passes, remove debug logs
   </process>

<test_template>

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Login via API call to NestJS (faster than UI login)
    await page.request.post('http://localhost:3000/auth/sign-in', {
      data: { email: 'test@example.com', password: 'password' },
    });
  });

  test('should complete user flow', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    await page.getByRole('button', { name: /create/i }).click();
    await page.getByLabel(/name/i).fill('Test Resource');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText('Test Resource')).toBeVisible();
  });
});
```

</test_template>

<angular_patterns>
```typescript
// Angular router navigation
await page.goto('/orgs/test-org/dashboard');
await page.waitForURL(/\/orgs\/.*\/dashboard/);

// Angular Material / Zard UI components
await page.getByRole('button', { name: /submit/i }).click();
await page.getByLabel(/email address/i).fill('user@example.com');

// TanStack Query loading states
await page.waitForSelector('[data-testid="loading"]', { state: 'hidden' });

// Verify Angular router navigation
await expect(page).toHaveURL(/\/success/);
```
</angular_patterns>

<route_patterns>
Angular routes in NgCoreKit:
- `/` — Home/Landing
- `/auth/login` — Login page
- `/auth/register` — Registration
- `/dashboard` — User dashboard
- `/orgs/:orgSlug` — Organization view
- `/orgs/:orgSlug/settings` — Org settings
- `/account` — Account settings
</route_patterns>

<rules>
- Write tests in `apps/web/e2e/<feature>.spec.ts`
- Prefer API calls for test setup (login) over UI interactions
- NO `page.pause()` or screenshots in committed tests
- Remove debug logs after test passes
- Run: `pnpm test:e2e:ci` (never interactive)
- Use `data-testid` attributes for stable selectors when needed
</rules>

<success_criteria>
- Test covers main flow and critical edge cases
- Uses API calls for auth setup when possible
- All assertions pass with `pnpm test:e2e:ci`
- No hardcoded waits — use `waitForURL`, `waitForSelector`, etc.
</success_criteria>

---

Create E2E test for: $ARGUMENTS
