import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero-section',
  imports: [RouterLink],
  template: `
    <section class="flex flex-col items-center gap-8 py-24 text-center">
      <div class="flex flex-col gap-4">
        <h1 class="text-5xl font-bold tracking-tight md:text-6xl">
          Ship your SaaS<br />in days, not months
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
          NgCoreKit is a production-ready Angular and NestJS monorepo boilerplate with authentication,
          multi-tenancy, billing, and an admin panel built in.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <a
          routerLink="/sign-up"
          class="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Get started free
        </a>
        <a
          routerLink="/docs"
          class="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent"
        >
          View demo
        </a>
      </div>

      <!-- Terminal preview -->
      <div class="w-full max-w-2xl rounded-lg border bg-card text-left shadow-sm">
        <div class="flex items-center gap-1.5 border-b px-4 py-3">
          <div class="h-3 w-3 rounded-full bg-red-400"></div>
          <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
          <div class="h-3 w-3 rounded-full bg-green-400"></div>
          <span class="ml-2 text-xs text-muted-foreground">terminal</span>
        </div>
        <div class="p-4 font-mono text-sm">
          <p class="text-muted-foreground">$ git clone https://github.com/your-org/ngcorekit</p>
          <p class="text-muted-foreground">$ cd ngcorekit && pnpm install</p>
          <p class="text-muted-foreground">$ docker compose up -d && pnpm dev</p>
          <p class="mt-2 text-green-500">Ready on http://localhost:4200</p>
        </div>
      </div>
    </section>
  `,
})
export class HeroSectionComponent {}
