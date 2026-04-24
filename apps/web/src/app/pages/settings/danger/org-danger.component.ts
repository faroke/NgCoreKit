import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { authClient } from "../../../core/auth/auth.client";
import { OrgContextStore } from "../../../core/stores/org-context.store";
import { DialogManagerStore } from "../../../features/dialog-manager/dialog-manager.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-org-danger",
  template: `
    <div class="p-6 max-w-xl space-y-6">
      <h2 class="text-xl font-semibold">Danger zone</h2>

      <div class="rounded-lg border border-destructive/50 p-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-sm font-medium">Delete this organization</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              Permanently delete this organization and all its data. This action cannot be undone.
            </p>
          </div>
          <button
            class="shrink-0 rounded-md border border-destructive px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            (click)="confirmDelete()"
            [disabled]="orgStore.activeOrg()?.role !== 'owner'"
          >
            Delete
          </button>
        </div>
        @if (orgStore.activeOrg()?.role !== 'owner') {
          <p class="mt-2 text-xs text-muted-foreground">Only the owner can delete this organization.</p>
        }
      </div>
    </div>
  `,
})
export class OrgDangerComponent {
  protected orgStore = inject(OrgContextStore);
  private dialogStore = inject(DialogManagerStore);
  private router = inject(Router);

  confirmDelete() {
    const org = this.orgStore.activeOrg();
    if (!org) return;

    this.dialogStore.confirm({
      title: "Delete organization",
      description: `Are you sure you want to delete "${org.name}"? This action is permanent and cannot be undone.`,
      variant: "destructive",
      confirmLabel: "Delete organization",
      onConfirm: async () => {
        await authClient.organization.delete({ organizationId: org.id });
        this.orgStore.removeOrg(org.id);
        await this.router.navigate(["/orgs"]);
      },
    });
  }
}
