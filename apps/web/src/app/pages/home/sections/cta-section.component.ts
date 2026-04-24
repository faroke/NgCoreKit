import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cta-section',
  imports: [RouterLink],
  template: `
    <section class="py-24">
      <div class="mx-auto max-w-3xl px-4 text-center">
        <h2 class="text-4xl font-bold">Start building today</h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Join thousands of developers who ship SaaS products faster with NgCoreKit.
        </p>
        <div class="mt-8 flex items-center justify-center gap-3">
          <a
            routerLink="/sign-up"
            class="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get started free
          </a>
          <a
            routerLink="/docs"
            class="rounded-md border px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            Read the docs
          </a>
        </div>
      </div>
    </section>
  `,
})
export class CtaSectionComponent {}
