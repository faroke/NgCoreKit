import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { injectQuery, injectQueryClient } from "@tanstack/angular-query-experimental";
import { AdminService } from "../../../core/services/admin.service";
import { AuthStore } from "../../../core/auth/auth.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-user-detail",
  imports: [RouterLink, DatePipe],
  template: `
    <div class="flex flex-col gap-6 p-6 max-w-2xl">
      <div class="flex items-center gap-3">
        <a routerLink="/admin/users" class="text-sm text-muted-foreground hover:text-foreground">
          Users
        </a>
        <span class="text-muted-foreground">/</span>
        <span class="text-sm font-medium">Detail</span>
      </div>

      @if (userQuery.isPending()) {
        <p class="text-sm text-muted-foreground">Loading…</p>
      } @else if (userQuery.isError()) {
        <p class="text-sm text-destructive">Failed to load user.</p>
      } @else {
        @let user = userQuery.data()?.data;
        @if (user) {
          <div class="rounded-lg border p-5 flex flex-col gap-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex flex-col gap-1">
                <h1 class="text-lg font-semibold">{{ user.name }}</h1>
                <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                <p class="text-xs text-muted-foreground">
                  Role: <span class="font-medium">{{ user.role ?? 'user' }}</span>
                  &nbsp;&bull;&nbsp; Orgs: <span class="font-medium">{{ user._count.members }}</span>
                </p>
                <p class="text-xs text-muted-foreground">
                  Joined {{ user.createdAt | date:'mediumDate' }}
                </p>
                @if (user.banned) {
                  <p class="text-xs text-destructive font-medium">
                    Banned{{ user.banReason ? ': ' + user.banReason : '' }}
                  </p>
                }
              </div>

              <div class="flex flex-col gap-2 shrink-0">
                <button
                  class="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                  [disabled]="isLoading()"
                  (click)="impersonate(user.id)"
                >
                  {{ isLoading() ? 'Loading…' : 'Impersonate' }}
                </button>
                <button
                  class="rounded-md border border-destructive/50 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  [disabled]="isLoading()"
                  (click)="deleteUser(user.id)"
                >
                  Delete user
                </button>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class AdminUserDetailComponent {
  readonly userId = input<string>("");

  private adminService = inject(AdminService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private queryClient = injectQueryClient();

  protected isLoading = signal(false);

  userQuery = injectQuery(() => ({
    queryKey: ["admin", "user", this.userId()],
    queryFn: () => this.adminService.getUser(this.userId()),
    enabled: !!this.userId(),
  }));

  async impersonate(id: string) {
    this.isLoading.set(true);
    try {
      await this.adminService.impersonateUser(id);
      await this.authStore.loadSession();
      await this.router.navigate(["/orgs"]);
    } catch {
      this.isLoading.set(false);
    }
  }

  async deleteUser(id: string) {
    if (!confirm("Delete this user permanently?")) return;
    this.isLoading.set(true);
    try {
      await this.adminService.deleteUser(id);
      await this.queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      await this.router.navigate(["/admin/users"]);
    } catch {
      this.isLoading.set(false);
    }
  }
}
