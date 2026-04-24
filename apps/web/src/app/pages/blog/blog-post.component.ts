import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { MetaService } from '../../core/services/meta.service';
import type { Post } from '../../core/content/content.types';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-post',
  imports: [RouterLink],
  template: `
    @if (post()) {
      <article class="mx-auto max-w-3xl px-4 py-16">
        <a routerLink="/posts" class="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to blog
        </a>

        <header class="mt-6 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="rounded-full border px-2.5 py-0.5 text-xs font-medium">
              {{ post()!.category }}
            </span>
            <span class="text-xs text-muted-foreground">{{ post()!.date }}</span>
            <span class="text-xs text-muted-foreground">{{ post()!.readingTime }} min read</span>
          </div>
          <h1 class="text-4xl font-bold">{{ post()!.title }}</h1>
          <p class="text-lg text-muted-foreground">{{ post()!.description }}</p>
        </header>

        <div
          class="prose prose-neutral mt-10 max-w-none dark:prose-invert"
          [innerHTML]="safeContent()"
        ></div>
      </article>
    } @else {
      <div class="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 class="text-2xl font-bold">Post not found</h1>
        <p class="mt-2 text-muted-foreground">The post you are looking for does not exist.</p>
        <a routerLink="/posts" class="mt-4 inline-block text-sm underline underline-offset-4">
          Back to blog
        </a>
      </div>
    }
  `,
})
export class BlogPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private metaService = inject(MetaService);
  private sanitizer = inject(DomSanitizer);

  protected readonly post = signal<Post | undefined>(undefined);
  protected readonly safeContent = signal<SafeHtml>('');

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = this.contentService.getPost(slug);
    this.post.set(found);
    if (found) {
      this.safeContent.set(this.sanitizer.bypassSecurityTrustHtml(found.content));
      this.metaService.setPost(found.title, found.description, found.date);
    } else {
      this.metaService.setPage('Post not found');
    }
  }
}
