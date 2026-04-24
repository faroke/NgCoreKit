import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { OrgContextStore } from "../../core/stores/org-context.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-org-switcher",
  imports: [RouterLink],
  template: `
    <div class="space-y-1">
      <p class="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Organizations
      </p>

      @for (org of orgStore.orgs(); track org.id) {
        <button
          class="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          [class.bg-accent]="org.id === orgStore.activeOrg()?.id"
          (click)="switchOrg(org.slug)"
        >
          <div class="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-semibold shrink-0">
            {{ org.name[0]?.toUpperCase() }}
          </div>
          <span class="truncate">{{ org.name }}</span>
          @if (org.id === orgStore.activeOrg()?.id) {
            <span class="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></span>
          }
        </button>
      }

      <a
        routerLink="/orgs/new"
        class="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <div class="flex h-6 w-6 items-center justify-center rounded border border-dashed text-xs">+</div>
        New organization
      </a>
    </div>
  `,
})
export class OrgSwitcherComponent {
  protected orgStore = inject(OrgContextStore);
  private router = inject(Router);

  switchOrg(slug: string) {
    void this.router.navigate(["/orgs", slug, "dashboard"]);
  }
}
