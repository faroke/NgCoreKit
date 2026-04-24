---
name: optimizer
description: This skill should be used when the user asks to "optimize", "improve performance", "add caching", "use TanStack Query", "add state management", or mentions NgRx SignalStore, Angular signals, resource(), or TanStack Query for the Angular frontend.
---

<objective>
Guide optimal patterns for NgCoreKit Angular frontend development. Covers NgRx SignalStore for state, TanStack Query for server data, Angular Signal Forms, and performance optimization with signals.
</objective>

<quick_start>
<decision_tree>
**Choose the right tool:**

| Need | Solution |
|------|----------|
| Shared app state | NgRx SignalStore |
| Server data (simple fetch) | `resource()` |
| Server data (shared/cached) | TanStack Query |
| Optimistic updates | TanStack Query mutations |
| Form handling | Angular Signal Forms |
| URL state (filters, params) | `ActivatedRoute` + `Router.navigate` |
| Local component state | `signal()` |
</decision_tree>
</quick_start>

<ngrx_signal_store>
## NgRx SignalStore — Shared State

```typescript
export const MyStore = signalStore(
  { providedIn: 'root' },
  withState({ items: [] as Item[], isLoading: false }),
  withComputed(({ items }) => ({
    count: computed(() => items().length),
  })),
  withMethods((store, api = inject(ApiService)) => ({
    async load() {
      patchState(store, { isLoading: true });
      const items = await api.get<Item[]>('/api/items');
      patchState(store, { items, isLoading: false });
    },
  })),
);
```
</ngrx_signal_store>

<tanstack_query>
## TanStack Query — Server Data with Caching

```typescript
// Query with cache
protected readonly query = injectQuery(() => ({
  queryKey: ['items', this.orgId()],
  queryFn: () => this.api.get<Item[]>(`/api/orgs/${this.orgId()}/items`),
  staleTime: 5 * 60 * 1000, // 5 minutes
}));

// Mutation with cache invalidation
protected readonly create = injectMutation((client) => ({
  mutationFn: (dto: CreateItemDto) => this.api.post('/api/items', dto),
  onSuccess: () => client.invalidateQueries({ queryKey: ['items'] }),
}));
```
</tanstack_query>

<signal_forms>
## Angular Signal Forms

```typescript
protected readonly model = signal({ name: '', email: '' });
protected readonly myForm = form(this.model, (s) => {
  required(s.name);
  required(s.email);
  email(s.email);
});
```

```html
<input [formField]="myForm.name" />
<button [disabled]="myForm.invalid()">Submit</button>
```
</signal_forms>

<performance>
## Performance Patterns

### Avoid unnecessary re-renders with computed()
```typescript
// BAD — recalculates every time component re-renders
get activeItems() {
  return this.items().filter(i => i.active);
}

// GOOD — only recalculates when items signal changes
protected readonly activeItems = computed(() =>
  this.items().filter(i => i.active)
);
```

### Use trackBy in @for
```html
@for (item of items(); track item.id) {
  <app-item [item]="item" />
}
```

### Lazy load feature modules
```typescript
// In routes
{
  path: 'settings',
  loadComponent: () => import('./settings/settings.component')
    .then(m => m.SettingsComponent),
}
```
</performance>

<anti_patterns>
**WRONG:**
```typescript
// Using HttpClient directly in component
private http = inject(HttpClient);
ngOnInit() { this.http.get('/api/data').subscribe(...) }

// Using subscription without cleanup
ngOnInit() { service.getData().subscribe(data => this.data = data) }

// Raw fetch in component
ngOnInit() { fetch('/api/data').then(...) }
```

**CORRECT:**
```typescript
// Use resource() for simple fetches
protected readonly data = resource({ loader: () => this.api.get('/api/data') });

// Use TanStack Query for cached, shared data
protected readonly query = injectQuery(() => ({ queryKey: ['data'], queryFn: ... }));
```
</anti_patterns>

<success_criteria>
- NgRx SignalStore for shared/global state
- TanStack Query for server data that needs caching or sharing
- `resource()` for simple component-local async data
- Signal Forms for all forms
- No raw HttpClient or fetch in components
- `computed()` for derived state (not getters)
</success_criteria>
