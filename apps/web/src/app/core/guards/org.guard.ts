import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRouteSnapshot } from "@angular/router";
import { OrgContextStore } from "../stores/org-context.store";
import { AuthStore } from "../auth/auth.store";

export const orgGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const orgStore = inject(OrgContextStore);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Ensure authenticated
  if (!authStore.isAuthenticated()) {
    return router.createUrlTree(["/sign-in"]);
  }

  const orgSlug = route.params["orgSlug"] as string | undefined;

  // Load orgs if not yet loaded
  if (orgStore.orgs().length === 0) {
    await orgStore.loadOrgs();
  }

  if (!orgSlug) {
    // Redirect to first org if available
    const firstOrg = orgStore.orgs()[0];
    if (firstOrg) {
      return router.createUrlTree(["/orgs", firstOrg.slug, "dashboard"]);
    }
    return router.createUrlTree(["/orgs/new"]);
  }

  const org = orgStore.orgs().find((o) => o.slug === orgSlug);
  if (!org) {
    return router.createUrlTree(["/orgs"]);
  }

  orgStore.setActiveOrg(org);
  return true;
};
