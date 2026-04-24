---
name: security-check
description: This skill should be used when reviewing Angular components, guards, or interceptors for security. Use when the user asks to "security check", "review security", "audit code", or mentions authentication, route guards, or access control for the Angular frontend.
---

<objective>
Validate security patterns in the NgCoreKit Angular frontend. Ensures components, route guards, and HTTP interceptors follow proper authentication and authorization patterns.
</objective>

<quick_start>
When reviewing Angular code for security:

1. **Check route guards** — Are protected routes using correct guards?
2. **Check interceptors** — Is auth sent correctly to the API?
3. **Check sensitive data** — Is sensitive data stored in localStorage/sessionStorage?
4. **Check API calls** — Are org-scoped API calls using the correct org context?
5. **Report issues** — List security violations found
</quick_start>

<security_checklist>
## Route Guard Checklist

```
□ Authenticated routes use AuthGuard (canActivate)
□ Guest-only routes (login/register) use GuestGuard
□ Org-scoped routes use OrgGuard
□ Admin routes use AdminGuard
□ Guards redirect to appropriate pages on failure
```

## Guard Patterns

```typescript
// Correct guard usage in routes
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard],  // ✓ Protected
}

{
  path: 'auth/login',
  component: LoginComponent,
  canActivate: [GuestGuard],  // ✓ Redirect if already logged in
}

{
  path: 'orgs/:orgSlug',
  component: OrgComponent,
  canActivate: [AuthGuard, OrgGuard],  // ✓ Auth + org membership
}
```

## Auth Interceptor Checklist

```
□ Session cookie/token included in API requests
□ Interceptor handles 401 → redirect to login
□ Interceptor handles 403 → show error or redirect
□ No sensitive data in request logs
```

## Sensitive Data Checklist

```
□ No session tokens in localStorage (use httpOnly cookies)
□ No passwords or secrets in component state
□ No sensitive data in URL params (use POST body)
□ TanStack Query cache doesn't store sensitive data longer than needed
```

## Component Security Checklist

```
□ Admin-only UI elements hidden with proper role check (not just CSS)
□ User input sanitized (Angular's DomSanitizer for HTML content)
□ No dangerouslySetInnerHTML equivalent — avoid [innerHTML] without sanitization
□ No sensitive business logic in client-side code
```
</security_checklist>

<common_violations>
**Critical security issues to check:**

1. **Missing route guard** — Route accessible without authentication
   - Check every route definition for `canActivate`

2. **Role check in UI only** — Hiding a button doesn't prevent API calls
   - UI role checks are UX, not security — API must also check

3. **Storing tokens in localStorage** — Vulnerable to XSS
   - Use httpOnly cookies (managed by Better Auth)

4. **Exposing org data without validation** — Frontend shows data based on URL params
   - API validates org membership — frontend should match API's auth model

5. **Using innerHTML without sanitization** — XSS risk
   - Angular auto-escapes template bindings — only `[innerHTML]` is risky
   - Use `DomSanitizer.bypassSecurityTrustHtml()` only when absolutely necessary
</common_violations>

<success_criteria>
- All protected routes have appropriate guards (AuthGuard, OrgGuard, AdminGuard)
- Auth interceptor sends session credentials to API
- 401/403 responses handled (redirect to login/error)
- No session tokens in localStorage
- Admin-only features protected by API, not just UI
- No unescaped HTML content (`[innerHTML]` without sanitization)
</success_criteria>
