import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { MetaService } from '../../core/services/meta.service';
import type { ChangelogEntry } from '../../core/content/content.types';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-changelog-detail',
  imports: [RouterLink],
  template: `
    @if (entry()) {
      <article class="mx-auto max-w-3xl px-4 py-16">
        <a routerLink="/changelog" class="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to changelog
        </a>

        <header class="mt-6 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium">
              {{ entry()!.version }}
            </span>
            <span class="text-xs text-muted-foreground">{{ entry()!.date }}</span>
          </div>
          <h1 class="text-4xl font-bold">{{ entry()!.title }}</h1>
          <p class="text-lg text-muted-foreground">{{ entry()!.summary }}</p>
        </header>

        <div
          class="prose prose-neutral mt-10 max-w-none dark:prose-invert"
          [innerHTML]="safeContent()"
        ></div>
      </article>
    } @else {
      <div class="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 class="text-2xl font-bold">Entry not found</h1>
        <p class="mt-2 text-muted-foreground">The changelog entry you are looking for does not exist.</p>
        <a routerLink="/changelog" class="mt-4 inline-block text-sm underline underline-offset-4">
          Back to changelog
        </a>
      </div>
    }
  `,
})
export class ChangelogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private metaService = inject(MetaService);
  private sanitizer = inject(DomSanitizer);

  protected readonly entry = signal<ChangelogEntry | undefined>(undefined);
  protected readonly safeContent = signal<SafeHtml>('');

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = this.contentService.getChangelog(slug);
    this.entry.set(found);
    if (found) {
      this.safeContent.set(this.sanitizer.bypassSecurityTrustHtml(found.content));
      this.metaService.setPage(`${found.version} — ${found.title}`);
    }
  }
}
