import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormField, form, required, email } from '@angular/forms/signals';
import { LucideAngularModule, MessageSquare, Star, X } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-feedback-popover',
  imports: [FormField, LucideAngularModule],
  template: `
    <!-- Trigger button -->
    <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <!-- Popover panel -->
      @if (isOpen()) {
        <div class="w-80 rounded-lg border bg-card shadow-lg">
          <div class="flex items-center justify-between border-b px-4 py-3">
            <p class="text-sm font-semibold">Share feedback</p>
            <button
              type="button"
              class="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              (click)="close()"
            >
              <lucide-icon [img]="xIcon" class="h-4 w-4" />
            </button>
          </div>

          @if (submitted()) {
            <div class="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <p class="font-medium">Thank you for your feedback!</p>
              <p class="text-sm text-muted-foreground">We appreciate you taking the time to share your thoughts.</p>
            </div>
          } @else {
            <form (submit)="onSubmit($event)" class="flex flex-col gap-4 p-4">
              <!-- Star rating -->
              <div class="flex flex-col gap-1.5">
                <p class="text-xs font-medium text-muted-foreground">How would you rate your experience?</p>
                <div class="flex gap-1">
                  @for (star of stars; track star) {
                    <button
                      type="button"
                      (click)="setRating(star)"
                      class="p-0.5"
                    >
                      <lucide-icon
                        [img]="starIcon"
                        class="h-6 w-6 transition-colors"
                        [class.text-yellow-400]="star <= rating()"
                        [class.fill-yellow-400]="star <= rating()"
                        [class.text-muted-foreground]="star > rating()"
                      />
                    </button>
                  }
                </div>
              </div>

              <!-- Message -->
              <div class="flex flex-col gap-1.5">
                <label for="feedback-message" class="text-xs font-medium text-muted-foreground">Message</label>
                <textarea
                  id="feedback-message"
                  [formField]="feedbackForm.message"
                  rows="3"
                  placeholder="Tell us what you think…"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                ></textarea>
                @if (feedbackForm.message().touched() && feedbackForm.message().errors().some(e => e.kind === 'required')) {
                  <p class="text-xs text-destructive mt-1">This field is required.</p>
                }
              </div>

              <!-- Email (optional) -->
              <div class="flex flex-col gap-1.5">
                <label for="feedback-email" class="text-xs font-medium text-muted-foreground">Email (optional)</label>
                <input
                  id="feedback-email"
                  type="email"
                  [formField]="feedbackForm.email"
                  placeholder="you@example.com"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                @if (feedbackForm.email().touched() && feedbackForm.email().errors().some(e => e.kind === 'email')) {
                  <p class="text-xs text-destructive mt-1">Enter a valid email address.</p>
                }
              </div>

              @if (error()) {
                <p class="text-xs text-destructive">{{ error() }}</p>
              }

              <button
                type="submit"
                [disabled]="feedbackForm().invalid() || isLoading() || rating() === 0"
                class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {{ isLoading() ? 'Sending…' : 'Submit feedback' }}
              </button>
            </form>
          }
        </div>
      }

      <!-- Toggle button -->
      <button
        type="button"
        (click)="toggle()"
        class="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
      >
        <lucide-icon [img]="messageIcon" class="h-4 w-4" />
        Feedback
      </button>
    </div>
  `,
})
export class FeedbackPopoverComponent {
  private apiService = inject(ApiService);

  protected readonly messageIcon = MessageSquare;
  protected readonly starIcon = Star;
  protected readonly xIcon = X;

  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly isOpen = signal(false);
  protected readonly rating = signal(0);
  protected readonly isLoading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly model = signal({ message: '', email: '' });
  protected readonly feedbackForm = form(this.model, (s) => {
    required(s.message);
    email(s.email, { message: 'Enter a valid email address.' });
  });

  toggle() {
    this.isOpen.update((v) => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  setRating(value: number) {
    this.rating.set(value);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.feedbackForm().invalid() || this.rating() === 0) return;
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await this.apiService.post('/feedback', {
        review: this.rating(),
        message: this.model().message,
        ...(this.model().email ? { email: this.model().email } : {}),
      });
      this.submitted.set(true);
    } catch {
      this.error.set('Failed to submit. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
