import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MetaService } from '../../core/services/meta.service';

type TeamMember = {
  name: string;
  role: string;
  initials: string;
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  template: `
    <div class="mx-auto max-w-3xl px-4 py-16">
      <!-- Mission -->
      <section class="flex flex-col gap-4">
        <h1 class="text-3xl font-bold">About NgCoreKit</h1>
        <p class="text-lg text-muted-foreground">
          NgCoreKit exists so developers can focus on building their product instead of rebuilding the same infrastructure over and over.
        </p>
        <p class="text-muted-foreground">
          We built NgCoreKit after spending months bootstrapping multiple SaaS products and noticing the same patterns: authentication, multi-tenancy, billing, admin tools. Every project started with weeks of scaffolding before we could write a single line of business logic.
        </p>
        <p class="text-muted-foreground">
          NgCoreKit packages all of that into a production-ready Angular 21 and NestJS monorepo so you can clone, configure, and ship.
        </p>
      </section>

      <!-- Values -->
      <section class="mt-12 flex flex-col gap-4">
        <h2 class="text-2xl font-bold">Our values</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
            <p class="font-semibold">Opinionated</p>
            <p class="text-sm text-muted-foreground">We make decisions so you do not have to. The stack is chosen and configured.</p>
          </div>
          <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
            <p class="font-semibold">Production-ready</p>
            <p class="text-sm text-muted-foreground">No toy examples. Every pattern is built to survive real users and real load.</p>
          </div>
          <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
            <p class="font-semibold">Open</p>
            <p class="text-sm text-muted-foreground">The entire codebase is readable. No magic, no black boxes.</p>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="mt-12 flex flex-col gap-6">
        <h2 class="text-2xl font-bold">Team</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          @for (member of team; track member.name) {
            <div class="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {{ member.initials }}
              </div>
              <div>
                <p class="font-medium">{{ member.name }}</p>
                <p class="text-sm text-muted-foreground">{{ member.role }}</p>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class AboutComponent implements OnInit {
  private metaService = inject(MetaService);

  protected readonly team: TeamMember[] = [
    { name: 'Alex Chen', role: 'Founder & Lead Engineer', initials: 'AC' },
    { name: 'Jordan Park', role: 'Full-stack Engineer', initials: 'JP' },
    { name: 'Sam Rivera', role: 'Design & Frontend', initials: 'SR' },
    { name: 'Morgan Lee', role: 'DevOps & Infrastructure', initials: 'ML' },
  ];

  ngOnInit() {
    this.metaService.setPage('About', 'Learn about NgCoreKit and the team behind it.');
  }
}
