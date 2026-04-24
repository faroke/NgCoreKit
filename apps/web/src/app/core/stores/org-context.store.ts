import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { authClient } from "../auth/auth.client";

export type OrgSummary = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: string;
};

type OrgContextState = {
  activeOrg: OrgSummary | null;
  orgs: OrgSummary[];
  isLoading: boolean;
};

const initialState: OrgContextState = {
  activeOrg: null,
  orgs: [],
  isLoading: false,
};

export const OrgContextStore = signalStore(
  { providedIn: "root" },
  withState(initialState),

  withComputed((state) => ({
    hasOrgs: computed(() => state.orgs().length > 0),
    activeSlug: computed(() => state.activeOrg()?.slug ?? null),
  })),

  withMethods((store) => ({
    async loadOrgs() {
      patchState(store, { isLoading: true });
      const { data, error } = await authClient.organization.list();
      if (!error && data) {
        patchState(store, {
          orgs: data.map((o) => ({
            id: o.id,
            name: o.name,
            slug: o.slug ?? "",
            logo: o.logo ?? null,
            role: (o as { role?: string }).role ?? "member",
          })),
          isLoading: false,
        });
      } else {
        patchState(store, { isLoading: false });
      }
    },

    setActiveOrg(org: OrgSummary | null) {
      patchState(store, { activeOrg: org });
    },

    setActiveOrgBySlug(slug: string) {
      const org = store.orgs().find((o) => o.slug === slug) ?? null;
      patchState(store, { activeOrg: org });
    },

    async createOrg(name: string, slug: string) {
      const { data, error } = await authClient.organization.create({ name, slug });
      if (error) return { error };
      const newOrg: OrgSummary = {
        id: data.id,
        name: data.name,
        slug: data.slug ?? slug,
        logo: data.logo ?? null,
        role: "owner",
      };
      patchState(store, { orgs: [...store.orgs(), newOrg], activeOrg: newOrg });
      return { data: newOrg };
    },

    removeOrg(orgId: string) {
      patchState(store, {
        orgs: store.orgs().filter((o) => o.id !== orgId),
        activeOrg: store.activeOrg()?.id === orgId ? null : store.activeOrg(),
      });
    },
  })),
);
