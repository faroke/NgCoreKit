import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { AccountStore } from "../../../core/stores/account.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-account-danger",
  imports: [FormField],
  template: `
    <div class="p-6 max-w-xl">
      <h2 class="text-xl font-semibold">Danger Zone</h2>
      <p class="mt-1 text-sm text-muted-foreground">Permanent, irreversible actions.</p>

      <div class="mt-6 rounded-lg border border-destructive/30 bg-card p-4">
        <h3 class="text-sm font-semibold text-destructive">Delete account</h3>
        <p class="mt-1 text-sm text-muted-foreground">
          This will permanently delete your account and all associated data. This action cannot be undone.
        </p>

        @if (!showConfirm()) {
          <button
            type="button"
            (click)="showConfirm.set(true)"
            class="mt-4 rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            Delete my account
          </button>
        } @else {
          <form (submit)="onSubmit($event)" class="mt-4 space-y-3">
            <div class="space-y-2">
              <label class="text-sm font-medium">Confirm your password to continue</label>
              <input
                type="password"
                [formField]="dangerForm.password"
                placeholder="Enter your password"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              @if (dangerForm.password().touched() && dangerForm.password().errors().some(e => e.kind === 'required')) {
                <p class="text-xs text-destructive mt-1">This field is required.</p>
              }
            </div>

            @if (error()) {
              <p class="text-sm text-destructive">{{ error() }}</p>
            }

            <div class="flex gap-2">
              <button
                type="submit"
                [disabled]="dangerForm().invalid() || isDeleting()"
                class="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                {{ isDeleting() ? "Deleting…" : "Permanently delete" }}
              </button>
              <button
                type="button"
                (click)="cancel()"
                class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class AccountDangerComponent {
  private accountStore = inject(AccountStore);

  protected showConfirm = signal(false);
  protected readonly model = signal({ password: "" });
  protected readonly dangerForm = form(this.model, (s) => {
    required(s.password);
  });
  protected isDeleting = signal(false);
  protected error = signal<string | null>(null);

  cancel() {
    this.showConfirm.set(false);
    this.model.set({ password: "" });
    this.error.set(null);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.dangerForm().invalid()) return;
    this.isDeleting.set(true);
    this.error.set(null);
    try {
      await this.accountStore.deleteAccount({ password: this.model().password });
    } catch (e: unknown) {
      this.error.set((e as { error?: { message?: string }; message?: string }).error?.message ?? (e as { message?: string }).message ?? "Failed to delete account");
      this.isDeleting.set(false);
    }
  }
}
