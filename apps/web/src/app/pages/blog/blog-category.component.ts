import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { MetaService } from '../../core/services/meta.service';
import type { Post } from '../../core/content/content.types';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-category',
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-16">
      <a routerLink="/posts" class="text-sm text-muted-foreground hover:text-foreground">
        &larr; All posts
      </a>

      <div class="mt-6 flex flex-col gap-2">
        <h1 class="text-3xl font-bold">{{ category() }}</h1>
        <p class="text-muted-foreground">{{ posts().length }} post{{ posts().length === 1 ? '' : 's' }}</p>
      </div>

      @if (posts().length === 0) {
        <p class="mt-10 text-muted-foreground">No posts in this category.</p>
      } @else {
        <div class="mt-10 flex flex-col gap-8">
          @for (post of posts(); track post.slug) {
            <article class="flex flex-col gap-3 border-b pb-8">
              <div class="flex items-center gap-2">
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
      }
    </div>
  `,
})
export class BlogCategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private metaService = inject(MetaService);

  protected readonly category = signal('');
  protected readonly posts = signal<Post[]>([]);

  ngOnInit() {
    const cat = this.route.snapshot.paramMap.get('category') ?? '';
    this.category.set(cat);
    this.posts.set(this.contentService.getPostsByCategory(cat));
    this.metaService.setPage(`${cat} posts`);
  }
}
