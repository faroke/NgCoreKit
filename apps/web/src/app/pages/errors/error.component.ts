import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-error',
  imports: [RouterLink],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p class="text-6xl font-bold text-muted-foreground/40">{{ code() }}</p>
      <h1 class="text-2xl font-bold">{{ title() }}</h1>
      <p class="max-w-sm text-muted-foreground">{{ description() }}</p>
      <a
        routerLink="/"
        class="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Back to home
      </a>
    </div>
  `,
})
export class ErrorComponent {
  readonly code = input<string>('400');
  readonly title = input<string>('Something went wrong');
  readonly description = input<string>('An unexpected error occurred. Please try again or contact support if the problem persists.');
}
