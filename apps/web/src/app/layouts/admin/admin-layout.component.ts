import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthStore } from "../../core/auth/auth.store";
import { ImpersonationBannerComponent } from "../../components/shared/impersonation-banner.component";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-layout",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ImpersonationBannerComponent],
  template: `
    <div class="flex h-screen flex-col overflow-hidden">
      <app-impersonation-banner />

      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside class="flex w-56 flex-col border-r bg-card">
          <div class="flex h-14 items-center border-b px-4 gap-2">
            <a routerLink="/" class="text-sm font-semibold">NgCoreKit</a>
            <span class="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
              Admin
            </span>
          </div>

          <nav class="flex-1 overflow-y-auto p-3 space-y-1">
            <a
              routerLink="/admin"
              routerLinkActive="bg-accent text-accent-foreground"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              Dashboard
            </a>
            <a
              routerLink="/admin/users"
              routerLinkActive="bg-accent text-accent-foreground"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              Users
            </a>
            <a
              routerLink="/admin/organizations"
              routerLinkActive="bg-accent text-accent-foreground"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              Organizations
            </a>
            <a
              routerLink="/admin/feedback"
              routerLinkActive="bg-accent text-accent-foreground"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              Feedback
            </a>
          </nav>

          <div class="border-t p-3">
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex flex-col flex-1 min-w-0">
                <p class="truncate text-xs font-medium">{{ authStore.user()?.name }}</p>
                <p class="truncate text-xs text-muted-foreground">{{ authStore.user()?.email }}</p>
              </div>
              <button class="text-xs text-muted-foreground hover:text-foreground" (click)="signOut()">
                Sign out
              </button>
            </div>
            <a
              routerLink="/orgs"
              class="mt-1 block truncate rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to app
            </a>
          </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1 overflow-y-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  protected authStore = inject(AuthStore);
  private router = inject(Router);

  signOut() {
    void this.authStore.signOut();
  }
}
