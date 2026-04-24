import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bento-section',
  template: `
    <section class="py-20">
      <div class="mx-auto max-w-6xl px-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <!-- Large left cell -->
          <div class="flex flex-col gap-4 rounded-lg border bg-card p-6 md:col-span-2">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Authentication</p>
            <p class="text-2xl font-bold">Sign in once, access everything</p>
            <p class="text-muted-foreground">
              Better Auth handles sessions, OAuth tokens, and magic links. The Angular AuthStore exposes reactive signals so every component stays in sync.
            </p>
            <div class="mt-auto rounded-md border bg-background p-4 font-mono text-xs text-muted-foreground">
              <p>authStore.isAuthenticated() // true</p>
              <p>authStore.user()?.name // "Alice"</p>
            </div>
          </div>

          <!-- Top right cell -->
          <div class="flex flex-col gap-3 rounded-lg border bg-card p-6">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Multi-tenant</p>
            <p class="text-xl font-bold">One app, many tenants</p>
            <p class="text-sm text-muted-foreground">
              Organizations are first-class citizens. Every route, query, and mutation is scoped to the active org.
            </p>
          </div>

          <!-- Bottom left cell -->
          <div class="flex flex-col gap-3 rounded-lg border bg-card p-6">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Billing</p>
            <p class="text-xl font-bold">Stripe in minutes</p>
            <p class="text-sm text-muted-foreground">
              Pre-wired checkout sessions, subscription webhooks, and customer portal. Just add your Stripe keys.
            </p>
          </div>

          <!-- Large bottom right cell -->
          <div class="flex flex-col gap-4 rounded-lg border bg-card p-6 md:col-span-2">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Developer Experience</p>
            <p class="text-2xl font-bold">Turborepo + pnpm monorepo</p>
            <p class="text-muted-foreground">
              Parallel builds, shared types, and consistent tooling across Angular and NestJS. From <code class="rounded bg-muted px-1 text-sm">pnpm dev</code> to production in minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BentoSectionComponent {}
