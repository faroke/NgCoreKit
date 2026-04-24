import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MetaService {
  private title = inject(Title);
  private meta = inject(Meta);

  setPage(title: string, description?: string) {
    this.title.setTitle(`${title} — NgCoreKit`);
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    }
  }

  setPost(title: string, description: string, date: string) {
    this.setPage(title, description);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'article:published_time', content: date });
  }
}
