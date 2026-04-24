import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form, required, email, minLength } from '@angular/forms/signals';
import { ApiService } from '../../core/services/api.service';
import { MetaService } from '../../core/services/meta.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <div class="mx-auto max-w-2xl px-4 py-16">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold">Contact us</h1>
        <p class="text-muted-foreground">Have a question or need help? Send us a message.</p>
      </div>

      @if (submitted()) {
        <div class="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
          <p class="font-medium text-green-700 dark:text-green-300">Message sent</p>
          <p class="mt-1 text-sm text-green-600 dark:text-green-400">We will get back to you as soon as possible.</p>
        </div>
      } @else {
        <form (submit)="onSubmit($event)" class="mt-8 flex flex-col gap-5">
          @if (error()) {
            <div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {{ error() }}
            </div>
          }

          <div class="flex flex-col gap-2">
            <label for="name" class="text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              [formField]="contactForm.name"
              placeholder="Your name"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            @if (contactForm.name().touched() && contactForm.name().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              [formField]="contactForm.email"
              placeholder="you@example.com"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            @if (contactForm.email().touched() && contactForm.email().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
            @if (contactForm.email().touched() && contactForm.email().errors().some(e => e.kind === 'email')) {
              <p class="text-xs text-destructive mt-1">Enter a valid email address.</p>
            }
          </div>

          <div class="flex flex-col gap-2">
            <label for="message" class="text-sm font-medium">Message</label>
            <textarea
              id="message"
              [formField]="contactForm.message"
              rows="5"
              placeholder="How can we help?"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            ></textarea>
            @if (contactForm.message().touched() && contactForm.message().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
            @if (contactForm.message().touched() && contactForm.message().errors().some(e => e.kind === 'minLength')) {
              <p class="text-xs text-destructive mt-1">Must be at least 10 characters.</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="contactForm().invalid() || isLoading()"
            class="self-start rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {{ isLoading() ? 'Sending…' : 'Send message' }}
          </button>
        </form>
      }
    </div>
  `,
})
export class ContactComponent implements OnInit {
  private apiService = inject(ApiService);
  private metaService = inject(MetaService);

  protected readonly model = signal({ name: '', email: '', message: '' });
  protected readonly contactForm = form(this.model, (s) => {
    required(s.name);
    required(s.email);
    email(s.email, { message: 'Enter a valid email address.' });
    required(s.message);
    minLength(s.message, 10);
  });
  protected readonly isLoading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit() {
    this.metaService.setPage('Contact', 'Get in touch with the NgCoreKit team.');
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.contactForm().invalid()) return;
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await this.apiService.post('/support', {
        subject: `Contact from ${this.model().name}`,
        message: this.model().message,
        email: this.model().email,
      });
      this.submitted.set(true);
    } catch {
      this.error.set('Failed to send message. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
