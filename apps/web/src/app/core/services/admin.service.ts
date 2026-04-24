import { Injectable, inject } from "@angular/core";
import { ApiService } from "./api.service";
import type {
  AdminStats,
  AdminUser,
  AdminUserDetail,
  AdminOrg,
  AdminOrgDetail,
  AdminFeedback,
  PaginatedResponse,
} from "@ngcorekit/types";

export type AdminListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type FeedbackListParams = {
  page?: number;
  limit?: number;
  status?: string;
};

@Injectable({ providedIn: "root" })
export class AdminService {
  private api = inject(ApiService);

  // ── Analytics ──────────────────────────────────────────────────────────────
  getStats() {
    return this.api.get<{ data: AdminStats }>("/admin/analytics/stats");
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers(params: AdminListParams = {}) {
    const { page = 1, limit = 20, search } = params;
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) qs.set("search", search);
    return this.api.get<PaginatedResponse<AdminUser>>(`/admin/users?${qs}`);
  }

  getUser(id: string) {
    return this.api.get<{ data: AdminUserDetail }>(`/admin/users/${id}`);
  }

  deleteUser(id: string) {
    return this.api.delete<{ data: null }>(`/admin/users/${id}`);
  }

  impersonateUser(id: string) {
    return this.api.post<unknown>(`/admin/users/${id}/impersonate`, {});
  }

  stopImpersonating() {
    return this.api.post<unknown>("/admin/users/stop-impersonating", {});
  }

  // ── Organizations ──────────────────────────────────────────────────────────
  getOrgs(params: AdminListParams = {}) {
    const { page = 1, limit = 20, search } = params;
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) qs.set("search", search);
    return this.api.get<PaginatedResponse<AdminOrg>>(`/admin/organizations?${qs}`);
  }

  getOrg(id: string) {
    return this.api.get<{ data: AdminOrgDetail }>(`/admin/organizations/${id}`);
  }

  updateOrg(id: string, dto: { name?: string; metadata?: string }) {
    return this.api.patch<{ data: AdminOrg }>(`/admin/organizations/${id}`, dto);
  }

  removeOrgMember(orgId: string, memberId: string) {
    return this.api.delete<{ data: null }>(
      `/admin/organizations/${orgId}/members/${memberId}`,
    );
  }

  // ── Feedback ───────────────────────────────────────────────────────────────
  getFeedbackList(params: FeedbackListParams = {}) {
    const { page = 1, limit = 20, status } = params;
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) qs.set("status", status);
    return this.api.get<PaginatedResponse<AdminFeedback>>(`/admin/feedback?${qs}`);
  }

  getFeedback(id: string) {
    return this.api.get<{ data: AdminFeedback }>(`/admin/feedback/${id}`);
  }

  updateFeedback(id: string, dto: { status: "new" | "read" | "archived" }) {
    return this.api.patch<{ data: AdminFeedback }>(`/admin/feedback/${id}`, dto);
  }
}
