import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

type FaqItem = {
  question: string;
  answer: string;
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-faq-section',
  imports: [LucideAngularModule],
  template: `
    <section class="py-20">
      <div class="mx-auto max-w-3xl px-4">
        <div class="flex flex-col items-center gap-4 text-center">
          <h2 class="text-3xl font-bold">Frequently asked questions</h2>
          <p class="text-muted-foreground">
            Everything you need to know about NgCoreKit.
          </p>
        </div>

        <div class="mt-10 flex flex-col divide-y">
          @for (item of faqs; track item.question; let i = $index) {
            <div class="py-4">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 text-left"
                (click)="toggle(i)"
              >
                <span class="font-medium">{{ item.question }}</span>
                <lucide-icon
                  [img]="chevronIcon"
                  class="h-4 w-4 shrink-0 text-muted-foreground transition-transform"
                  [class.rotate-180]="openIndex() === i"
                />
              </button>
              @if (openIndex() === i) {
                <p class="mt-3 text-sm text-muted-foreground">{{ item.answer }}</p>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class FaqSectionComponent {
  protected readonly chevronIcon = ChevronDown;
  protected readonly openIndex = signal<number | null>(null);

  protected readonly faqs: FaqItem[] = [
    {
      question: 'Is NgCoreKit free to use?',
      answer: 'Yes. NgCoreKit is open-source and free to use for personal and commercial projects. You only pay for the infrastructure you choose to use, like Stripe or your PostgreSQL host.',
    },
    {
      question: 'What database does NgCoreKit use?',
      answer: 'NgCoreKit uses PostgreSQL with Prisma ORM. A Docker Compose file is included so you can spin up a local database with a single command. Any PostgreSQL-compatible database will work in production.',
    },
    {
      question: 'Can I use NgCoreKit without Stripe?',
      answer: 'Absolutely. The billing module is entirely optional. If you do not need paid subscriptions, you can simply not configure Stripe environment variables and the billing routes will be inactive.',
    },
    {
      question: 'Does NgCoreKit support SSO?',
      answer: 'The Team plan includes SSO/SAML support. For open-source use, you can configure OAuth providers (Google, GitHub) through Better Auth without any additional cost.',
    },
    {
      question: 'How does multi-tenancy work?',
      answer: 'Every user can belong to one or more organizations. Routes are scoped to the active organization via /orgs/:orgSlug. The OrgGuard validates membership and attaches the organization context to every request.',
    },
    {
      question: 'Can I deploy NgCoreKit to Vercel or Railway?',
      answer: 'Yes. The NestJS API can be deployed to any Node.js host, including Railway, Render, or a VPS. The Angular app builds to a static bundle that can be deployed to Vercel, Netlify, or any static host.',
    },
  ];

  toggle(index: number) {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
