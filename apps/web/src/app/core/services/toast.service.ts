import { Injectable, inject } from "@angular/core";
import { ToastStore } from "../stores/toast.store";

type ToastOptions = { duration?: number };

@Injectable({ providedIn: "root" })
export class ToastService {
  private store = inject(ToastStore);

  success(message: string, options?: ToastOptions) {
    this.store.add({ type: "success", message, duration: options?.duration ?? 4000 });
  }

  error(message: string, options?: ToastOptions) {
    this.store.add({ type: "error", message, duration: options?.duration ?? 5000 });
  }

  warning(message: string, options?: ToastOptions) {
    this.store.add({ type: "warning", message, duration: options?.duration ?? 4000 });
  }

  info(message: string, options?: ToastOptions) {
    this.store.add({ type: "info", message, duration: options?.duration ?? 4000 });
  }
}
