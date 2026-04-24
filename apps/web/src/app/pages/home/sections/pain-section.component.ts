import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule, X, Check } from 'lucide-angular';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pain-section',
  imports: [LucideAngularModule],
  template: `
    <section class="py-20">
      <div class="mx-auto max-w-6xl px-4">
        <div class="flex flex-col items-center gap-4 text-center">
          <h2 class="text-3xl font-bold">Stop rebuilding the same boilerplate</h2>
          <p class="max-w-xl text-muted-foreground">
            Every SaaS starts with the same scaffolding. NgCoreKit handles it so you can focus on your core product.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Pain points -->
          <div class="flex flex-col gap-4 rounded-lg border bg-card p-6">
            <p class="font-semibold text-destructive">Without NgCoreKit</p>
            <div class="flex flex-col gap-3">
              @for (pain of pains; track pain) {
                <div class="flex items-start gap-3">
                  <lucide-icon [img]="xIcon" class="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p class="text-sm text-muted-foreground">{{ pain }}</p>
                </div>
              }
            </div>
          </div>

          <!-- Solutions -->
          <div class="flex flex-col gap-4 rounded-lg border bg-card p-6">
            <p class="font-semibold text-green-600">With NgCoreKit</p>
            <div class="flex flex-col gap-3">
              @for (solution of solutions; track solution) {
                <div class="flex items-start gap-3">
                  <lucide-icon [img]="checkIcon" class="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <p class="text-sm text-muted-foreground">{{ solution }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PainSectionComponent {
  protected readonly xIcon = X;
  protected readonly checkIcon = Check;

  protected readonly pains = [
    'Spend weeks building authentication and session management from scratch',
    'Design and implement multi-tenant data isolation for every query',
    'Wire up Stripe webhooks, handle edge cases, and test billing flows',
  ];

  protected readonly solutions = [
    'Ship with Better Auth already configured — email, OAuth, magic links, and org sessions',
    'Organization-scoped routes and guards handle tenancy for you out of the box',
    'Stripe checkout, subscriptions, and webhooks are pre-integrated and tested',
  ];
}
