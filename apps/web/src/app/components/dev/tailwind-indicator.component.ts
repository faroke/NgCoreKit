import { ChangeDetectionStrategy, Component, isDevMode } from "@angular/core";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-tailwind-indicator",
  template: `
    @if (isDev) {
      <div class="fixed bottom-0 left-0 z-50 m-2 flex items-center justify-center rounded-full border bg-card px-2 py-1 font-mono text-xs font-medium shadow-sm">
        <span class="sm:hidden">xs</span>
        <span class="hidden sm:inline md:hidden">sm</span>
        <span class="hidden md:inline lg:hidden">md</span>
        <span class="hidden lg:inline xl:hidden">lg</span>
        <span class="hidden xl:inline 2xl:hidden">xl</span>
        <span class="hidden 2xl:inline">2xl</span>
      </div>
    }
  `,
})
export class TailwindIndicatorComponent {
  protected readonly isDev = isDevMode();
}
