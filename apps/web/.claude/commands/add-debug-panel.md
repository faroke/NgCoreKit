---
description: Add debug actions or info to the Angular Debug Panel (dev-only)
allowed-tools: Read, Write, Edit, Glob, Grep
---

<objective>
Add custom debug actions or info to the Angular Debug Panel. The Debug Panel is a development-only tool that displays useful state and provides quick action buttons.
</objective>

<overview>
The Debug Panel (`src/app/core/stores/debug-panel.store.ts`) provides:
- **Dev-only**: Hidden in production (`isDevMode()` check)
- **NgRx SignalStore**: State managed via `@ngrx/signals`
- **Actions**: Buttons to trigger debug actions
- **Info**: Key/value info display
- **Check**: `src/app/core/stores/debug-panel.store.ts` for the store API
</overview>

<process>
1. **Read the store**: Check `src/app/core/stores/debug-panel.store.ts` for current API
2. **Read existing usage**: Find components that already use the debug panel
3. **Identify what to add**: Action (button) or Info (display value)
4. **Inject the store**: Use `inject(DebugPanelStore)` in the component
5. **Register on init**: Use `ngOnInit` to register, `ngOnDestroy` to clean up
</process>

<pattern>

## Pattern 1: Add Debug Action

```typescript
import { Component, OnDestroy, OnInit, inject, isDevMode } from '@angular/core';
import { DebugPanelStore } from '@/app/core/stores/debug-panel.store';

@Component({ standalone: true, ... })
export class MyComponent implements OnInit, OnDestroy {
  private debugPanel = inject(DebugPanelStore);

  ngOnInit(): void {
    if (!isDevMode()) return;

    this.debugPanel.registerAction({
      id: 'clear-cache',
      label: 'Clear Cache',
      onClick: () => this.clearCache(),
    });
  }

  ngOnDestroy(): void {
    if (!isDevMode()) return;
    this.debugPanel.removeAction('clear-cache');
  }

  private clearCache(): void {
    // action implementation
  }
}
```

## Pattern 2: Add Debug Info

```typescript
import { Component, OnDestroy, OnInit, inject, isDevMode, signal } from '@angular/core';

@Component({ standalone: true, ... })
export class MyComponent implements OnInit, OnDestroy {
  private debugPanel = inject(DebugPanelStore);
  protected readonly count = signal(0);

  ngOnInit(): void {
    if (!isDevMode()) return;
    this.debugPanel.registerInfo({
      id: 'item-count',
      label: 'Item Count',
      getValue: () => this.count(),
    });
  }

  ngOnDestroy(): void {
    if (!isDevMode()) return;
    this.debugPanel.removeInfo('item-count');
  }
}
```

</pattern>

<rules>
- ALWAYS read `debug-panel.store.ts` before implementing — API may differ from examples
- Gate all debug panel calls behind `isDevMode()`
- Use unique `id` values to avoid conflicts
- Always clean up (remove) registrations in `ngOnDestroy`
- Debug panel is only visible in development mode
</rules>

<success_criteria>
- Action/Info appears in Debug Panel when component is mounted
- Automatically removed on component destroy
- Hidden in production (`isDevMode()` check)
- No duplicate IDs with existing debug items
</success_criteria>
