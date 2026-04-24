import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { LandingHeaderComponent } from '../../components/public/landing-header.component';
import { FooterComponent } from '../../components/public/footer.component';
import { FeedbackPopoverComponent } from '../../features/feedback/feedback-popover.component';
import { ToastComponent } from '../../components/shared/toast.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-public-layout',
  imports: [RouterOutlet, LandingHeaderComponent, FooterComponent, FeedbackPopoverComponent, ToastComponent],
  template: `
    <app-landing-header />
    <main class="min-h-screen">
      <router-outlet />
    </main>
    <app-footer />
    <app-feedback-popover />
    <app-toast />
  `,
})
export class PublicLayoutComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        void this.router.navigate(['/orgs']);
      }
    });
  }
}
