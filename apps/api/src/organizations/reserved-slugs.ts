export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "auth",
  "app",
  "blog",
  "dashboard",
  "docs",
  "help",
  "login",
  "logout",
  "new",
  "orgs",
  "pricing",
  "settings",
  "sign-in",
  "sign-out",
  "sign-up",
  "status",
  "support",
  "www",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2 && slug.length <= 48;
}
