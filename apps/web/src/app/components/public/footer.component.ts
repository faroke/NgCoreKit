import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t bg-background">
      <div class="mx-auto max-w-6xl px-4 py-12">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
          <!-- Product -->
          <div class="flex flex-col gap-3">
            <p class="text-sm font-semibold">Product</p>
            <nav class="flex flex-col gap-2">
              <a routerLink="/" fragment="features" class="text-sm text-muted-foreground hover:text-foreground">Features</a>
              <a routerLink="/" fragment="pricing" class="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
              <a routerLink="/changelog" class="text-sm text-muted-foreground hover:text-foreground">Changelog</a>
            </nav>
          </div>

          <!-- Resources -->
          <div class="flex flex-col gap-3">
            <p class="text-sm font-semibold">Resources</p>
            <nav class="flex flex-col gap-2">
              <a routerLink="/posts" class="text-sm text-muted-foreground hover:text-foreground">Blog</a>
              <a routerLink="/docs" class="text-sm text-muted-foreground hover:text-foreground">Docs</a>
            </nav>
          </div>

          <!-- Legal -->
          <div class="flex flex-col gap-3">
            <p class="text-sm font-semibold">Legal</p>
            <nav class="flex flex-col gap-2">
              <a routerLink="/legal/privacy" class="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
              <a routerLink="/legal/terms" class="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            </nav>
          </div>

          <!-- Company -->
          <div class="flex flex-col gap-3">
            <p class="text-sm font-semibold">Company</p>
            <nav class="flex flex-col gap-2">
              <a routerLink="/about" class="text-sm text-muted-foreground hover:text-foreground">About</a>
              <a routerLink="/contact" class="text-sm text-muted-foreground hover:text-foreground">Contact</a>
            </nav>
          </div>
        </div>

        <div class="mt-10 border-t pt-6">
          <p class="text-sm text-muted-foreground">
            &copy; {{ year }} NgCoreKit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
