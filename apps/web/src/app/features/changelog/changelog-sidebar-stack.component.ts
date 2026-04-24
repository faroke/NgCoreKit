import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-changelog-sidebar-stack',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col gap-2">
      <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent releases</p>
      @for (entry of entries; track entry.slug) {
        <a
          [routerLink]="['/changelog', entry.slug]"
          class="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent"
        >
          <span class="font-mono font-medium">{{ entry.version }}</span>
          <span class="text-xs text-muted-foreground">{{ entry.date }}</span>
        </a>
      }
    </div>
  `,
})
export class ChangelogSidebarStackComponent {
  private contentService = inject(ContentService);

  protected readonly entries = this.contentService.getChangelogs().slice(0, 3);
}
