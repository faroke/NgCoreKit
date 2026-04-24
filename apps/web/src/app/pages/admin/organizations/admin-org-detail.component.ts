import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { injectQuery, injectQueryClient } from "@tanstack/angular-query-experimental";
import { AdminService } from "../../../core/services/admin.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-org-detail",
  imports: [RouterLink, DatePipe],
  template: `
    <div class="flex flex-col gap-6 p-6 max-w-3xl">
      <div class="flex items-center gap-3">
        <a routerLink="/admin/organizations" class="text-sm text-muted-foreground hover:text-foreground">
          Organizations
        </a>
        <span class="text-muted-foreground">/</span>
        <span class="text-sm font-medium">Detail</span>
      </div>

      @if (orgQuery.isPending()) {
        <p class="text-sm text-muted-foreground">Loading…</p>
      } @else if (orgQuery.isError()) {
        <p class="text-sm text-destructive">Failed to load organization.</p>
      } @else {
        @let org = orgQuery.data()?.data;
        @if (org) {
          <!-- Org info card -->
          <div class="rounded-lg border p-5 flex flex-col gap-3">
            <div class="flex items-start justify-between gap-4">
              <div class="flex flex-col gap-1">
                <h1 class="text-lg font-semibold">{{ org.name }}</h1>
                <p class="text-xs text-muted-foreground font-mono">{{ org.slug }}</p>
                <p class="text-xs text-muted-foreground">
                  Plan: <span class="font-medium capitalize">{{ org.subscription?.plan ?? 'free' }}</span>
                  @if (org.subscription?.status) {
                    &nbsp;&bull;&nbsp; Status: <span class="font-medium">{{ org.subscription?.status }}</span>
                  }
                </p>
                <p class="text-xs text-muted-foreground">Created {{ org.createdAt | date:'mediumDate' }}</p>
              </div>
            </div>

            @if (org.subscription?.periodEnd) {
              <p class="text-xs text-muted-foreground">
                Period ends {{ org.subscription?.periodEnd | date:'mediumDate' }}
              </p>
            }
          </div>

          <!-- Members table -->
          <div class="flex flex-col gap-3">
            <h2 class="text-sm font-semibold">Members ({{ org.members.length }})</h2>
            <div class="rounded-lg border overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-muted/50">
                  <tr>
                    <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Name</th>
                    <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Email</th>
                    <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Role</th>
                    <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Joined</th>
                    <th class="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (member of org.members; track member.id) {
                    <tr class="border-t">
                      <td class="px-4 py-3 text-xs font-medium">{{ member.user.name }}</td>
                      <td class="px-4 py-3 text-xs text-muted-foreground">{{ member.user.email }}</td>
                      <td class="px-4 py-3 text-xs capitalize">{{ member.role }}</td>
                      <td class="px-4 py-3 text-xs text-muted-foreground">{{ member.createdAt | date:'mediumDate' }}</td>
                      <td class="px-4 py-3 text-xs text-right">
                        @if (member.role !== 'owner') {
                          <button
                            class="text-destructive hover:underline"
                            (click)="removeMember(org.id, member.id)"
                          >
                            Remove
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class AdminOrgDetailComponent {
  readonly orgId = input<string>("");

  private adminService = inject(AdminService);
  private queryClient = injectQueryClient();

  orgQuery = injectQuery(() => ({
    queryKey: ["admin", "org", this.orgId()],
    queryFn: () => this.adminService.getOrg(this.orgId()),
    enabled: !!this.orgId(),
  }));

  async removeMember(orgId: string, memberId: string) {
    if (!confirm("Remove this member from the organization?")) return;
    try {
      await this.adminService.removeOrgMember(orgId, memberId);
      await this.queryClient.invalidateQueries({ queryKey: ["admin", "org", orgId] });
    } catch {
      // error handled silently — query will not refetch on failure
    }
  }
}
