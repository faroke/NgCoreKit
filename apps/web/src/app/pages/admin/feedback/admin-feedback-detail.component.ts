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
import type { FeedbackStatus } from "@ngcorekit/types";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-feedback-detail",
  imports: [RouterLink, DatePipe],
  template: `
    <div class="flex flex-col gap-6 p-6 max-w-2xl">
      <div class="flex items-center gap-3">
        <a routerLink="/admin/feedback" class="text-sm text-muted-foreground hover:text-foreground">
          Feedback
        </a>
        <span class="text-muted-foreground">/</span>
        <span class="text-sm font-medium">Detail</span>
      </div>

      @if (feedbackQuery.isPending()) {
        <p class="text-sm text-muted-foreground">Loading…</p>
      } @else if (feedbackQuery.isError()) {
        <p class="text-sm text-destructive">Failed to load feedback.</p>
      } @else {
        @let item = feedbackQuery.data()?.data;
        @if (item) {
          <div class="rounded-lg border p-5 flex flex-col gap-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex flex-col gap-2 flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold">{{ item.review }}/5</span>
                  <span
                    class="rounded px-2 py-0.5 text-xs font-medium capitalize"
                    [class]="item.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : item.status === 'archived'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-green-100 text-green-700'"
                  >
                    {{ item.status }}
                  </span>
                </div>

                <p class="text-sm leading-relaxed">{{ item.message }}</p>

                <div class="flex flex-col gap-1 text-xs text-muted-foreground">
                  @if (item.user) {
                    <p>From: {{ item.user.name }} ({{ item.user.email }})</p>
                  } @else if (item.email) {
                    <p>From: {{ item.email }}</p>
                  } @else {
                    <p>Anonymous</p>
                  }
                  <p>Submitted {{ item.createdAt | date:'medium' }}</p>
                </div>
              </div>
            </div>

            <!-- Status actions -->
            <div class="flex gap-2 pt-2 border-t">
              @for (s of statuses; track s) {
                <button
                  class="rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors disabled:opacity-50"
                  [class]="item.status === s ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'"
                  [disabled]="isUpdating() || item.status === s"
                  (click)="updateStatus(item.id, s)"
                >
                  {{ s }}
                </button>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class AdminFeedbackDetailComponent {
  readonly feedbackId = input<string>("");

  private adminService = inject(AdminService);
  private queryClient = injectQueryClient();

  protected statuses: FeedbackStatus[] = ["new", "read", "archived"];
  protected isUpdating = signal(false);

  feedbackQuery = injectQuery(() => ({
    queryKey: ["admin", "feedback", this.feedbackId()],
    queryFn: () => this.adminService.getFeedback(this.feedbackId()),
    enabled: !!this.feedbackId(),
  }));

  async updateStatus(id: string, status: FeedbackStatus) {
    this.isUpdating.set(true);
    try {
      await this.adminService.updateFeedback(id, { status });
      await this.queryClient.invalidateQueries({ queryKey: ["admin", "feedback", id] });
      await this.queryClient.invalidateQueries({ queryKey: ["admin", "feedback"] });
    } finally {
      this.isUpdating.set(false);
    }
  }
}
