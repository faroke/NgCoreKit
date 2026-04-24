# UI / UX — Angular Frontend

## Core Rules

- **Never use emojis** — use Lucide Angular icons instead
- **Never use gradients** unless explicitly requested by the user
- **Mobile-first** with TailwindCSS v4 responsive utilities
- **No custom `<div>` wrappers** — use Zard UI card/container components

## Component Library — Zard UI

Zard UI is a CVA (class-variance-authority) based component library for Angular.

```typescript
import { ButtonComponent } from '@/app/components/ui/button.component';
import { CardComponent } from '@/app/components/ui/card.component';
import { InputComponent } from '@/app/components/ui/input.component';
```

**Read existing UI components** in `src/app/components/` before creating new ones.

## Icons — Lucide Angular

```typescript
import { LucideAngularModule, Settings, Users, Plus } from 'lucide-angular';

@Component({
  standalone: true,
  imports: [LucideAngularModule],
  ...
})
export class MyComponent {
  protected readonly settingsIcon = Settings;
}
```

```html
<lucide-icon [img]="settingsIcon" [size]="16" />
```

## Spacing

- Use `flex flex-col gap-4` for vertical spacing (not `space-y-4`)
- Use `flex gap-4` for horizontal spacing (not `space-x-4`)

## Layout

```html
<!-- Page layout -->
<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col gap-6">
    <!-- Content -->
  </div>
</div>

<!-- Card container instead of custom div -->
<app-card>
  <div class="flex flex-col gap-4">
    <!-- Card content -->
  </div>
</app-card>
```

## Typography

Use shared typography components if available:

```html
<!-- Instead of raw h1/p, use typography components -->
<app-heading level="1">Page Title</app-heading>
<app-paragraph>Description text</app-paragraph>
```

If typography components don't exist yet, use Tailwind directly:
```html
<h1 class="text-2xl font-semibold tracking-tight">Title</h1>
<p class="text-sm text-muted-foreground">Description</p>
```

## Loading States

Always show loading state for async operations:

```html
@if (query.isPending()) {
  <div class="flex items-center justify-center py-8">
    <lucide-icon [img]="loaderIcon" class="animate-spin" [size]="24" />
  </div>
} @else if (query.isError()) {
  <app-alert variant="destructive">Failed to load data</app-alert>
} @else {
  <!-- Data content -->
}
```

## Dark Mode

TailwindCSS v4 dark mode is configured via CSS variables. Use semantic color tokens:
- `bg-background` / `text-foreground`
- `bg-muted` / `text-muted-foreground`
- `bg-card` / `border-border`
- `text-primary` / `text-destructive`

## Accessibility

- Always add `aria-label` to icon-only buttons
- Use semantic HTML (`button`, `nav`, `main`, `section`)
- Ensure focus-visible styles are present
- Provide alt text for images
