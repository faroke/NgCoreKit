import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { AdminService } from "../../../core/services/admin.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-dashboard",
  template: `
    <div class="flex flex-col gap-6 p-6">
      <h1 class="text-xl font-semibold">Dashboard</h1>

      @if (statsQuery.isPending()) {
        <p class="text-sm text-muted-foreground">Loading stats…</p>
      } @else if (statsQuery.isError()) {
        <p class="text-sm text-destructive">Failed to load stats.</p>
      } @else {
        @let stats = statsQuery.data()?.data;
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div class="rounded-lg border p-4 flex flex-col gap-1">
            <p class="text-xs text-muted-foreground">Total users</p>
            <p class="text-2xl font-bold">{{ stats?.userCount ?? 0 }}</p>
          </div>
          <div class="rounded-lg border p-4 flex flex-col gap-1">
            <p class="text-xs text-muted-foreground">Organizations</p>
            <p class="text-2xl font-bold">{{ stats?.orgCount ?? 0 }}</p>
          </div>
          <div class="rounded-lg border p-4 flex flex-col gap-1">
            <p class="text-xs text-muted-foreground">Active subscriptions</p>
            <p class="text-2xl font-bold">{{ stats?.activeSubscriptions ?? 0 }}</p>
          </div>
          <div class="rounded-lg border p-4 flex flex-col gap-1">
            <p class="text-xs text-muted-foreground">MRR</p>
            <p class="text-2xl font-bold">\${{ stats?.mrr ?? 0 }}</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent {
  private adminService = inject(AdminService);

  statsQuery = injectQuery(() => ({
    queryKey: ["admin", "stats"],
    queryFn: () => this.adminService.getStats(),
  }));
}
