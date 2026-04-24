import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AlertCircle, AlertTriangle, CheckCircle, Info, LucideAngularModule, X } from "lucide-angular";
import { ToastStore, type ToastType } from "../../core/stores/toast.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-toast",
  imports: [LucideAngularModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      @for (toast of toastStore.toasts(); track toast.id) {
        <div
          class="flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md w-80 text-sm bg-card text-foreground"
          [class]="borderClass(toast.type)"
          role="alert"
        >
          <lucide-icon [img]="iconFor(toast.type)" class="h-4 w-4 shrink-0 mt-0.5" [class]="iconClass(toast.type)" />
          <span class="flex-1">{{ toast.message }}</span>
          <button
            type="button"
            (click)="toastStore.dismiss(toast.id)"
            class="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <lucide-icon [img]="xIcon" class="h-4 w-4" />
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected toastStore = inject(ToastStore);

  protected readonly xIcon = X;

  protected iconFor(type: ToastType) {
    switch (type) {
      case "success": return CheckCircle;
      case "error": return AlertCircle;
      case "warning": return AlertTriangle;
      case "info": return Info;
    }
  }

  protected borderClass(type: ToastType): string {
    switch (type) {
      case "success": return "border-green-500/40";
      case "error": return "border-destructive/40";
      case "warning": return "border-yellow-500/40";
      case "info": return "border-blue-500/40";
    }
  }

  protected iconClass(type: ToastType): string {
    switch (type) {
      case "success": return "text-green-500";
      case "error": return "text-destructive";
      case "warning": return "text-yellow-500";
      case "info": return "text-blue-500";
    }
  }
}
