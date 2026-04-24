import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP, lastLoginMethod, organization } from "better-auth/plugins";
import { PrismaService } from "../prisma/prisma.service";
import { ac, roles } from "./auth-permissions";

const generateSlug = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.random().toString(36).slice(2, 7)}`;

export function createAuth(prisma: PrismaService) {
  const socialProviders: Parameters<typeof betterAuth>[0]["socialProviders"] = {};

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }

  return betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET ?? "change-me-in-production",
    trustedOrigins: (process.env.TRUSTED_ORIGINS ?? "http://localhost:4200").split(","),
    session: {
      expiresIn: 60 * 60 * 24 * 20,      // 20 days
      updateAge: 60 * 60 * 24 * 7,        // refresh every 7 days
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,                    // 5 min local cache
      },
    },
    advanced: {
      cookiePrefix: "ngcorekit",
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
    },
    socialProviders,
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            const emailName = user.email.split("@")[0]?.slice(0, 8) ?? "user";
            try {
              // Auto-create personal org after sign-up
              await auth.api.createOrganization({
                body: {
                  name: `${emailName}'s workspace`,
                  slug: generateSlug(emailName),
                  userId: user.id,
                  keepCurrentActiveOrganization: false,
                },
              });
            } catch {
              // Non-blocking
            }
          },
        },
      },
    },
    plugins: [
      organization({
        ac,
        roles,
        organizationLimit: 5,
        membershipLimit: 10,
        autoCreateOrganizationOnSignUp: true,
        async sendInvitationEmail({ id, email }) {
          // TODO Phase 6: send email via MailService
          console.warn(`[Auth] Invitation for ${email}: /orgs/accept-invitation/${id}`);
        },
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
          // TODO Phase 6: send email via MailService
          console.warn(`[Auth] OTP for ${email}: ${otp}`);
        },
      }),
      admin({}),
      lastLoginMethod({}),
    ],
  });
}

// Type alias for the auth instance
export type AuthInstance = ReturnType<typeof createAuth>;
// Lazy singleton — set after PrismaService is available
let auth: AuthInstance;
export const getAuth = () => auth;
export const setAuth = (instance: AuthInstance) => {
  auth = instance;
};
