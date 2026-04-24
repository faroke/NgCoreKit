import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { MetaService } from '../../core/services/meta.service';
import type { Doc } from '../../core/content/content.types';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-docs-page',
  imports: [RouterLink],
  template: `
    @if (doc()) {
      <article>
        <div
          class="prose prose-neutral max-w-none dark:prose-invert"
          [innerHTML]="safeContent()"
        ></div>

        <!-- Prev / Next navigation -->
        <div class="mt-12 flex items-center justify-between border-t pt-6">
          @if (doc()!.prev) {
            <a
              [routerLink]="['/docs', doc()!.prev!.slug]"
              class="flex flex-col gap-0.5 text-sm"
            >
              <span class="text-xs text-muted-foreground">Previous</span>
              <span class="font-medium hover:underline">&larr; {{ doc()!.prev!.title }}</span>
            </a>
          } @else {
            <div></div>
          }

          @if (doc()!.next) {
            <a
              [routerLink]="['/docs', doc()!.next!.slug]"
              class="flex flex-col items-end gap-0.5 text-sm"
            >
              <span class="text-xs text-muted-foreground">Next</span>
              <span class="font-medium hover:underline">{{ doc()!.next!.title }} &rarr;</span>
            </a>
          } @else {
            <div></div>
          }
        </div>
      </article>
    } @else {
      <div class="text-center">
        <h1 class="text-2xl font-bold">Page not found</h1>
        <p class="mt-2 text-muted-foreground">The documentation page you are looking for does not exist.</p>
        <a routerLink="/docs/introduction" class="mt-4 inline-block text-sm underline underline-offset-4">
          Go to introduction
        </a>
      </div>
    }
  `,
})
export class DocsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private metaService = inject(MetaService);
  private sanitizer = inject(DomSanitizer);

  protected readonly doc = signal<Doc | undefined>(undefined);
  protected readonly safeContent = signal<SafeHtml>('');

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = this.contentService.getDoc(slug);
    this.doc.set(found);
    if (found) {
      this.safeContent.set(this.sanitizer.bypassSecurityTrustHtml(found.content));
      this.metaService.setPage(found.title);
    }
  }
}
