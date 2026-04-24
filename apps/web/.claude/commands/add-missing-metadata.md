---
description: Systematically add missing page title and meta tags to Angular page components
allowed-tools: Read, Edit, Write, Glob, Grep
---

<objective>
Identify and add page titles and meta tags to Angular page components that are missing them, improving SEO and browser tab clarity.
</objective>

<process>
1. **Explore**: Find all `apps/web/src/app/pages/**/*.component.ts` files
2. **Analyze**: Identify page components that don't inject `Title` or `Meta` services
3. **Check MetaService**: Read `apps/web/src/app/core/services/meta.service.ts` for existing patterns
4. **Enhance**: Add title/meta setup following the project's MetaService pattern
5. **Verify**: Ensure all page components set a meaningful title
</process>

<pattern>

## Using MetaService (preferred — check if available)

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { MetaService } from '@/app/core/services/meta.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private meta = inject(MetaService);

  ngOnInit(): void {
    this.meta.setPage({
      title: 'Dashboard',
      description: 'Manage your organization dashboard',
    });
  }
}
```

## Using Angular Title/Meta directly (fallback)

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({ standalone: true, ... })
export class MyPageComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Page Title | AppName');
    this.meta.updateTag({ name: 'description', content: 'Page description' });
  }
}
```

</pattern>

<rules>
- ALWAYS read `meta.service.ts` first to understand the existing MetaService API
- ALWAYS read the page component before editing it
- Use the project's MetaService if it exists — don't use Title/Meta directly
- Keep titles concise and descriptive (< 60 chars recommended)
- Only add metadata to page-level components, not shared components
</rules>

<success_criteria>
- All page components set a meaningful title
- MetaService used consistently across all pages
- Descriptions accurately reflect page content
</success_criteria>
