# State Management — NgRx SignalStore

## When to Use SignalStore

Use `@ngrx/signals` SignalStore for:
- Shared state between multiple components
- Auth state (user, session)
- Organization context (current org)
- Application-wide UI state (sidebar, debug panel)
- State that needs to persist across navigations

**Do NOT use SignalStore for:**
- Server data that changes frequently (use TanStack Query)
- Local component state (use component signals)
- Form state (use Angular Signal Forms)

## Store Pattern

```typescript
// src/app/core/stores/my.store.ts
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';

type MyState = {
  items: Item[];
  isLoading: boolean;
  error: string | null;
};

const initialState: MyState = {
  items: [],
  isLoading: false,
  error: null,
};

export const MyStore = signalStore(
  { providedIn: 'root' },  // Singleton — share across components
  withState(initialState),
  withComputed(({ items }) => ({
    itemCount: computed(() => items().length),
    activeItems: computed(() => items().filter((i) => i.active)),
  })),
  withMethods((store, api = inject(ApiService)) => ({
    async loadItems() {
      patchState(store, { isLoading: true, error: null });
      try {
        const items = await api.get<Item[]>('/api/items');
        patchState(store, { items, isLoading: false });
      } catch (err) {
        patchState(store, { error: String(err), isLoading: false });
      }
    },

    addItem(item: Item) {
      patchState(store, { items: [...store.items(), item] });
    },

    removeItem(id: string) {
      patchState(store, { items: store.items().filter((i) => i.id !== id) });
    },
  })),
);
```

## Using a Store in a Component

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { MyStore } from '@/app/core/stores/my.store';

@Component({
  standalone: true,
  providers: [],  // Don't provide here — use root-provided store
  ...
})
export class MyComponent implements OnInit {
  protected readonly store = inject(MyStore);

  ngOnInit() {
    this.store.loadItems();
  }
}
```

```html
@if (store.isLoading()) {
  <app-spinner />
}

@for (item of store.activeItems(); track item.id) {
  <div>{{ item.name }}</div>
}

<p>Total: {{ store.itemCount() }}</p>
```

## Existing Stores

| Store | Location | Purpose |
|-------|----------|---------|
| `AuthStore` | `core/auth/auth.store.ts` | User session, auth state |
| `OrgContextStore` | `core/stores/org-context.store.ts` | Current organization |
| `AccountStore` | `core/stores/account.store.ts` | User account data |
| `DebugPanelStore` | `core/stores/debug-panel.store.ts` | Dev debug panel |

**Read existing stores** before creating a new one — what you need may already exist.
