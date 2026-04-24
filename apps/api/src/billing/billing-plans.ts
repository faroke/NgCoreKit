type HookCtx = { orgId: string };

export type BillingPlan = {
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  isPopular?: boolean;
  priceId?: string;
  annualPriceId?: string;
  limits: { projects: number; storage: number; members: number };
  freeTrial?: {
    days: number;
    onTrialStart?: (ctx: HookCtx) => Promise<void>;
    onTrialEnd?: (ctx: HookCtx) => Promise<void>;
    onTrialExpired?: (ctx: HookCtx) => Promise<void>;
  };
  onSubscriptionCanceled?: (ctx: HookCtx) => Promise<void>;
};

export const BILLING_PLANS: BillingPlan[] = [
  {
    name: "free",
    description: "For individuals and small teams getting started.",
    price: 0,
    yearlyPrice: 0,
    currency: "usd",
    limits: { projects: 5, storage: 10, members: 3 },
  },
  {
    name: "pro",
    description: "For growing teams that need more power.",
    price: 49,
    yearlyPrice: 400,
    currency: "usd",
    isPopular: true,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    annualPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? "",
    limits: { projects: 20, storage: 50, members: 10 },
    freeTrial: { days: 14 },
  },
  {
    name: "ultra",
    description: "For large teams and enterprises at scale.",
    price: 100,
    yearlyPrice: 1000,
    currency: "usd",
    priceId: process.env.STRIPE_ULTRA_PRICE_ID ?? "",
    annualPriceId: process.env.STRIPE_ULTRA_YEARLY_PRICE_ID ?? "",
    limits: { projects: 100, storage: 1000, members: 100 },
    freeTrial: { days: 14 },
  },
];

export function getPlanByName(name: string): BillingPlan | undefined {
  return BILLING_PLANS.find((p) => p.name === name);
}

export function getPlanByPriceId(priceId: string): BillingPlan | undefined {
  return BILLING_PLANS.find(
    (p) => p.priceId === priceId || p.annualPriceId === priceId,
  );
}
