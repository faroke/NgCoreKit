import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { ApiService } from "../../../core/services/api.service";
import { OrgContextStore } from "../../../core/stores/org-context.store";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-org-details",
  imports: [FormField],
  template: `
    <div class="p-6 max-w-xl">
      <h2 class="text-xl font-semibold">Organization details</h2>

      @if (orgStore.activeOrg(); as org) {
        <form (submit)="onSubmit($event)" class="mt-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Name</label>
            <input
              type="text"
              [formField]="detailsForm.name"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            @if (detailsForm.name().touched() && detailsForm.name().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Slug</label>
            <input
              type="text"
              [formField]="detailsForm.slug"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            @if (detailsForm.slug().touched() && detailsForm.slug().errors().some(e => e.kind === 'required')) {
              <p class="text-xs text-destructive mt-1">This field is required.</p>
            }
          </div>
          @if (error()) {
            <p class="text-sm text-destructive">{{ error() }}</p>
          }
          @if (success()) {
            <p class="text-sm text-green-600">Saved successfully.</p>
          }
          <button
            type="submit"
            [disabled]="detailsForm().invalid() || isSaving()"
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {{ isSaving() ? "Saving…" : "Save changes" }}
          </button>
        </form>
      }
    </div>
  `,
})
export class OrgDetailsComponent {
  protected orgStore = inject(OrgContextStore);
  private api = inject(ApiService);

  protected readonly model = signal({
    name: this.orgStore.activeOrg()?.name ?? '',
    slug: this.orgStore.activeOrg()?.slug ?? '',
  });
  protected readonly detailsForm = form(this.model, (s) => {
    required(s.name);
    required(s.slug);
  });
  protected isSaving = signal(false);
  protected error = signal<string | null>(null);
  protected success = signal(false);

  async onSubmit(event: Event) {
    event.preventDefault();
    const org = this.orgStore.activeOrg();
    if (!org || this.detailsForm().invalid()) return;
    this.isSaving.set(true);
    this.error.set(null);
    this.success.set(false);
    try {
      await this.api.patch(`/orgs/${org.slug}`, { name: this.model().name, slug: this.model().slug });
      this.success.set(true);
      await this.orgStore.loadOrgs();
    } catch (e: unknown) {
      this.error.set((e as { message?: string }).message ?? "Failed to save");
    } finally {
      this.isSaving.set(false);
    }
  }
}
