import { computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { authClient, type Session } from "./auth.client";

type AuthState = {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  session: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: "root" },
  withState(initialState),

  withComputed((state) => ({
    user: computed(() => state.session()?.user ?? null),
    isAuthenticated: computed(() => !!state.session()?.user),
    activeOrgId: computed(
      () => state.session()?.session?.activeOrganizationId ?? null,
    ),
  })),

  withMethods((store) => {
    const router = inject(Router);

    return {
      async loadSession() {
        patchState(store, { isLoading: true, error: null });
        try {
          const { data } = await authClient.getSession();
          patchState(store, { session: data, isLoading: false });
        } catch {
          patchState(store, { session: null, isLoading: false });
        }
      },

      async signIn(email: string, password: string) {
        patchState(store, { isLoading: true, error: null });
        const { data, error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/orgs",
        });
        if (error) {
          patchState(store, { isLoading: false, error: error.message ?? "Sign in failed" });
          return { error };
        }
        // Reload full session after sign-in
        patchState(store, { isLoading: false });
        const { data: session } = await authClient.getSession();
        patchState(store, { session });
        return { data };
      },

      async signUp(name: string, email: string, password: string) {
        patchState(store, { isLoading: true, error: null });
        const { data, error } = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/orgs",
        });
        if (error) {
          patchState(store, { isLoading: false, error: error.message ?? "Sign up failed" });
          return { error };
        }
        patchState(store, { isLoading: false });
        return { data };
      },

      async signOut() {
        await authClient.signOut();
        patchState(store, { session: null });
        await router.navigate(["/sign-in"]);
      },

      clearError() {
        patchState(store, { error: null });
      },
    };
  }),
);
