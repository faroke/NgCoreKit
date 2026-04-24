# Fetching Patterns — Angular Frontend

## Decision Guide

### Use `resource()` (Angular built-in) When:
- Simple one-off data fetch in a component
- Data tied to component lifecycle
- No sharing needed across components
- No cache invalidation needed

### Use TanStack Query When:
- Data shared across multiple components
- Need caching and automatic refetching
- Implementing optimistic updates
- Paginated/infinite lists
- Complex loading/error state management

### Use NgRx SignalStore When:
- Shared application state (auth, org context)
- State that survives navigation
- Data that doesn't come from the API

## `resource()` Pattern

```typescript
import { resource, inject } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';

@Component({ standalone: true, ... })
export class OrgSettingsComponent {
  private api = inject(ApiService);

  protected readonly settings = resource({
    loader: () => this.api.get('/api/organizations/settings'),
  });
}
```

```html
@if (settings.isLoading()) { <app-spinner /> }
@if (settings.error()) { <p>Failed to load settings</p> }
@if (settings.value()) {
  <form [value]="settings.value()">...</form>
}
```

## TanStack Query Pattern

```typescript
import { Component, inject } from '@angular/core';
import { injectQuery, injectMutation } from '@tanstack/angular-query-experimental';
import { ApiService } from '@/app/core/services/api.service';

@Component({ standalone: true, ... })
export class MembersComponent {
  private api = inject(ApiService);

  // Query
  protected readonly membersQuery = injectQuery(() => ({
    queryKey: ['members', this.orgId()],
    queryFn: () => this.api.get(`/api/organizations/${this.orgId()}/members`),
    enabled: !!this.orgId(),
  }));

  // Mutation
  protected readonly removeMember = injectMutation(() => ({
    mutationFn: (userId: string) =>
      this.api.delete(`/api/organizations/${this.orgId()}/members/${userId}`),
    onSuccess: () => {
      // Invalidate to refresh members list
      this.queryClient.invalidateQueries({ queryKey: ['members', this.orgId()] });
    },
  }));
}
```

## ApiService — HTTP Client Wrapper

**ALWAYS use `ApiService`** — never inject `HttpClient` directly in components.

```typescript
import { ApiService } from '@/app/core/services/api.service';

// GET
const data = await this.api.get<ResponseType>('/api/endpoint');

// POST
const result = await this.api.post<ResponseType>('/api/endpoint', body);

// PATCH
const updated = await this.api.patch<ResponseType>('/api/endpoint/id', body);

// DELETE
await this.api.delete('/api/endpoint/id');
```

## NEVER Do

- **NEVER** inject `HttpClient` directly in components — use `ApiService`
- **NEVER** use `fetch()` in components
- **NEVER** skip loading states for async operations
- **NEVER** put server data in NgRx SignalStore (use TanStack Query or `resource()`)
