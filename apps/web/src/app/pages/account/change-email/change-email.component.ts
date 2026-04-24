import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, email, form, required } from "@angular/forms/signals";
import { AccountStore } from "../../../core/stores/account.store";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-change-email",
  imports: [FormField],
  template: `
    <div class="p-6 max-w-xl">
      <h2 class="text-xl font-semibold">Change Email</h2>
      <p class="mt-1 text-sm text-muted-foreground">Enter your new email address and confirm with your password.</p>

      <form (submit)="onSubmit($event)" class="mt-6 space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">New email address</label>
          <input
            type="email"
            [formField]="emailForm.newEmail"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          @if (emailForm.newEmail().touched() && emailForm.newEmail().errors().some(e => e.kind === 'required')) {
            <p class="text-xs text-destructive mt-1">This field is required.</p>
          }
          @if (emailForm.newEmail().touched() && emailForm.newEmail().errors().some(e => e.kind === 'email')) {
            <p class="text-xs text-destructive mt-1">Enter a valid email address.</p>
          }
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Current password</label>
          <input
            type="password"
            [formField]="emailForm.password"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          @if (emailForm.password().touched() && emailForm.password().errors().some(e => e.kind === 'required')) {
            <p class="text-xs text-destructive mt-1">This field is required.</p>
          }
        </div>

        @if (error()) {
          <p class="text-sm text-destructive">{{ error() }}</p>
        }

        <button
          type="submit"
          [disabled]="emailForm().invalid() || isSaving()"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {{ isSaving() ? "Updating…" : "Update email" }}
        </button>
      </form>
    </div>
  `,
})
export class ChangeEmailComponent {
  private accountStore = inject(AccountStore);
  private toast = inject(ToastService);

  protected readonly model = signal({ newEmail: "", password: "" });
  protected readonly emailForm = form(this.model, (s) => {
    required(s.newEmail);
    email(s.newEmail, { message: "Enter a valid email address." });
    required(s.password);
  });
  protected isSaving = signal(false);
  protected error = signal<string | null>(null);

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.emailForm().invalid()) return;
    this.isSaving.set(true);
    this.error.set(null);
    try {
      await this.accountStore.changeEmail(this.model());
      this.toast.success("Email updated.");
      this.model.set({ newEmail: "", password: "" });
    } catch (e: unknown) {
      this.error.set((e as { error?: { message?: string }; message?: string }).error?.message ?? (e as { message?: string }).message ?? "Failed to update email");
    } finally {
      this.isSaving.set(false);
    }
  }
}
