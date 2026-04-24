import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

export type DialogType = "confirm" | "alert" | "custom";

export type DialogConfig = {
  id: string;
  type: DialogType;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

type DialogManagerState = {
  dialogs: DialogConfig[];
};

export const DialogManagerStore = signalStore(
  { providedIn: "root" },
  withState<DialogManagerState>({ dialogs: [] }),

  withComputed((state) => ({
    activeDialog: computed(() => state.dialogs()[0] ?? null),
    hasOpenDialog: computed(() => state.dialogs().length > 0),
  })),

  withMethods((store) => ({
    open(config: Omit<DialogConfig, "id">) {
      const id = crypto.randomUUID();
      patchState(store, { dialogs: [...store.dialogs(), { ...config, id }] });
      return id;
    },

    close(id?: string) {
      if (id) {
        patchState(store, { dialogs: store.dialogs().filter((d) => d.id !== id) });
      } else {
        // Close the topmost dialog
        patchState(store, { dialogs: store.dialogs().slice(1) });
      }
    },

    closeAll() {
      patchState(store, { dialogs: [] });
    },

    confirm(options: {
      title: string;
      description?: string;
      confirmLabel?: string;
      cancelLabel?: string;
      variant?: "default" | "destructive";
      onConfirm: () => void | Promise<void>;
      onCancel?: () => void;
    }) {
      return this.open({ type: "confirm", ...options });
    },
  })),
);
