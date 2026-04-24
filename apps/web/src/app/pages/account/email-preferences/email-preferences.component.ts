import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-email-preferences",
  template: `
    <div class="p-6 max-w-xl">
      <h2 class="text-xl font-semibold">Notification Preferences</h2>
      <p class="mt-1 text-sm text-muted-foreground">Choose which emails you want to receive.</p>

      <div class="mt-6 space-y-4">
        @for (pref of preferences; track pref.key) {
          <div class="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <div>
              <p class="text-sm font-medium">{{ pref.label }}</p>
              <p class="text-xs text-muted-foreground">{{ pref.description }}</p>
            </div>
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="pref.enabled()"
              (click)="pref.enabled.update((v) => !v)"
              class="relative h-5 w-9 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              [class]="pref.enabled() ? 'bg-primary' : 'bg-muted'"
            >
              <span
                class="block h-4 w-4 rounded-full bg-white shadow transition-transform absolute top-0.5"
                [class]="pref.enabled() ? 'translate-x-4' : 'translate-x-0.5'"
              ></span>
            </button>
          </div>
        }
      </div>

      <p class="mt-4 text-xs text-muted-foreground">Email delivery requires SMTP configuration (coming soon).</p>
    </div>
  `,
})
export class EmailPreferencesComponent {
  protected preferences = [
    {
      key: "product_updates",
      label: "Product updates",
      description: "New features and improvements",
      enabled: signal(true),
    },
    {
      key: "security_alerts",
      label: "Security alerts",
      description: "Sign-in attempts and account changes",
      enabled: signal(true),
    },
    {
      key: "billing",
      label: "Billing notifications",
      description: "Invoices, renewals, and payment issues",
      enabled: signal(true),
    },
    {
      key: "marketing",
      label: "Tips and tutorials",
      description: "Occasional tips to get the most out of NgCoreKit",
      enabled: signal(false),
    },
  ];
}
