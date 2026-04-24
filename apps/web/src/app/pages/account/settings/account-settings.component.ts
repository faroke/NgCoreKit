import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { AccountStore } from "../../../core/stores/account.store";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-account-settings",
  imports: [FormField],
  template: `
    <div class="p-6 max-w-xl">
      <h2 class="text-xl font-semibold">Edit Profile</h2>
      <p class="mt-1 text-sm text-muted-foreground">Update your display name.</p>

      <form (submit)="onSubmit($event)" class="mt-6 space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Name</label>
          <input
            type="text"
            [formField]="profileForm.name"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          @if (profileForm.name().touched() && profileForm.name().errors().some(e => e.kind === 'required')) {
            <p class="text-xs text-destructive mt-1">This field is required.</p>
          }
        </div>

        @if (error()) {
          <p class="text-sm text-destructive">{{ error() }}</p>
        }

        <button
          type="submit"
          [disabled]="profileForm().invalid() || isSaving()"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {{ isSaving() ? "Saving…" : "Save changes" }}
        </button>
      </form>
    </div>
  `,
})
export class AccountSettingsComponent implements OnInit {
  protected accountStore = inject(AccountStore);
  private toast = inject(ToastService);

  protected readonly model = signal({ name: "" });
  protected readonly profileForm = form(this.model, (s) => {
    required(s.name);
  });
  protected isSaving = signal(false);
  protected error = signal<string | null>(null);

  ngOnInit() {
    void this.accountStore.loadProfile().then(() => {
      const name = this.accountStore.profile()?.name ?? "";
      this.model.update((m) => ({ ...m, name }));
    });
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.profileForm().invalid()) return;
    this.isSaving.set(true);
    this.error.set(null);
    try {
      await this.accountStore.updateProfile({ name: this.model().name });
      this.toast.success("Profile updated.");
    } catch (e: unknown) {
      this.error.set((e as { message?: string }).message ?? "Failed to save");
    } finally {
      this.isSaving.set(false);
    }
  }
}
