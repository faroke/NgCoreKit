import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStore } from "../../core/auth/auth.store";
import { AdminService } from "../../core/services/admin.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-impersonation-banner",
  template: `
    @if (isImpersonating()) {
      <div class="flex items-center justify-between bg-amber-500 px-4 py-2 text-sm text-white">
        <span>
          Impersonating <strong>{{ authStore.user()?.name }}</strong>
          ({{ authStore.user()?.email }})
        </span>
        <button
          class="rounded border border-white/30 px-3 py-1 text-xs font-medium hover:bg-white/10 transition-colors"
          (click)="stopImpersonating()"
        >
          Stop impersonating
        </button>
      </div>
    }
  `,
})
export class ImpersonationBannerComponent {
  protected authStore = inject(AuthStore);
  private adminService = inject(AdminService);
  private router = inject(Router);

  protected isImpersonating = computed(
    () => !!(this.authStore.session() as { session?: { impersonatedBy?: string } } | null)?.session?.impersonatedBy,
  );

  async stopImpersonating() {
    try {
      await this.adminService.stopImpersonating();
      await this.authStore.loadSession();
      await this.router.navigate(["/admin"]);
    } catch {
      // session reload will clear the banner regardless
      await this.authStore.loadSession();
    }
  }
}
