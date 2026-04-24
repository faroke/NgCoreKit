import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, form, minLength, required } from "@angular/forms/signals";
import { AccountStore } from "../../../core/stores/account.store";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-change-password",
  imports: [FormField],
  template: `
    <div class="p-6 max-w-xl">
      <h2 class="text-xl font-semibold">Change Password</h2>
      <p class="mt-1 text-sm text-muted-foreground">Enter your current password and choose a new one.</p>

      <form (submit)="onSubmit($event)" class="mt-6 space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Current password</label>
          <input
            type="password"
            [formField]="passwordForm.currentPassword"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          @if (passwordForm.currentPassword().touched() && passwordForm.currentPassword().errors().some(e => e.kind === 'required')) {
            <p class="text-xs text-destructive mt-1">This field is required.</p>
          }
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">New password</label>
          <input
            type="password"
            [formField]="passwordForm.newPassword"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          @if (passwordForm.newPassword().touched() && passwordForm.newPassword().errors().some(e => e.kind === 'required')) {
            <p class="text-xs text-destructive mt-1">This field is required.</p>
          }
          @if (passwordForm.newPassword().touched() && passwordForm.newPassword().errors().some(e => e.kind === 'minLength')) {
            <p class="text-xs text-destructive mt-1">Password must be at least 8 characters.</p>
          }
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Confirm new password</label>
          <input
            type="password"
            [formField]="passwordForm.confirmPassword"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          @if (passwordForm.confirmPassword().touched() && passwordForm.confirmPassword().errors().some(e => e.kind === 'required')) {
            <p class="text-xs text-destructive mt-1">This field is required.</p>
          }
        </div>

        @if (error()) {
          <p class="text-sm text-destructive">{{ error() }}</p>
        }

        <button
          type="submit"
          [disabled]="passwordForm().invalid() || isSaving()"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {{ isSaving() ? "Updating…" : "Update password" }}
        </button>
      </form>
    </div>
  `,
})
export class ChangePasswordComponent {
  private accountStore = inject(AccountStore);
  private toast = inject(ToastService);

  protected readonly model = signal({ currentPassword: "", newPassword: "", confirmPassword: "" });
  protected readonly passwordForm = form(this.model, (s) => {
    required(s.currentPassword);
    required(s.newPassword);
    minLength(s.newPassword, 8);
    required(s.confirmPassword);
  });
  protected isSaving = signal(false);
  protected error = signal<string | null>(null);

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.passwordForm().invalid()) return;
    const { currentPassword, newPassword, confirmPassword } = this.model();
    if (newPassword !== confirmPassword) {
      this.error.set("Passwords do not match.");
      return;
    }
    this.isSaving.set(true);
    this.error.set(null);
    try {
      await this.accountStore.changePassword({ currentPassword, newPassword });
      this.toast.success("Password updated.");
      this.model.set({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: unknown) {
      this.error.set((e as { error?: { message?: string }; message?: string }).error?.message ?? (e as { message?: string }).message ?? "Failed to update password");
    } finally {
      this.isSaving.set(false);
    }
  }
}
