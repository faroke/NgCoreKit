import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import {
  Bell,
  Lock,
  LucideAngularModule,
  Mail,
  Settings,
  Trash2,
  User,
} from "lucide-angular";
import { AuthStore } from "../../core/auth/auth.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-account-layout",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside class="flex w-56 flex-col border-r bg-card shrink-0">
        <div class="flex h-14 items-center border-b px-4">
          <a routerLink="/" class="text-sm font-semibold">NgCoreKit</a>
        </div>

        <nav class="flex-1 overflow-y-auto p-3 space-y-1">
          <a
            routerLink="/account"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="bg-accent text-accent-foreground"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <lucide-icon [img]="userIcon" class="h-4 w-4 shrink-0" />
            Profile
          </a>
          <a
            routerLink="/account/settings"
            routerLinkActive="bg-accent text-accent-foreground"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <lucide-icon [img]="settingsIcon" class="h-4 w-4 shrink-0" />
            Edit Profile
          </a>
          <a
            routerLink="/account/change-password"
            routerLinkActive="bg-accent text-accent-foreground"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <lucide-icon [img]="lockIcon" class="h-4 w-4 shrink-0" />
            Password
          </a>
          <a
            routerLink="/account/change-email"
            routerLinkActive="bg-accent text-accent-foreground"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <lucide-icon [img]="mailIcon" class="h-4 w-4 shrink-0" />
            Email
          </a>
          <a
            routerLink="/account/email"
            routerLinkActive="bg-accent text-accent-foreground"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <lucide-icon [img]="bellIcon" class="h-4 w-4 shrink-0" />
            Notifications
          </a>
          <a
            routerLink="/account/danger"
            routerLinkActive="bg-accent text-accent-foreground"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-accent"
          >
            <lucide-icon [img]="trash2Icon" class="h-4 w-4 shrink-0" />
            Danger Zone
          </a>
        </nav>

        <div class="border-t p-3">
          @if (authStore.user(); as user) {
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium shrink-0">
                {{ user.name[0]?.toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-medium">{{ user.name }}</p>
                <p class="truncate text-xs text-muted-foreground">{{ user.email }}</p>
              </div>
            </div>
          }
        </div>
      </aside>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AccountLayoutComponent {
  protected authStore = inject(AuthStore);

  protected readonly userIcon = User;
  protected readonly settingsIcon = Settings;
  protected readonly lockIcon = Lock;
  protected readonly mailIcon = Mail;
  protected readonly bellIcon = Bell;
  protected readonly trash2Icon = Trash2;
}
