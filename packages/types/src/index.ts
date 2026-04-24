// Shared DTOs and types between apps/api and apps/web

// ─── Pagination ───────────────────────────────────────────────────────────────

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PaginationQuery = {
  page?: number;
  pageSize?: number;
};

// ─── API Response ─────────────────────────────────────────────────────────────

export type ApiResponse<T = void> = {
  data: T;
  message?: string;
};

export type ApiError = {
  statusCode: number;
  message: string;
  error?: string;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin";
export type OrgRole = "member" | "admin" | "owner";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole | null;
};

// ─── Organization ─────────────────────────────────────────────────────────────

export type OrgPlan = "free" | "pro" | "ultra";

export type OrgSubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete";

export type OrgSubscription = {
  id: string;
  plan: OrgPlan;
  status: OrgSubscriptionStatus | null;
  periodStart: string | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean | null;
  seats: number | null;
};

export type OrgInvoice = {
  id: string;
  number: string | null;
  status: string | null;
  amountPaid: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  hostedInvoiceUrl: string | null;
  pdfUrl: string | null;
};

export type BillingPlanPublic = {
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  isPopular?: boolean;
  limits: { projects: number; storage: number; members: number };
};

export type CreateCheckoutRequest = { plan: "pro" | "ultra"; interval: "monthly" | "yearly" };
export type CheckoutResponse = { url: string };
export type PortalResponse = { url: string };

// ─── Admin ────────────────────────────────────────────────────────────────────

export type AdminStats = {
  userCount: number;
  orgCount: number;
  mrr: number;
  activeSubscriptions: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  createdAt: Date | string;
  image: string | null;
};

export type AdminUserDetail = AdminUser & {
  banReason: string | null;
  updatedAt: Date | string;
  _count: { members: number };
};

export type AdminOrg = {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  email: string | null;
  createdAt: Date | string;
  memberCount: number;
  subscription: OrgSubscription | null;
};

export type AdminOrgMember = {
  id: string;
  role: string;
  createdAt: Date | string;
  user: { id: string; name: string; email: string; image: string | null };
};

export type AdminOrgDetail = AdminOrg & {
  members: AdminOrgMember[];
};

export type FeedbackStatus = "new" | "read" | "archived";

export type AdminFeedback = {
  id: string;
  review: number;
  message: string;
  email: string | null;
  status: FeedbackStatus;
  userId: string | null;
  user: { id: string; name: string; email: string } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
