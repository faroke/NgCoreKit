import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type DebugPanelState = {
  isOpen: boolean;
  activeTab: "session" | "org";
};

const initialState: DebugPanelState = {
  isOpen: false,
  activeTab: "session",
};

export const DebugPanelStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store) => ({
    toggle() {
      patchState(store, { isOpen: !store.isOpen() });
    },
    setTab(tab: DebugPanelState["activeTab"]) {
      patchState(store, { activeTab: tab });
    },
  })),
);
