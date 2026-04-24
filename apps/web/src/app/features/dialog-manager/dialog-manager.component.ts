import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DialogManagerStore } from "./dialog-manager.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-dialog-manager",
  template: `
    @if (dialogStore.hasOpenDialog()) {
      @let dialog = dialogStore.activeDialog()!;
      <div
        class="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        [attr.aria-labelledby]="'dialog-title-' + dialog.id"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          (click)="onCancel()"
        ></div>

        <!-- Panel -->
        <div class="relative z-10 w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
          <h2
            [id]="'dialog-title-' + dialog.id"
            class="text-lg font-semibold"
          >{{ dialog.title }}</h2>

          @if (dialog.description) {
            <p class="mt-2 text-sm text-muted-foreground">{{ dialog.description }}</p>
          }

          <div class="mt-6 flex justify-end gap-3">
            @if (dialog.type === "confirm") {
              <button
                class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                (click)="onCancel()"
              >
                {{ dialog.cancelLabel ?? "Cancel" }}
              </button>
            }
            <button
              class="rounded-md px-4 py-2 text-sm font-medium"
              [class]="dialog.variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'"
              (click)="onConfirm()"
            >
              {{ dialog.confirmLabel ?? "Confirm" }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class DialogManagerComponent {
  protected dialogStore = inject(DialogManagerStore);

  async onConfirm() {
    const dialog = this.dialogStore.activeDialog();
    if (!dialog) return;
    await dialog.onConfirm?.();
    this.dialogStore.close(dialog.id);
  }

  onCancel() {
    const dialog = this.dialogStore.activeDialog();
    if (!dialog) return;
    dialog.onCancel?.();
    this.dialogStore.close(dialog.id);
  }
}
