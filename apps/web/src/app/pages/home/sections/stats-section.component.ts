import { ChangeDetectionStrategy, Component } from '@angular/core';

type Stat = {
  value: string;
  label: string;
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stats-section',
  template: `
    <section class="border-y py-16">
      <div class="mx-auto max-w-6xl px-4">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
          @for (stat of stats; track stat.label) {
            <div class="flex flex-col items-center gap-1 text-center">
              <p class="text-3xl font-bold">{{ stat.value }}</p>
              <p class="text-sm text-muted-foreground">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class StatsSectionComponent {
  protected readonly stats: Stat[] = [
    { value: '10,000+', label: 'Developers' },
    { value: '50+', label: 'Features' },
    { value: '99.9%', label: 'Uptime' },
    { value: '< 5 min', label: 'Setup time' },
  ];
}
