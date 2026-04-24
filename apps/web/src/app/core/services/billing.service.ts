import { Injectable, inject } from "@angular/core";
import { ApiService } from "./api.service";
import type {
  OrgSubscription,
  OrgInvoice,
  BillingPlanPublic,
  CreateCheckoutRequest,
  CheckoutResponse,
  PortalResponse,
} from "@ngcorekit/types";

@Injectable({ providedIn: "root" })
export class BillingService {
  private api = inject(ApiService);

  getSubscription(orgSlug: string) {
    return this.api.get<{ data: OrgSubscription | null }>(`/orgs/${orgSlug}/billing/subscription`);
  }

  getPlans(orgSlug: string) {
    return this.api.get<{ data: BillingPlanPublic[] }>(`/orgs/${orgSlug}/billing/plans`);
  }

  getInvoices(orgSlug: string) {
    return this.api.get<{ data: OrgInvoice[] }>(`/orgs/${orgSlug}/billing/invoices`);
  }

  createCheckout(orgSlug: string, body: CreateCheckoutRequest) {
    return this.api.post<CheckoutResponse>(`/orgs/${orgSlug}/billing/checkout`, body);
  }

  createPortal(orgSlug: string) {
    return this.api.post<PortalResponse>(`/orgs/${orgSlug}/billing/portal`, {});
  }
}
