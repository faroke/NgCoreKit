import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { MetaService } from '../../core/services/meta.service';
import type { ChangelogEntry } from '../../core/content/content.types';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-changelog-list',
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-16">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold">Changelog</h1>
        <p class="text-muted-foreground">Track what is new in NgCoreKit.</p>
      </div>

      <div class="relative mt-12 flex flex-col gap-0">
        <!-- Timeline line -->
        <div class="absolute left-[7px] top-2 h-full w-px bg-border"></div>

        @for (entry of entries; track entry.slug) {
          <div class="relative flex gap-6 pb-10">
            <!-- Timeline dot -->
            <div class="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-background"></div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-3">
                <span class="rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium">
                  {{ entry.version }}
                </span>
                <span class="text-xs text-muted-foreground">{{ entry.date }}</span>
              </div>
              <h2 class="text-xl font-semibold">
                <a [routerLink]="['/changelog', entry.slug]" class="hover:underline">
                  {{ entry.title }}
                </a>
              </h2>
              <p class="text-muted-foreground">{{ entry.summary }}</p>
              <a
                [routerLink]="['/changelog', entry.slug]"
                class="self-start text-sm font-medium underline underline-offset-4 hover:no-underline"
              >
                Read more
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ChangelogListComponent implements OnInit {
  private contentService = inject(ContentService);
  private metaService = inject(MetaService);

  protected readonly entries: ChangelogEntry[] = this.contentService.getChangelogs();

  ngOnInit() {
    this.metaService.setPage('Changelog', 'Track what is new in NgCoreKit.');
  }
}
