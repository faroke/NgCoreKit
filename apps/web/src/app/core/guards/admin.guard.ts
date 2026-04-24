import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../auth/auth.store";

/** Protects /admin routes — requires platform role === "admin". */
export const adminGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    await authStore.loadSession();
  }

  if (!authStore.isAuthenticated()) {
    return router.createUrlTree(["/sign-in"]);
  }

  if (authStore.user()?.role !== "admin") {
    return router.createUrlTree(["/orgs"]);
  }

  return true;
};
