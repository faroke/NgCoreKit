import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule, ShieldCheck, Building2, CreditCard, LayoutDashboard, Layers, Code2 } from 'lucide-angular';

type Feature = {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-features-section',
  imports: [LucideAngularModule],
  template: `
    <section class="py-20">
      <div class="mx-auto max-w-6xl px-4">
        <div class="flex flex-col items-center gap-4 text-center">
          <h2 class="text-3xl font-bold">Everything you need</h2>
          <p class="max-w-xl text-muted-foreground">
            Stop rebuilding the same infrastructure. NgCoreKit ships with every layer your SaaS needs.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (feature of features; track feature.title) {
            <div class="flex flex-col gap-3 rounded-lg border bg-card p-6">
              <div class="flex h-10 w-10 items-center justify-center rounded-md border bg-background">
                <lucide-icon [img]="feature.icon" class="h-5 w-5 text-muted-foreground" />
              </div>
              <p class="font-semibold">{{ feature.title }}</p>
              <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class FeaturesSectionComponent {
  protected readonly features: Feature[] = [
    {
      icon: ShieldCheck,
      title: 'Authentication',
      description: 'Email/password, magic links, and OAuth out of the box with Better Auth. Session management via NgRx SignalStore.',
    },
    {
      icon: Building2,
      title: 'Multi-tenant',
      description: 'Organization-scoped routes, role-based access control, and member management from day one.',
    },
    {
      icon: CreditCard,
      title: 'Billing',
      description: 'Full Stripe integration with checkout sessions, subscription management, webhooks, and customer portal.',
    },
    {
      icon: LayoutDashboard,
      title: 'Admin Panel',
      description: 'Platform admin dashboard with user management, org oversight, feedback tracking, and user impersonation.',
    },
    {
      icon: Layers,
      title: 'API-first',
      description: 'NestJS REST API with Prisma ORM, global auth guard, Swagger docs, and structured error handling.',
    },
    {
      icon: Code2,
      title: 'Type-safe',
      description: 'Shared types package, strict TypeScript throughout, and validated DTOs with class-validator.',
    },
  ];
}
