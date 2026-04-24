import { ChangeDetectionStrategy, Component } from '@angular/core';

type Review = {
  name: string;
  role: string;
  quote: string;
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-review-section',
  template: `
    <section class="py-20">
      <div class="mx-auto max-w-6xl px-4">
        <div class="flex flex-col items-center gap-4 text-center">
          <h2 class="text-3xl font-bold">What developers say</h2>
          <p class="max-w-xl text-muted-foreground">
            Teams use NgCoreKit to ship faster and spend less time on infrastructure.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          @for (review of reviews; track review.name) {
            <div class="flex flex-col gap-4 rounded-lg border bg-card p-6">
              <p class="text-sm text-muted-foreground">"{{ review.quote }}"</p>
              <div class="mt-auto flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {{ review.name[0] }}
                </div>
                <div>
                  <p class="text-sm font-medium">{{ review.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ review.role }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ReviewSectionComponent {
  protected readonly reviews: Review[] = [
    {
      name: 'Sarah K.',
      role: 'Founder, TechStartup',
      quote: 'NgCoreKit saved us at least three weeks of setup. We had auth, multi-tenancy, and billing running on day one.',
    },
    {
      name: 'Marcus L.',
      role: 'Lead Engineer, SaaSCo',
      quote: "The TypeScript types shared between Angular and NestJS are a game changer. No more guessing what the API returns.",
    },
    {
      name: 'Priya R.',
      role: 'Full-stack Developer',
      quote: 'The NgRx SignalStore patterns are clean and consistent. Our whole team picked it up quickly without extra training.',
    },
  ];
}
