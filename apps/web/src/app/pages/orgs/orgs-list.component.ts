import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { OrgContextStore } from "../../core/stores/org-context.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-orgs-list",
  imports: [RouterLink],
  template: `
    <div class="p-8 max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold">Your organizations</h1>
        <a
          routerLink="/orgs/new"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New organization
        </a>
      </div>

      @if (orgStore.isLoading()) {
        <p class="text-sm text-muted-foreground">Loading…</p>
      } @else if (orgStore.orgs().length === 0) {
        <div class="rounded-lg border border-dashed p-8 text-center">
          <p class="text-sm text-muted-foreground">No organizations yet.</p>
          <a
            routerLink="/orgs/new"
            class="mt-3 inline-block text-sm font-medium underline underline-offset-4"
          >
            Create your first organization
          </a>
        </div>
      } @else {
        <div class="space-y-3">
          @for (org of orgStore.orgs(); track org.id) {
            <a
              [routerLink]="['/orgs', org.slug, 'dashboard']"
              class="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
                {{ org.name[0]?.toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium">{{ org.name }}</p>
                <p class="text-sm text-muted-foreground">{{ org.slug }}</p>
              </div>
              <span class="text-xs text-muted-foreground capitalize">{{ org.role }}</span>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class OrgsListComponent implements OnInit {
  protected orgStore = inject(OrgContextStore);
  private router = inject(Router);

  async ngOnInit() {
    await this.orgStore.loadOrgs();
    if (this.orgStore.orgs().length > 0) {
      const first = this.orgStore.orgs()[0]!;
      void this.router.navigate(["/orgs", first.slug, "dashboard"]);
    }
  }
}
