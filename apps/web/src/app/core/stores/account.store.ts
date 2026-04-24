import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { AccountService, type UserProfile } from "../services/account.service";
import { AuthStore } from "../auth/auth.store";

type AccountState = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AccountState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const AccountStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store) => {
    const accountService = inject(AccountService);
    const authStore = inject(AuthStore);
    const router = inject(Router);

    return {
      async loadProfile() {
        patchState(store, { isLoading: true, error: null });
        try {
          const { data } = await accountService.getProfile();
          patchState(store, { profile: data, isLoading: false });
        } catch {
          patchState(store, { isLoading: false, error: "Failed to load profile" });
        }
      },

      async updateProfile(dto: { name?: string }) {
        patchState(store, { isLoading: true, error: null });
        try {
          const { data } = await accountService.updateProfile(dto);
          patchState(store, { profile: data, isLoading: false });
        } catch (e: unknown) {
          patchState(store, {
            isLoading: false,
            error: (e as { message?: string }).message ?? "Failed to update profile",
          });
          throw e;
        }
      },

      async changePassword(dto: { currentPassword: string; newPassword: string }) {
        patchState(store, { isLoading: true, error: null });
        try {
          await accountService.changePassword(dto);
          patchState(store, { isLoading: false });
        } catch (e: unknown) {
          patchState(store, {
            isLoading: false,
            error: (e as { message?: string }).message ?? "Failed to change password",
          });
          throw e;
        }
      },

      async changeEmail(dto: { newEmail: string; password: string }) {
        patchState(store, { isLoading: true, error: null });
        try {
          const { data } = await accountService.changeEmail(dto);
          patchState(store, { profile: data, isLoading: false });
        } catch (e: unknown) {
          patchState(store, {
            isLoading: false,
            error: (e as { message?: string }).message ?? "Failed to change email",
          });
          throw e;
        }
      },

      async deleteAccount(dto: { password: string }) {
        patchState(store, { isLoading: true, error: null });
        try {
          await accountService.deleteAccount(dto);
          patchState(store, { profile: null, isLoading: false });
          await authStore.signOut();
          await router.navigate(["/"]);
        } catch (e: unknown) {
          patchState(store, {
            isLoading: false,
            error: (e as { message?: string }).message ?? "Failed to delete account",
          });
          throw e;
        }
      },

      clearError() {
        patchState(store, { error: null });
      },
    };
  }),
);
