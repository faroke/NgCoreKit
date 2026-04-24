import { ChangeDetectionStrategy, Component, inject, isDevMode } from "@angular/core";
import { Bug, LucideAngularModule, X } from "lucide-angular";
import { AuthStore } from "../../core/auth/auth.store";
import { OrgContextStore } from "../../core/stores/org-context.store";
import { DebugPanelStore } from "../../core/stores/debug-panel.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-debug-panel",
  imports: [LucideAngularModule],
  template: `
    @if (isDev) {
      <!-- Toggle button -->
      <button
        type="button"
        (click)="debugStore.toggle()"
        class="fixed bottom-8 left-2 z-50 flex h-8 w-8 items-center justify-center rounded-full border bg-card shadow-md hover:bg-accent"
        aria-label="Toggle debug panel"
      >
        <lucide-icon [img]="bugIcon" class="h-4 w-4" />
      </button>

      <!-- Panel -->
      @if (debugStore.isOpen()) {
        <div class="fixed bottom-18 left-2 z-50 w-80 rounded-lg border bg-card shadow-lg">
          <!-- Header -->
          <div class="flex items-center justify-between border-b px-3 py-2">
            <span class="text-xs font-semibold">Debug Panel</span>
            <button
              type="button"
              (click)="debugStore.toggle()"
              class="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <lucide-icon [img]="xIcon" class="h-4 w-4" />
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex border-b text-xs">
            <button
              type="button"
              (click)="debugStore.setTab('session')"
              class="flex-1 px-3 py-2 font-medium transition-colors"
              [class]="debugStore.activeTab() === 'session' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'"
            >
              Session
            </button>
            <button
              type="button"
              (click)="debugStore.setTab('org')"
              class="flex-1 px-3 py-2 font-medium transition-colors"
              [class]="debugStore.activeTab() === 'org' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'"
            >
              Org
            </button>
          </div>

          <!-- Content -->
          <div class="p-3 space-y-2 text-xs font-mono max-h-64 overflow-y-auto">
            @if (debugStore.activeTab() === 'session') {
              @if (authStore.user(); as user) {
                <div class="space-y-1">
                  <div class="flex gap-2">
                    <span class="text-muted-foreground w-20 shrink-0">id</span>
                    <span class="truncate">{{ user.id }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-muted-foreground w-20 shrink-0">email</span>
                    <span class="truncate">{{ user.email }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-muted-foreground w-20 shrink-0">name</span>
                    <span>{{ user.name }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-muted-foreground w-20 shrink-0">role</span>
                    <span>{{ user.role ?? '—' }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-muted-foreground w-20 shrink-0">verified</span>
                    <span>{{ user.emailVerified }}</span>
                  </div>
                </div>
              } @else {
                <p class="text-muted-foreground">Not authenticated</p>
              }
            } @else {
              @if (orgStore.activeOrg(); as org) {
                <div class="space-y-1">
                  <div class="flex gap-2">
                    <span class="text-muted-foreground w-20 shrink-0">name</span>
                    <span>{{ org.name }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-muted-foreground w-20 shrink-0">slug</span>
                    <span>{{ org.slug }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-muted-foreground w-20 shrink-0">role</span>
                    <span>{{ org.role }}</span>
                  </div>
                </div>

                @if (orgStore.orgs().length > 0) {
                  <div class="mt-2 pt-2 border-t space-y-1">
                    <p class="text-muted-foreground">All orgs ({{ orgStore.orgs().length }})</p>
                    @for (o of orgStore.orgs(); track o.id) {
                      <div class="flex gap-2">
                        <span class="text-muted-foreground w-20 shrink-0 truncate">{{ o.slug }}</span>
                        <span class="truncate">{{ o.name }}</span>
                      </div>
                    }
                  </div>
                }
              } @else {
                <p class="text-muted-foreground">No active org</p>
              }
            }
          </div>
        </div>
      }
    }
  `,
})
export class DebugPanelComponent {
  protected readonly isDev = isDevMode();
  protected authStore = inject(AuthStore);
  protected orgStore = inject(OrgContextStore);
  protected debugStore = inject(DebugPanelStore);

  protected readonly bugIcon = Bug;
  protected readonly xIcon = X;
}
