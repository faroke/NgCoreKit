import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
};

type ToastState = {
  toasts: Toast[];
};

const initialState: ToastState = {
  toasts: [],
};

export const ToastStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store) => ({
    add(toast: Omit<Toast, "id">) {
      const id = crypto.randomUUID();
      patchState(store, { toasts: [...store.toasts(), { ...toast, id }] });
      setTimeout(() => {
        patchState(store, { toasts: store.toasts().filter((t) => t.id !== id) });
      }, toast.duration);
    },
    dismiss(id: string) {
      patchState(store, { toasts: store.toasts().filter((t) => t.id !== id) });
    },
  })),
);
