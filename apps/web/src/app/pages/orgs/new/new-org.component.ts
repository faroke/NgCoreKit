import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { Router, RouterLink } from "@angular/router";
import { OrgContextStore } from "../../../core/stores/org-context.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-new-org",
  imports: [FormField, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="w-full max-w-md space-y-6">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">Create an organization</h1>
          <p class="text-sm text-muted-foreground">Organizations help you collaborate with your team.</p>
        </div>

        @if (error()) {
          <div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {{ error() }}
          </div>
        }

        <form (submit)="onSubmit($event)" class="space-y-4">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium">Organization name</label>
            <input
              id="name"
              type="text"
              [formField]="newOrgForm.name"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Acme Inc."
            />
            @if (newOrgForm.name().touched() && newOrgForm.name().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
          </div>

          <div class="space-y-2">
            <label for="slug" class="text-sm font-medium">URL slug</label>
            <div class="flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring">
              <span class="text-muted-foreground shrink-0">ngcorekit.app/orgs/</span>
              <input
                id="slug"
                type="text"
                [formField]="newOrgForm.slug"
                class="flex-1 bg-transparent focus:outline-none"
                placeholder="acme-inc"
              />
            </div>
            @if (newOrgForm.slug().touched() && newOrgForm.slug().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
          </div>

          <div class="flex gap-3">
            <a
              routerLink="/orgs"
              class="flex-1 rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-accent"
            >
              Cancel
            </a>
            <button
              type="submit"
              [disabled]="newOrgForm().invalid() || isLoading()"
              class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {{ isLoading() ? "Creating…" : "Create organization" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class NewOrgComponent {
  protected orgStore = inject(OrgContextStore);
  private router = inject(Router);

  protected readonly model = signal({ name: '', slug: '' });
  protected readonly newOrgForm = form(this.model, (s) => {
    required(s.name);
    required(s.slug);
  });
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const derived = this.model().name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (this.model().slug === derived) return;
      this.model.update(m => ({ ...m, slug: derived }));
    });
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.newOrgForm().invalid()) return;
    this.isLoading.set(true);
    this.error.set(null);

    const result = await this.orgStore.createOrg(this.model().name, this.model().slug);
    this.isLoading.set(false);

    if (result.error) {
      this.error.set((result.error as { message?: string }).message ?? "Failed to create organization");
      return;
    }

    void this.router.navigate(["/orgs", this.model().slug, "dashboard"]);
  }
}
