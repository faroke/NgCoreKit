import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AccountStore } from "../../core/stores/account.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-account-overview",
  imports: [RouterLink],
  template: `
    <div class="p-6 max-w-xl">
      <h2 class="text-xl font-semibold">Account</h2>
      <p class="mt-1 text-sm text-muted-foreground">Manage your personal account settings.</p>

      @if (accountStore.isLoading()) {
        <p class="mt-6 text-sm text-muted-foreground">Loading…</p>
      } @else if (accountStore.profile(); as profile) {
        <div class="mt-6 rounded-lg border bg-card p-4 space-y-3">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold shrink-0">
              {{ profile.name[0]?.toUpperCase() }}
            </div>
            <div>
              <p class="font-medium">{{ profile.name }}</p>
              <p class="text-sm text-muted-foreground">{{ profile.email }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-2">
          <a routerLink="/account/settings" class="flex items-center justify-between rounded-md border bg-card px-4 py-3 text-sm hover:bg-accent transition-colors">
            <span>Edit Profile</span>
            <span class="text-muted-foreground">›</span>
          </a>
          <a routerLink="/account/change-password" class="flex items-center justify-between rounded-md border bg-card px-4 py-3 text-sm hover:bg-accent transition-colors">
            <span>Change Password</span>
            <span class="text-muted-foreground">›</span>
          </a>
          <a routerLink="/account/change-email" class="flex items-center justify-between rounded-md border bg-card px-4 py-3 text-sm hover:bg-accent transition-colors">
            <span>Change Email</span>
            <span class="text-muted-foreground">›</span>
          </a>
          <a routerLink="/account/email" class="flex items-center justify-between rounded-md border bg-card px-4 py-3 text-sm hover:bg-accent transition-colors">
            <span>Notification Preferences</span>
            <span class="text-muted-foreground">›</span>
          </a>
          <a routerLink="/account/danger" class="flex items-center justify-between rounded-md border bg-card px-4 py-3 text-sm text-destructive hover:bg-accent transition-colors">
            <span>Danger Zone</span>
            <span class="text-muted-foreground">›</span>
          </a>
        </div>
      }
    </div>
  `,
})
export class AccountOverviewComponent implements OnInit {
  protected accountStore = inject(AccountStore);

  ngOnInit() {
    void this.accountStore.loadProfile();
  }
}
