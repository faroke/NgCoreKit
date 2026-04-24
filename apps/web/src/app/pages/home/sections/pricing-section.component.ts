import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Check } from 'lucide-angular';

type PricingTier = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
  highlighted: boolean;
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pricing-section',
  imports: [RouterLink, LucideAngularModule],
  template: `
    <section class="py-20" id="pricing">
      <div class="mx-auto max-w-6xl px-4">
        <div class="flex flex-col items-center gap-4 text-center">
          <h2 class="text-3xl font-bold">Simple, transparent pricing</h2>
          <p class="max-w-xl text-muted-foreground">
            Start for free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          @for (tier of tiers; track tier.name) {
            <div
              class="flex flex-col gap-6 rounded-lg border p-6"
              [class.bg-primary]="tier.highlighted"
              [class.text-primary-foreground]="tier.highlighted"
              [class.bg-card]="!tier.highlighted"
            >
              <div class="flex flex-col gap-1">
                <p class="font-semibold">{{ tier.name }}</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-3xl font-bold">{{ tier.price }}</span>
                  <span
                    class="text-sm"
                    [class.text-primary-foreground/70]="tier.highlighted"
                    [class.text-muted-foreground]="!tier.highlighted"
                  >{{ tier.period }}</span>
                </div>
                <p
                  class="text-sm"
                  [class.text-primary-foreground/80]="tier.highlighted"
                  [class.text-muted-foreground]="!tier.highlighted"
                >{{ tier.description }}</p>
              </div>

              <ul class="flex flex-col gap-2">
                @for (feature of tier.features; track feature) {
                  <li class="flex items-center gap-2 text-sm">
                    <lucide-icon
                      [img]="checkIcon"
                      class="h-4 w-4 shrink-0"
                      [class.text-primary-foreground]="tier.highlighted"
                      [class.text-muted-foreground]="!tier.highlighted"
                    />
                    {{ feature }}
                  </li>
                }
              </ul>

              <a
                [routerLink]="tier.ctaLink"
                class="mt-auto rounded-md px-4 py-2 text-center text-sm font-medium transition-colors"
                [class.bg-background]="tier.highlighted"
                [class.text-primary]="tier.highlighted"
                [class.hover:bg-background/90]="tier.highlighted"
                [class.bg-primary]="!tier.highlighted"
                [class.text-primary-foreground]="!tier.highlighted"
                [class.hover:bg-primary/90]="!tier.highlighted"
              >
                {{ tier.ctaLabel }}
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PricingSectionComponent {
  protected readonly checkIcon = Check;

  protected readonly tiers: PricingTier[] = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for side projects and early validation.',
      features: [
        '1 organization',
        'Up to 3 team members',
        'Core auth features',
        'Community support',
      ],
      ctaLabel: 'Get started free',
      ctaLink: '/sign-up',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For growing teams shipping real products.',
      features: [
        'Unlimited organizations',
        'Up to 20 team members',
        'Stripe billing',
        'Priority support',
        'Advanced analytics',
      ],
      ctaLabel: 'Start free trial',
      ctaLink: '/sign-up',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$99',
      period: '/month',
      description: 'For larger teams with advanced needs.',
      features: [
        'Unlimited everything',
        'Custom roles and permissions',
        'SSO / SAML',
        'Dedicated support',
        'SLA guarantee',
      ],
      ctaLabel: 'Contact us',
      ctaLink: '/contact',
      highlighted: false,
    },
  ];
}
