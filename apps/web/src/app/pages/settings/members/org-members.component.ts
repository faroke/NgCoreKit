import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { FormField, form, required, email } from "@angular/forms/signals";
import { authClient } from "../../../core/auth/auth.client";
import { OrgContextStore } from "../../../core/stores/org-context.store";
import { DialogManagerStore } from "../../../features/dialog-manager/dialog-manager.store";

type Member = {
  id: string;
  role: string;
  userId: string;
  user: { name: string; email: string; image: string | null };
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-org-members",
  imports: [FormField],
  template: `
    <div class="p-6 max-w-2xl space-y-8">
      <div>
        <h2 class="text-xl font-semibold">Members</h2>
        <p class="text-sm text-muted-foreground mt-1">Manage who has access to this organization.</p>
      </div>

      <!-- Invite -->
      <div class="rounded-lg border bg-card p-4 space-y-3">
        <h3 class="text-sm font-medium">Invite a member</h3>
        <form (ngSubmit)="onInvite()" class="flex gap-2">
          <input
            type="email"
            [formField]="inviteForm.inviteEmail"
            placeholder="colleague@example.com"
            class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <select
            [formField]="inviteForm.inviteRole"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            [disabled]="inviteForm().invalid()"
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Invite
          </button>
        </form>
        @if (inviteForm.inviteEmail().touched() && inviteForm.inviteEmail().errors().some(e => e.kind === 'required')) {
          <p class="text-xs text-destructive mt-1">This field is required.</p>
        }
        @if (inviteForm.inviteEmail().touched() && inviteForm.inviteEmail().errors().some(e => e.kind === 'email')) {
          <p class="text-xs text-destructive mt-1">Enter a valid email address.</p>
        }
        @if (inviteError()) {
          <p class="text-sm text-destructive">{{ inviteError() }}</p>
        }
      </div>

      <!-- Members list -->
      <div class="space-y-2">
        @for (member of members(); track member.id) {
          <div class="flex items-center gap-3 rounded-lg border bg-card p-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium shrink-0">
              {{ member.user.name[0]?.toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ member.user.name }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ member.user.email }}</p>
            </div>
            <span class="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-full border">
              {{ member.role }}
            </span>
            @if (orgStore.activeOrg()?.role === "owner" || orgStore.activeOrg()?.role === "admin") {
              <button
                class="text-xs text-muted-foreground hover:text-destructive"
                (click)="confirmRemove(member)"
              >
                Remove
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class OrgMembersComponent implements OnInit {
  protected orgStore = inject(OrgContextStore);
  private dialogStore = inject(DialogManagerStore);

  protected members = signal<Member[]>([]);
  protected inviteError = signal<string | null>(null);

  protected readonly inviteModel = signal({ inviteEmail: '', inviteRole: 'member' });
  protected readonly inviteForm = form(this.inviteModel, (s) => {
    required(s.inviteEmail);
    email(s.inviteEmail, { message: 'Enter a valid email address.' });
  });

  async ngOnInit() {
    await this.loadMembers();
  }

  async loadMembers() {
    const org = this.orgStore.activeOrg();
    if (!org) return;
    const { data } = await authClient.organization.getFullOrganization({ query: { organizationId: org.id } });
    if (data?.members) {
      this.members.set(data.members as unknown as Member[]);
    }
  }

  async onInvite() {
    const org = this.orgStore.activeOrg();
    if (!org || this.inviteForm().invalid()) return;
    this.inviteError.set(null);
    const { error } = await authClient.organization.inviteMember({
      organizationId: org.id,
      email: this.inviteModel().inviteEmail,
      role: this.inviteModel().inviteRole as "member" | "admin",
    });
    if (error) {
      this.inviteError.set(error.message ?? "Failed to send invitation");
    } else {
      this.inviteModel.update(m => ({ ...m, inviteEmail: '' }));
    }
  }

  confirmRemove(member: Member) {
    this.dialogStore.confirm({
      title: "Remove member",
      description: `Remove ${member.user.name} from this organization?`,
      variant: "destructive",
      confirmLabel: "Remove",
      onConfirm: async () => {
        const org = this.orgStore.activeOrg();
        if (!org) return;
        await authClient.organization.removeMember({
          memberIdOrEmail: member.id,
          organizationId: org.id,
        });
        await this.loadMembers();
      },
    });
  }
}
