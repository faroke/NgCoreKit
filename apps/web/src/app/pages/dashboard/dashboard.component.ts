import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { OrgContextStore } from "../../core/stores/org-context.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-dashboard",
  template: `
    <div class="p-6">
      @if (orgStore.activeOrg(); as org) {
        <h1 class="text-2xl font-semibold">{{ org.name }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">Welcome to your dashboard</p>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-lg border bg-card p-4">
            <p class="text-sm text-muted-foreground">Your role</p>
            <p class="mt-1 text-xl font-semibold capitalize">{{ org.role }}</p>
          </div>
          <div class="rounded-lg border bg-card p-4">
            <p class="text-sm text-muted-foreground">Organization</p>
            <p class="mt-1 text-xl font-semibold">{{ org.slug }}</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent {
  protected orgStore = inject(OrgContextStore);
}
