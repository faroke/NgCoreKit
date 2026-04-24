import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { AdminService } from "../../../core/services/admin.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-users-list",
  imports: [DatePipe],
  template: `
    <div class="flex flex-col gap-4 p-6">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-xl font-semibold">Users</h1>
        <input
          type="search"
          placeholder="Search users…"
          class="rounded-md border px-3 py-1.5 text-sm w-64 bg-background"
          [value]="search()"
          (input)="onSearch($any($event.target).value)"
        />
      </div>

      @if (usersQuery.isPending()) {
        <p class="text-sm text-muted-foreground">Loading…</p>
      } @else if (usersQuery.isError()) {
        <p class="text-sm text-destructive">Failed to load users.</p>
      } @else {
        @let result = usersQuery.data();
        <div class="rounded-lg border overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-muted/50">
              <tr>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Name</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Email</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Role</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Joined</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (user of result?.data ?? []; track user.id) {
                <tr
                  class="border-t hover:bg-muted/30 cursor-pointer transition-colors"
                  (click)="goToUser(user.id)"
                >
                  <td class="px-4 py-3 text-xs font-medium">{{ user.name }}</td>
                  <td class="px-4 py-3 text-xs text-muted-foreground">{{ user.email }}</td>
                  <td class="px-4 py-3 text-xs">{{ user.role ?? 'user' }}</td>
                  <td class="px-4 py-3 text-xs text-muted-foreground">{{ user.createdAt | date:'mediumDate' }}</td>
                  <td class="px-4 py-3 text-xs">
                    @if (user.banned) {
                      <span class="text-destructive">Banned</span>
                    } @else {
                      <span class="text-green-600">Active</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <span>{{ result?.total ?? 0 }} total</span>
          <div class="flex gap-2">
            <button
              class="rounded border px-2 py-1 hover:bg-accent transition-colors disabled:opacity-40"
              [disabled]="page() <= 1"
              (click)="setPage(page() - 1)"
            >
              Previous
            </button>
            <span class="px-2 py-1">{{ page() }} / {{ result?.totalPages ?? 1 }}</span>
            <button
              class="rounded border px-2 py-1 hover:bg-accent transition-colors disabled:opacity-40"
              [disabled]="page() >= (result?.totalPages ?? 1)"
              (click)="setPage(page() + 1)"
            >
              Next
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminUsersListComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);

  protected page = signal(1);
  protected search = signal("");
  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  usersQuery = injectQuery(() => ({
    queryKey: ["admin", "users", this.page(), this.search()],
    queryFn: () =>
      this.adminService.getUsers({ page: this.page(), search: this.search() || undefined }),
  }));

  onSearch(value: string) {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.search.set(value);
      this.page.set(1);
    }, 300);
  }

  setPage(p: number) {
    this.page.set(p);
  }

  goToUser(id: string) {
    void this.router.navigate(["/admin/users", id]);
  }
}
