import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../auth/auth.store";

/** Protects routes that require authentication. Redirects to /sign-in if not authenticated. */
export const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    await authStore.loadSession();
  }

  if (!authStore.isAuthenticated()) {
    return router.createUrlTree(["/sign-in"]);
  }

  return true;
};
