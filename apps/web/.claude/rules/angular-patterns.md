# Angular Patterns

## Standalone Components

All components are standalone — no NgModules:

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my.component.html',
})
export class MyComponent {
  // ...
}
```

## Signals

```typescript
// Basic signal
protected readonly count = signal(0);

// Computed (derived read-only)
protected readonly doubled = computed(() => this.count() * 2);

// Linked signal (derived writable)
protected readonly items = signal<string[]>([]);
protected readonly firstItem = linkedSignal(() => this.items()[0] ?? '');

// Effect (side effects)
constructor() {
  effect(() => {
    console.log('count changed:', this.count());
  });
}
```

## Dependency Injection with `inject()`

```typescript
// Preferred: inject() in property initializer
private router = inject(Router);
private apiService = inject(ApiService);
private authStore = inject(AuthStore);

// Avoid constructor injection (still valid but verbose)
constructor(private router: Router) {}
```

## `resource()` — Async Data in Components

```typescript
import { resource, inject } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';

@Component({ standalone: true, ... })
export class DashboardComponent {
  private api = inject(ApiService);

  // Async resource — auto-fetches, handles loading/error states
  protected readonly stats = resource({
    loader: () => this.api.get('/api/dashboard/stats'),
  });

  // In template
  // @if (stats.isLoading()) { <app-spinner /> }
  // @if (stats.value()) { <div>{{ stats.value().total }}</div> }
}
```

## Control Flow (Angular 17+ syntax)

```html
<!-- @if instead of *ngIf -->
@if (user()) {
  <p>{{ user().name }}</p>
} @else {
  <p>Not logged in</p>
}

<!-- @for instead of *ngFor -->
@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
}

<!-- @switch -->
@switch (status()) {
  @case ('active') { <span>Active</span> }
  @case ('inactive') { <span>Inactive</span> }
  @default { <span>Unknown</span> }
}
```

## Output Events (Angular 17+ syntax)

```typescript
// Output signal (preferred over EventEmitter)
protected readonly selected = output<string>();

// In template
<app-select (selected)="onSelect($event)" />
```

## Lifecycle Hooks

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({ standalone: true, ... })
export class MyComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    // Setup: subscribe, register, fetch
  }

  ngOnDestroy(): void {
    // Cleanup: unsubscribe, deregister
  }
}
```

## Route Parameters

```typescript
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ standalone: true, ... })
export class OrgComponent {
  private route = inject(ActivatedRoute);

  // Convert Observable to Signal
  protected readonly orgSlug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('orgSlug') ?? ''))
  );
}
```
