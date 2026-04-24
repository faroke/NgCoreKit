import { ChangeDetectionStrategy, Component, inject, input, output, signal } from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { BillingService } from "../../../core/services/billing.service";
import type { BillingPlanPublic, CreateCheckoutRequest } from "@ngcorekit/types";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-billing-plans",
  template: `
    <div class="flex flex-col gap-6">
      <!-- Interval toggle -->
      <div class="flex items-center gap-2 self-start rounded-lg border p-1">
        <button
          (click)="interval.set('monthly')"
          [class.bg-background]="interval() === 'monthly'"
          [class.shadow-sm]="interval() === 'monthly'"
          class="rounded-md px-3 py-1.5 text-sm font-medium transition-all"
        >
          Monthly
        </button>
        <button
          (click)="interval.set('yearly')"
          [class.bg-background]="interval() === 'yearly'"
          [class.shadow-sm]="interval() === 'yearly'"
          class="rounded-md px-3 py-1.5 text-sm font-medium transition-all"
        >
          Yearly
          <span class="ml-1 text-xs text-green-600 font-medium">Save ~20%</span>
        </button>
      </div>

      @if (plansQuery.isPending()) {
        <p class="text-sm text-muted-foreground">Loading plans…</p>
      } @else if (plansQuery.isError()) {
        <p class="text-sm text-destructive">Failed to load plans.</p>
      } @else {
        <div class="grid gap-4 sm:grid-cols-3">
          @for (plan of plansQuery.data()?.data ?? []; track plan.name) {
            <div
              class="relative flex flex-col gap-4 rounded-lg border p-5"
              [class.border-primary]="plan.isPopular"
              [class.shadow-md]="plan.isPopular"
            >
              @if (plan.isPopular) {
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  Popular
                </span>
              }

              <div class="flex flex-col gap-1">
                <h3 class="text-sm font-semibold capitalize">{{ plan.name }}</h3>
                <p class="text-xs text-muted-foreground">{{ plan.description }}</p>
              </div>

              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-bold">
                  \${{ interval() === 'yearly' ? plan.yearlyPrice : plan.price }}
                </span>
                <span class="text-xs text-muted-foreground">
                  / {{ interval() === 'yearly' ? 'year' : 'month' }}
                </span>
              </div>

              <ul class="flex flex-col gap-1.5 text-xs text-muted-foreground">
                <li>{{ plan.limits.projects }} projects</li>
                <li>{{ plan.limits.storage }} GB storage</li>
                <li>{{ plan.limits.members }} members</li>
              </ul>

              @if (plan.name === 'free') {
                <!-- Free plan: no button shown when it's current, no upgrade from paid to free -->
                @if (currentPlan() !== 'free') {
                  <!-- already on paid plan, don't show free button -->
                } @else {
                  <button disabled class="mt-auto rounded-md border px-3 py-1.5 text-sm opacity-50 cursor-not-allowed">
                    Current plan
                  </button>
                }
              } @else {
                @if (currentPlan() === plan.name) {
                  <button disabled class="mt-auto rounded-md border px-3 py-1.5 text-sm opacity-50 cursor-not-allowed">
                    Current plan
                  </button>
                } @else {
                  <button
                    (click)="select(plan)"
                    class="mt-auto rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Upgrade to {{ plan.name | titlecase }}
                  </button>
                }
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  imports: [TitleCasePipe],
})
export class PlansComponent {
  orgSlug = input('');
  currentPlan = input<string | null>(null);
  planSelected = output<CreateCheckoutRequest>();

  protected interval = signal<"monthly" | "yearly">("monthly");

  private billingService = inject(BillingService);

  plansQuery = injectQuery(() => ({
    queryKey: ["billing", "plans", this.orgSlug()],
    queryFn: () => this.billingService.getPlans(this.orgSlug()),
    enabled: !!this.orgSlug(),
  }));

  select(plan: BillingPlanPublic) {
    this.planSelected.emit({ plan: plan.name as "pro" | "ultra", interval: this.interval() });
  }
}
