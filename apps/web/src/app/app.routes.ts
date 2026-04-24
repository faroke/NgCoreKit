import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { guestGuard } from "./core/guards/guest.guard";
import { orgGuard } from "./core/guards/org.guard";
import { adminGuard } from "./core/guards/admin.guard";

export const routes: Routes = [
  // ── Public ────────────────────────────────────────────────────────────────
  {
    path: "",
    loadComponent: () =>
      import("./layouts/public/public-layout.component").then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/home/home.component").then((m) => m.HomeComponent),
      },
      {
        path: "posts",
        loadComponent: () =>
          import("./pages/blog/blog-list.component").then((m) => m.BlogListComponent),
      },
      {
        path: "posts/categories/:category",
        loadComponent: () =>
          import("./pages/blog/blog-category.component").then((m) => m.BlogCategoryComponent),
      },
      {
        path: "posts/:slug",
        loadComponent: () =>
          import("./pages/blog/blog-post.component").then((m) => m.BlogPostComponent),
      },
      {
        path: "docs",
        loadComponent: () =>
          import("./pages/docs/docs-shell.component").then((m) => m.DocsShellComponent),
        children: [
          {
            path: "",
            redirectTo: "introduction",
            pathMatch: "full",
          },
          {
            path: ":slug",
            loadComponent: () =>
              import("./pages/docs/docs-page.component").then((m) => m.DocsPageComponent),
          },
        ],
      },
      {
        path: "changelog",
        loadComponent: () =>
          import("./pages/changelog/changelog-list.component").then((m) => m.ChangelogListComponent),
      },
      {
        path: "changelog/:slug",
        loadComponent: () =>
          import("./pages/changelog/changelog-detail.component").then((m) => m.ChangelogDetailComponent),
      },
      {
        path: "legal/privacy",
        loadComponent: () =>
          import("./pages/legal/privacy.component").then((m) => m.PrivacyComponent),
      },
      {
        path: "legal/terms",
        loadComponent: () =>
          import("./pages/legal/terms.component").then((m) => m.TermsComponent),
      },
      {
        path: "about",
        loadComponent: () =>
          import("./pages/about/about.component").then((m) => m.AboutComponent),
      },
      {
        path: "contact",
        loadComponent: () =>
          import("./pages/contact/contact.component").then((m) => m.ContactComponent),
      },
    ],
  },

  // ── Auth pages (guest only) ────────────────────────────────────────────────
  {
    path: "sign-in",
    canActivate: [guestGuard],
    loadComponent: () =>
      import("./pages/auth/sign-in/sign-in.component").then((m) => m.SignInComponent),
  },
  {
    path: "sign-up",
    canActivate: [guestGuard],
    loadComponent: () =>
      import("./pages/auth/sign-up/sign-up.component").then((m) => m.SignUpComponent),
  },

  // ── Orgs root (list + new) ─────────────────────────────────────────────────
  {
    path: "orgs",
    canActivate: [authGuard],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/orgs/orgs-list.component").then((m) => m.OrgsListComponent),
      },
      {
        path: "new",
        loadComponent: () =>
          import("./pages/orgs/new/new-org.component").then((m) => m.NewOrgComponent),
      },
      // ── Org-scoped app ──────────────────────────────────────────────────
      {
        path: ":orgSlug",
        canActivate: [orgGuard],
        loadComponent: () =>
          import("./layouts/app/app-layout.component").then((m) => m.AppLayoutComponent),
        children: [
          {
            path: "dashboard",
            loadComponent: () =>
              import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
          },
          {
            path: "settings",
            children: [
              {
                path: "details",
                loadComponent: () =>
                  import("./pages/settings/details/org-details.component").then(
                    (m) => m.OrgDetailsComponent,
                  ),
              },
              {
                path: "members",
                loadComponent: () =>
                  import("./pages/settings/members/org-members.component").then(
                    (m) => m.OrgMembersComponent,
                  ),
              },
              {
                path: "danger",
                loadComponent: () =>
                  import("./pages/settings/danger/org-danger.component").then(
                    (m) => m.OrgDangerComponent,
                  ),
              },
              {
                path: "billing",
                loadComponent: () =>
                  import("./pages/settings/billing/billing.component").then(
                    (m) => m.BillingComponent,
                  ),
              },
              { path: "", redirectTo: "details", pathMatch: "full" },
            ],
          },
          { path: "", redirectTo: "dashboard", pathMatch: "full" },
        ],
      },
    ],
  },

  // ── Account settings ──────────────────────────────────────────────────────────
  {
    path: "account",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./layouts/account/account-layout.component").then((m) => m.AccountLayoutComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/account/account-overview.component").then((m) => m.AccountOverviewComponent),
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./pages/account/settings/account-settings.component").then((m) => m.AccountSettingsComponent),
      },
      {
        path: "change-password",
        loadComponent: () =>
          import("./pages/account/change-password/change-password.component").then((m) => m.ChangePasswordComponent),
      },
      {
        path: "change-email",
        loadComponent: () =>
          import("./pages/account/change-email/change-email.component").then((m) => m.ChangeEmailComponent),
      },
      {
        path: "email",
        loadComponent: () =>
          import("./pages/account/email-preferences/email-preferences.component").then((m) => m.EmailPreferencesComponent),
      },
      {
        path: "danger",
        loadComponent: () =>
          import("./pages/account/danger/account-danger.component").then((m) => m.AccountDangerComponent),
      },
    ],
  },

  // ── Admin panel ───────────────────────────────────────────────────────────────
  {
    path: "admin",
    canActivate: [adminGuard],
    loadComponent: () =>
      import("./layouts/admin/admin-layout.component").then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/admin/dashboard/admin-dashboard.component").then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: "users",
        loadComponent: () =>
          import("./pages/admin/users/admin-users-list.component").then(
            (m) => m.AdminUsersListComponent,
          ),
      },
      {
        path: "users/:userId",
        loadComponent: () =>
          import("./pages/admin/users/admin-user-detail.component").then(
            (m) => m.AdminUserDetailComponent,
          ),
      },
      {
        path: "organizations",
        loadComponent: () =>
          import("./pages/admin/organizations/admin-orgs-list.component").then(
            (m) => m.AdminOrgsListComponent,
          ),
      },
      {
        path: "organizations/:orgId",
        loadComponent: () =>
          import("./pages/admin/organizations/admin-org-detail.component").then(
            (m) => m.AdminOrgDetailComponent,
          ),
      },
      {
        path: "feedback",
        loadComponent: () =>
          import("./pages/admin/feedback/admin-feedback-list.component").then(
            (m) => m.AdminFeedbackListComponent,
          ),
      },
      {
        path: "feedback/:feedbackId",
        loadComponent: () =>
          import("./pages/admin/feedback/admin-feedback-detail.component").then(
            (m) => m.AdminFeedbackDetailComponent,
          ),
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────────
  {
    path: "**",
    loadComponent: () =>
      import("./pages/errors/not-found.component").then((m) => m.NotFoundComponent),
  },
];
