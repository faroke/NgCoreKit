import { computed, inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

const STORAGE_KEY = 'ngcorekit_seen_changelogs';

type ChangelogManagerState = {
  seenVersions: string[];
};

export const ChangelogManagerStore = signalStore(
  { providedIn: 'root' },
  withState<ChangelogManagerState>({ seenVersions: [] }),

  withMethods((store) => ({
    hasUnseen(versions: string[]) {
      return computed(() => versions.some((v) => !store.seenVersions().includes(v)));
    },

    markAsSeen(version: string) {
      const updated = [...new Set([...store.seenVersions(), version])];
      patchState(store, { seenVersions: updated });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
    },

    dismiss(version: string) {
      const updated = [...new Set([...store.seenVersions(), version])];
      patchState(store, { seenVersions: updated });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
    },

    isVersionSeen(version: string): boolean {
      return store.seenVersions().includes(version);
    },
  })),

  withHooks({
    onInit(store) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as string[];
          if (Array.isArray(parsed)) {
            patchState(store, { seenVersions: parsed });
          }
        }
      } catch {
        // ignore storage errors
      }
    },
  }),
);
