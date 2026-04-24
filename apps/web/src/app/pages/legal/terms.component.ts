import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MetaService } from '../../core/services/meta.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-terms',
  template: `
    <div class="mx-auto max-w-3xl px-4 py-16">
      <h1 class="text-3xl font-bold">Terms of Service</h1>
      <p class="mt-2 text-sm text-muted-foreground">Last updated: April 23, 2026</p>

      <div class="mt-8 flex flex-col gap-6 text-muted-foreground">
        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using NgCoreKit, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">2. Use of Services</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the security of your account credentials.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">3. Intellectual Property</h2>
          <p>The NgCoreKit boilerplate is open-source software. Your application code and business logic remain your intellectual property. Contributions to the upstream project are subject to the project's license.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">4. Limitation of Liability</h2>
          <p>NgCoreKit is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the software.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">5. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the services after changes constitutes acceptance of the updated terms.</p>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold text-foreground">6. Contact</h2>
          <p>For questions about these Terms, contact us at legal&#64;ngcorekit.dev.</p>
        </section>
      </div>
    </div>
  `,
})
export class TermsComponent implements OnInit {
  private metaService = inject(MetaService);

  ngOnInit() {
    this.metaService.setPage('Terms of Service');
  }
}
