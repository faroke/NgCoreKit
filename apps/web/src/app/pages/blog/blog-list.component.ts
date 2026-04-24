import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { MetaService } from '../../core/services/meta.service';
import type { Post } from '../../core/content/content.types';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-list',
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-16">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold">Blog</h1>
        <p class="text-muted-foreground">Tutorials, architecture guides, and product updates.</p>
      </div>

      <div class="mt-10 flex flex-col gap-8">
        @for (post of posts; track post.slug) {
          <article class="flex flex-col gap-3 border-b pb-8">
            <div class="flex items-center gap-2">
              <span class="rounded-full border px-2.5 py-0.5 text-xs font-medium">
                {{ post.category }}
              </span>
              <span class="text-xs text-muted-foreground">{{ post.date }}</span>
              <span class="text-xs text-muted-foreground">{{ post.readingTime }} min read</span>
            </div>
            <h2 class="text-xl font-semibold">
              <a [routerLink]="['/posts', post.slug]" class="hover:underline">
                {{ post.title }}
              </a>
            </h2>
            <p class="text-muted-foreground">{{ post.description }}</p>
            <a
              [routerLink]="['/posts', post.slug]"
              class="self-start text-sm font-medium underline underline-offset-4 hover:no-underline"
            >
              Read more
            </a>
          </article>
        }
      </div>
    </div>
  `,
})
export class BlogListComponent implements OnInit {
  private contentService = inject(ContentService);
  private metaService = inject(MetaService);

  protected readonly posts: Post[] = this.contentService.getPosts();

  ngOnInit() {
    this.metaService.setPage('Blog', 'Tutorials, architecture guides, and product updates from the NgCoreKit team.');
  }
}
