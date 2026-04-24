import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { DatePipe, CurrencyPipe, UpperCasePipe } from "@angular/common";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { OrgContextStore } from "../../../core/stores/org-context.store";
import { BillingService } from "../../../core/services/billing.service";
import { PlansComponent } from "./plans.component";
import type { CreateCheckoutRequest } from "@ngcorekit/types";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-billing",
  imports: [DatePipe, CurrencyPipe, UpperCasePipe, PlansComponent],
  template: `
    <div class="flex flex-col gap-8 p-6 max-w-4xl">
      <h2 class="text-xl font-semibold">Billing</h2>

      <!-- Current subscription card -->
      @if (subscriptionQuery.isPending()) {
        <p class="text-sm text-muted-foreground">Loading subscription…</p>
      } @else if (subscriptionQuery.isError()) {
        <p class="text-sm text-destructive">Failed to load subscription.</p>
      } @else {
        @let sub = subscriptionQuery.data()?.data ?? null;
        <div class="rounded-lg border p-5 flex flex-col gap-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium text-muted-foreground">Current plan</p>
              <p class="text-lg font-semibold capitalize">{{ sub?.plan ?? 'free' }}</p>
              @if (sub && sub.status) {
                <p class="text-xs text-muted-foreground capitalize">
                  Status: {{ sub.status }}
                  @if (sub.cancelAtPeriodEnd) {
                    &mdash; cancels {{ sub.periodEnd | date:'mediumDate' }}
                  }
                </p>
              }
            </div>

            @if (sub && sub.plan !== 'free') {
              <div class="flex gap-2">
                <button
                  (click)="openPortal()"
                  [disabled]="isLoading()"
                  class="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {{ isLoading() ? 'Loading…' : 'Manage billing' }}
                </button>
              </div>
            }
          </div>

          @if (sub && sub.periodEnd) {
            <p class="text-xs text-muted-foreground">
              Next billing date: {{ sub.periodEnd | date:'mediumDate' }}
            </p>
          }
        </div>
      }

      <!-- Plan cards -->
      <div class="flex flex-col gap-3">
        <h3 class="text-sm font-semibold">Plans</h3>
        <app-billing-plans
          [orgSlug]="orgSlug()"
          [currentPlan]="currentPlan()"
          (planSelected)="onPlanSelected($event)"
        />
      </div>

      <!-- Invoices -->
      @if (invoicesQuery.data()?.data?.length) {
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-semibold">Invoices</h3>
          <div class="rounded-lg border overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-muted/50">
                <tr>
                  <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Invoice</th>
                  <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th class="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Amount</th>
                  <th class="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                @for (invoice of invoicesQuery.data()?.data ?? []; track invoice.id) {
                  <tr class="border-t">
                    <td class="px-4 py-3 text-xs">{{ invoice.periodStart | date:'mediumDate' }}</td>
                    <td class="px-4 py-3 text-xs font-mono text-muted-foreground">{{ invoice.number ?? invoice.id }}</td>
                    <td class="px-4 py-3 text-xs capitalize">{{ invoice.status }}</td>
                    <td class="px-4 py-3 text-xs text-right">
                      {{ invoice.amountPaid / 100 | currency:(invoice.currency | uppercase) }}
                    </td>
                    <td class="px-4 py-3 text-xs text-right">
                      @if (invoice.hostedInvoiceUrl) {
                        <a
                          [href]="invoice.hostedInvoiceUrl"
                          target="_blank"
                          rel="noopener"
                          class="text-primary hover:underline"
                        >
                          View
                        </a>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class BillingComponent {
  private orgStore = inject(OrgContextStore);
  private billingService = inject(BillingService);

  protected orgSlug = computed(() => this.orgStore.activeOrg()?.slug ?? "");
  protected isLoading = signal(false);

  protected currentPlan = computed(
    () => this.subscriptionQuery.data()?.data?.plan ?? "free",
  );

  subscriptionQuery = injectQuery(() => ({
    queryKey: ["billing", "subscription", this.orgSlug()],
    queryFn: () => this.billingService.getSubscription(this.orgSlug()),
    enabled: !!this.orgSlug(),
  }));

  invoicesQuery = injectQuery(() => ({
    queryKey: ["billing", "invoices", this.orgSlug()],
    queryFn: () => this.billingService.getInvoices(this.orgSlug()),
    enabled: !!this.orgSlug(),
  }));

  async onPlanSelected(req: CreateCheckoutRequest) {
    this.isLoading.set(true);
    try {
      const { url } = await this.billingService.createCheckout(this.orgSlug(), req);
      window.location.href = url;
    } catch {
      this.isLoading.set(false);
    }
  }

  async openPortal() {
    this.isLoading.set(true);
    try {
      const { url } = await this.billingService.createPortal(this.orgSlug());
      window.location.href = url;
    } catch {
      this.isLoading.set(false);
    }
  }
}
