import { Injectable } from '@angular/core';
import { POSTS } from '../content/posts.data';
import { DOCS } from '../content/docs.data';
import { CHANGELOGS } from '../content/changelog.data';
import type { Post, Doc, ChangelogEntry } from '../content/content.types';

@Injectable({ providedIn: 'root' })
export class ContentService {
  getPosts(): Post[] {
    return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  }

  getPost(slug: string): Post | undefined {
    return POSTS.find((p) => p.slug === slug);
  }

  getPostsByCategory(category: string): Post[] {
    return this.getPosts().filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  getDocs(): Doc[] {
    return [...DOCS].sort((a, b) => a.order - b.order);
  }

  getDoc(slug: string): Doc | undefined {
    return DOCS.find((d) => d.slug === slug);
  }

  getChangelogs(): ChangelogEntry[] {
    return [...CHANGELOGS].sort((a, b) => b.date.localeCompare(a.date));
  }

  getChangelog(slug: string): ChangelogEntry | undefined {
    return CHANGELOGS.find((c) => c.slug === slug);
  }
}
