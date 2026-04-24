import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-landing-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <!-- Logo -->
        <a routerLink="/" class="text-sm font-semibold">NgCoreKit</a>

        <!-- Nav links -->
        <nav class="hidden items-center gap-6 md:flex">
          <a
            routerLink="/features"
            routerLinkActive="text-foreground"
            class="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >Features</a>
          <a
            routerLink="/pricing"
            routerLinkActive="text-foreground"
            class="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >Pricing</a>
          <a
            routerLink="/posts"
            routerLinkActive="text-foreground"
            class="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >Blog</a>
          <a
            routerLink="/docs"
            routerLinkActive="text-foreground"
            class="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >Docs</a>
          <a
            routerLink="/changelog"
            routerLinkActive="text-foreground"
            class="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >Changelog</a>
        </nav>

        <!-- Auth actions -->
        <div class="flex items-center gap-2">
          <a
            routerLink="/sign-in"
            class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </a>
          <a
            routerLink="/sign-up"
            class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  `,
})
export class LandingHeaderComponent {}
