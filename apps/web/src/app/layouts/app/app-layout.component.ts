import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { LucideAngularModule, User } from "lucide-angular";
import { AuthStore } from "../../core/auth/auth.store";
import { OrgContextStore } from "../../core/stores/org-context.store";
import { OrgSwitcherComponent } from "../../components/shared/org-switcher.component";
import { DialogManagerComponent } from "../../features/dialog-manager/dialog-manager.component";
import { ImpersonationBannerComponent } from "../../components/shared/impersonation-banner.component";
import { ToastComponent } from "../../components/shared/toast.component";
import { TailwindIndicatorComponent } from "../../components/dev/tailwind-indicator.component";
import { DebugPanelComponent } from "../../components/dev/debug-panel.component";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-app-layout",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, OrgSwitcherComponent, DialogManagerComponent, ImpersonationBannerComponent, ToastComponent, TailwindIndicatorComponent, DebugPanelComponent],
  template: `
    <app-impersonation-banner />
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside class="flex w-60 flex-col border-r bg-card">
        <!-- Logo -->
        <div class="flex h-14 items-center border-b px-4">
          <a routerLink="/" class="text-sm font-semibold">NgCoreKit</a>
        </div>

        <!-- Nav -->
        <nav class="flex-1 overflow-y-auto p-3 space-y-6">
          @if (orgStore.activeOrg(); as org) {
            <!-- App nav -->
            <div class="space-y-1">
              <a
                [routerLink]="['/orgs', org.slug, 'dashboard']"
                routerLinkActive="bg-accent text-accent-foreground"
                class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                Dashboard
              </a>
              <a
                [routerLink]="['/orgs', org.slug, 'settings', 'members']"
                routerLinkActive="bg-accent text-accent-foreground"
                class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                Members
              </a>
              <a
                [routerLink]="['/orgs', org.slug, 'settings', 'details']"
                routerLinkActive="bg-accent text-accent-foreground"
                class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                Settings
              </a>
              <a
                [routerLink]="['/orgs', org.slug, 'settings', 'billing']"
                routerLinkActive="bg-accent text-accent-foreground"
                class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                Billing
              </a>
            </div>
          }

          <!-- Account link -->
          <div class="space-y-1">
            <a
              routerLink="/account"
              routerLinkActive="bg-accent text-accent-foreground"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              <lucide-icon [img]="userIcon" class="h-4 w-4 shrink-0" />
              Account
            </a>
          </div>

          <!-- Org switcher -->
          <app-org-switcher />
        </nav>

        <!-- User footer -->
        <div class="border-t p-3">
          @if (authStore.user(); as user) {
            <div class="flex items-center gap-3 rounded-md px-2 py-1.5">
              <div class="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium shrink-0">
                {{ user.name[0]?.toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-medium">{{ user.name }}</p>
                <p class="truncate text-xs text-muted-foreground">{{ user.email }}</p>
              </div>
              <button
                class="text-xs text-muted-foreground hover:text-foreground"
                (click)="signOut()"
              >
                Sign out
              </button>
            </div>
          }
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>
    </div>

    <!-- Global dialog manager -->
    <app-dialog-manager />

    <!-- Toast notifications -->
    <app-toast />

    <!-- Dev tools -->
    <app-tailwind-indicator />
    <app-debug-panel />
  `,
})
export class AppLayoutComponent {
  protected authStore = inject(AuthStore);
  protected orgStore = inject(OrgContextStore);

  protected readonly userIcon = User;

  signOut() {
    void this.authStore.signOut();
  }
}
