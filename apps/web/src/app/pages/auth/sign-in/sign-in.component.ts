import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, form, required, email } from "@angular/forms/signals";
import { RouterLink } from "@angular/router";
import { AuthStore } from "../../../core/auth/auth.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-sign-in",
  imports: [RouterLink, FormField],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="w-full max-w-sm space-y-6">
        <div class="space-y-1 text-center">
          <h1 class="text-2xl font-semibold">Sign in</h1>
          <p class="text-sm text-muted-foreground">Enter your credentials to continue</p>
        </div>

        @if (authStore.error()) {
          <div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {{ authStore.error() }}
          </div>
        }

        <form (submit)="onSubmit($event)" class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              [formField]="loginForm.email"
              autocomplete="email"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="you@example.com"
            />
            @if (loginForm.email().touched() && loginForm.email().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
            @if (loginForm.email().touched() && loginForm.email().errors().some(e => e.kind === 'email')) {
              <p class="text-xs text-destructive mt-1">Enter a valid email address.</p>
            }
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              [formField]="loginForm.password"
              autocomplete="current-password"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="••••••••"
            />
            @if (loginForm.password().touched() && loginForm.password().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="loginForm().invalid() || authStore.isLoading()"
            class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {{ authStore.isLoading() ? "Signing in…" : "Sign in" }}
          </button>
        </form>

        <p class="text-center text-sm text-muted-foreground">
          No account?
          <a routerLink="/sign-up" class="font-medium text-foreground underline underline-offset-4 hover:no-underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  `,
})
export class SignInComponent {
  protected authStore = inject(AuthStore);

  protected readonly model = signal({ email: '', password: '' });
  protected readonly loginForm = form(this.model, (s) => {
    required(s.email);
    email(s.email, { message: 'Enter a valid email address.' });
    required(s.password);
  });

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
    await this.authStore.signIn(this.model().email, this.model().password);
  }
}
