import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  template: `
    <div>
      <h2 class="text-2xl font-semibold">Settings</h2>
      <p class="text-muted-foreground mt-2">À implémenter (Phase 2)</p>
    </div>
  `,
})
export class SettingsComponent {}
