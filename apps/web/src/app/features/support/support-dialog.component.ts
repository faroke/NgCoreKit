import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormField, form, required, email } from '@angular/forms/signals';
import { LucideAngularModule, X } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-support-dialog',
  imports: [FormField, LucideAngularModule],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        (click)="onBackdropClick()"
      ></div>

      <!-- Dialog -->
      <div class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card shadow-lg">
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h2 class="text-lg font-semibold">Contact Support</h2>
          <button
            type="button"
            class="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            (click)="onBackdropClick()"
          >
            <lucide-icon [img]="xIcon" class="h-4 w-4" />
          </button>
        </div>

        @if (submitted()) {
          <div class="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <p class="font-medium">Support request sent</p>
            <p class="text-sm text-muted-foreground">Our team will respond to your email within 24 hours.</p>
          </div>
        } @else {
          <form (submit)="onSubmit($event)" class="flex flex-col gap-4 px-6 py-4">
            @if (error()) {
              <div class="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {{ error() }}
              </div>
            }

            <div class="flex flex-col gap-1.5">
              <label for="support-email" class="text-sm font-medium">Email</label>
              <input
                id="support-email"
                type="email"
                [formField]="supportForm.email"
                placeholder="you@example.com"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              @if (supportForm.email().touched() && supportForm.email().errors().some(e => e.kind === 'required')) {
                <p class="text-xs text-destructive mt-1">This field is required.</p>
              }
              @if (supportForm.email().touched() && supportForm.email().errors().some(e => e.kind === 'email')) {
                <p class="text-xs text-destructive mt-1">Enter a valid email address.</p>
              }
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="support-subject" class="text-sm font-medium">Subject</label>
              <input
                id="support-subject"
                type="text"
                [formField]="supportForm.subject"
                placeholder="What do you need help with?"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              @if (supportForm.subject().touched() && supportForm.subject().errors().some(e => e.kind === 'required')) {
                <p class="text-xs text-destructive mt-1">This field is required.</p>
              }
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="support-message" class="text-sm font-medium">Message</label>
              <textarea
                id="support-message"
                [formField]="supportForm.message"
                rows="4"
                placeholder="Describe your issue in detail…"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              ></textarea>
              @if (supportForm.message().touched() && supportForm.message().errors().some(e => e.kind === 'required')) {
                <p class="text-xs text-destructive mt-1">This field is required.</p>
              }
            </div>

            <div class="flex justify-end gap-2 pb-2">
              <button
                type="button"
                (click)="onBackdropClick()"
                class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="supportForm().invalid() || isLoading()"
                class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {{ isLoading() ? 'Sending…' : 'Send request' }}
              </button>
            </div>
          </form>
        }
      </div>
    }
  `,
})
export class SupportDialogComponent implements OnInit {
  private apiService = inject(ApiService);
  private authStore = inject(AuthStore);

  protected readonly xIcon = X;

  readonly open = input(false);

  protected readonly model = signal({ email: '', subject: '', message: '' });
  protected readonly supportForm = form(this.model, (s) => {
    required(s.email);
    email(s.email, { message: 'Enter a valid email address.' });
    required(s.subject);
    required(s.message);
  });
  protected readonly isLoading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit() {
    const user = this.authStore.user();
    if (user?.email) {
      this.model.update(m => ({ ...m, email: user.email ?? '' }));
    }
  }

  onBackdropClick() {
    this.submitted.set(false);
    this.error.set(null);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.supportForm().invalid()) return;
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await this.apiService.post('/support', {
        subject: this.model().subject,
        message: this.model().message,
        email: this.model().email,
      });
      this.submitted.set(true);
    } catch {
      this.error.set('Failed to send. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
