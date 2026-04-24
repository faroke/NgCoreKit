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
import type { FeedbackStatus } from "@ngcorekit/types";

const STATUS_OPTIONS: Array<{ value: FeedbackStatus | ""; label: string }> = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
];

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-feedback-list",
  imports: [DatePipe],
  template: `
    <div class="flex flex-col gap-4 p-6">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-xl font-semibold">Feedback</h1>
        <div class="flex gap-1">
          @for (opt of statusOptions; track opt.value) {
            <button
              class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              [class]="statusFilter() === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'border hover:bg-accent'"
              (click)="setStatus(opt.value)"
            >
              {{ opt.label }}
            </button>
          }
        </div>
      </div>

      @if (feedbackQuery.isPending()) {
        <p class="text-sm text-muted-foreground">Loading…</p>
      } @else if (feedbackQuery.isError()) {
        <p class="text-sm text-destructive">Failed to load feedback.</p>
      } @else {
        @let result = feedbackQuery.data();
        <div class="rounded-lg border overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-muted/50">
              <tr>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Rating</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Message</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">From</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              @for (item of result?.data ?? []; track item.id) {
                <tr
                  class="border-t hover:bg-muted/30 cursor-pointer transition-colors"
                  (click)="goToFeedback(item.id)"
                >
                  <td class="px-4 py-3 text-xs font-medium">{{ item.review }}/5</td>
                  <td class="px-4 py-3 text-xs max-w-xs">
                    <span class="line-clamp-1">{{ item.message }}</span>
                  </td>
                  <td class="px-4 py-3 text-xs text-muted-foreground">
                    {{ item.user?.email ?? item.email ?? 'Anonymous' }}
                  </td>
                  <td class="px-4 py-3 text-xs capitalize">
                    <span
                      class="rounded px-1.5 py-0.5 text-[10px] font-medium"
                      [class]="item.status === 'new'
                        ? 'bg-blue-100 text-blue-700'
                        : item.status === 'archived'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-green-100 text-green-700'"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs text-muted-foreground">{{ item.createdAt | date:'mediumDate' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

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
export class AdminFeedbackListComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);

  protected statusOptions = STATUS_OPTIONS;
  protected page = signal(1);
  protected statusFilter = signal<FeedbackStatus | "">("");

  feedbackQuery = injectQuery(() => ({
    queryKey: ["admin", "feedback", this.page(), this.statusFilter()],
    queryFn: () =>
      this.adminService.getFeedbackList({
        page: this.page(),
        status: this.statusFilter() || undefined,
      }),
  }));

  setStatus(s: FeedbackStatus | "") {
    this.statusFilter.set(s);
    this.page.set(1);
  }

  setPage(p: number) {
    this.page.set(p);
  }

  goToFeedback(id: string) {
    void this.router.navigate(["/admin/feedback", id]);
  }
}
