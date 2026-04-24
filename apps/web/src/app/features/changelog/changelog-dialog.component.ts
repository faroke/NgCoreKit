import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, X } from 'lucide-angular';
import { ChangelogManagerStore } from './changelog-manager.store';
import { ContentService } from '../../core/services/content.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-changelog-dialog',
  imports: [RouterLink, LucideAngularModule],
  template: `
    @if (latestUnseen()) {
      <div class="fixed bottom-20 right-4 z-40 w-80 rounded-lg border bg-card shadow-lg">
        <div class="flex items-start justify-between p-4">
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-2">
              <span class="rounded-full border px-2 py-0.5 text-xs font-mono font-medium">
                {{ latestUnseen()!.version }}
              </span>
              <span class="text-xs text-muted-foreground">{{ latestUnseen()!.date }}</span>
            </div>
            <p class="mt-1 text-sm font-semibold">{{ latestUnseen()!.title }}</p>
            <p class="text-xs text-muted-foreground">{{ latestUnseen()!.summary }}</p>
          </div>
          <button
            type="button"
            class="ml-2 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            (click)="dismiss()"
            aria-label="Dismiss"
          >
            <lucide-icon [img]="xIcon" class="h-4 w-4" />
          </button>
        </div>
        <div class="flex items-center justify-between border-t px-4 py-2">
          <a
            [routerLink]="['/changelog', latestUnseen()!.slug]"
            class="text-xs font-medium underline underline-offset-4 hover:no-underline"
          >
            View full changelog
          </a>
          <button
            type="button"
            class="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            (click)="markAsSeen()"
          >
            Mark as read
          </button>
        </div>
      </div>
    }
  `,
})
export class ChangelogDialogComponent {
  private changelogStore = inject(ChangelogManagerStore);
  private contentService = inject(ContentService);

  protected readonly xIcon = X;

  protected readonly latestUnseen = computed(() => {
    const all = this.contentService.getChangelogs();
    return all.find((c) => !this.changelogStore.isVersionSeen(c.version)) ?? null;
  });

  markAsSeen() {
    const entry = this.latestUnseen();
    if (entry) {
      this.changelogStore.markAsSeen(entry.version);
    }
  }

  dismiss() {
    const entry = this.latestUnseen();
    if (entry) {
      this.changelogStore.dismiss(entry.version);
    }
  }
}
