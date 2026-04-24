import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../auth/auth.store";

/** Prevents authenticated users from accessing sign-in/sign-up pages. */
export const guestGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    await authStore.loadSession();
  }

  if (authStore.isAuthenticated()) {
    return router.createUrlTree(["/orgs"]);
  }

  return true;
};
