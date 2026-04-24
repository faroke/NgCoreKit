import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MetaService } from '../../core/services/meta.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-privacy',
  template: `
    <div class="mx-auto max-w-3xl px-4 py-16">
      <h1 class="text-3xl font-bold">Privacy Policy</h1>
      <p class="mt-2 text-sm text-muted-foreground">Last updated: April 23, 2026</p>

      <div class="mt-8 flex flex-col gap-6 text-muted-foreground">
        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, such as your name and email address. We also collect usage data automatically when you interact with our services.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, send you technical notices, and respond to your comments and questions.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">3. Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except as described in this policy or with your consent.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy&#64;ngcorekit.dev.</p>
        </section>
      </div>
    </div>
  `,
})
export class PrivacyComponent implements OnInit {
  private metaService = inject(MetaService);

  ngOnInit() {
    this.metaService.setPage('Privacy Policy');
  }
}
