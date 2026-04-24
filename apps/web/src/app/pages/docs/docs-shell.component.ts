import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import type { Doc } from '../../core/content/content.types';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-docs-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="mx-auto flex max-w-6xl gap-8 px-4 py-12">
      <!-- Sidebar -->
      <aside class="hidden w-56 shrink-0 md:block">
        <nav class="sticky top-20 flex flex-col gap-6">
          @for (section of sections; track section.name) {
            <div class="flex flex-col gap-1">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {{ section.name }}
              </p>
              @for (doc of section.docs; track doc.slug) {
                <a
                  [routerLink]="['/docs', doc.slug]"
                  routerLinkActive="bg-accent text-accent-foreground font-medium"
                  class="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {{ doc.title }}
                </a>
              }
            </div>
          }
        </nav>
      </aside>

      <!-- Content -->
      <main class="min-w-0 flex-1">
        <router-outlet />
      </main>
    </div>
  `,
})
export class DocsShellComponent {
  private contentService = inject(ContentService);

  protected readonly sections = this.buildSections();

  private buildSections(): Array<{ name: string; docs: Doc[] }> {
    const docs = this.contentService.getDocs();
    const sectionMap = new Map<string, Doc[]>();
    for (const doc of docs) {
      const existing = sectionMap.get(doc.section) ?? [];
      existing.push(doc);
      sectionMap.set(doc.section, existing);
    }
    return Array.from(sectionMap.entries()).map(([name, items]) => ({ name, docs: items }));
  }
}
