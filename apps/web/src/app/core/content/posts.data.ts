import type { Post } from './content.types';

export const POSTS: Post[] = [
  {
    slug: 'getting-started-with-ngcorekit',
    title: 'Getting Started with NgCoreKit',
    description: 'Learn how to set up NgCoreKit and build your first multi-tenant SaaS application in under 30 minutes.',
    date: '2026-04-20',
    category: 'Tutorial',
    readingTime: 8,
    content: `
      <h2>Introduction</h2>
      <p>NgCoreKit is a production-ready Angular and NestJS monorepo boilerplate designed to help developers ship SaaS applications faster. With authentication, multi-tenancy, billing, and an admin panel already built in, you can focus on what makes your product unique.</p>
      <h2>Prerequisites</h2>
      <p>Before you begin, make sure you have the following installed:</p>
      <ul>
        <li>Node.js 20 or later</li>
        <li>pnpm 9 or later</li>
        <li>Docker (for PostgreSQL)</li>
      </ul>
      <h2>Installation</h2>
      <p>Clone the repository and install dependencies:</p>
      <pre><code>git clone https://github.com/your-org/ngcorekit
cd ngcorekit
pnpm install</code></pre>
      <h2>Running the Development Server</h2>
      <p>Start the database and all services with a single command:</p>
      <pre><code>docker compose up -d
pnpm dev</code></pre>
      <p>Your Angular app will be available at <code>http://localhost:4200</code> and your NestJS API at <code>http://localhost:3001</code>.</p>
      <h2>Next Steps</h2>
      <p>Once you have the project running, explore the authentication flows, create an organization, and customize the billing plans to match your product's pricing.</p>
    `,
  },
  {
    slug: 'multi-tenant-architecture-explained',
    title: 'Multi-Tenant Architecture Explained',
    description: 'A deep dive into how NgCoreKit implements multi-tenancy using organization-scoped routes and NgRx SignalStore.',
    date: '2026-04-15',
    category: 'Architecture',
    readingTime: 12,
    content: `
      <h2>What is Multi-Tenancy?</h2>
      <p>Multi-tenancy is an architecture where a single instance of software serves multiple customers (tenants). Each tenant's data is isolated while sharing the same underlying infrastructure.</p>
      <h2>NgCoreKit's Approach</h2>
      <p>NgCoreKit uses organization-scoped routing. Every authenticated user belongs to one or more organizations, and the active organization context is stored in both the server session and the Angular <code>OrgContextStore</code>.</p>
      <h2>Route Structure</h2>
      <p>Organization-scoped routes follow the pattern <code>/orgs/:orgSlug/*</code>. The <code>orgGuard</code> resolves the organization from the slug, verifies membership, and sets the active organization before rendering the page.</p>
      <pre><code>// Example: /orgs/acme/dashboard
// orgGuard: resolves 'acme' → org object → sets OrgContextStore.activeOrg</code></pre>
      <h2>Data Isolation</h2>
      <p>On the API side, every query includes the organization ID to ensure data is scoped to the correct tenant. The <code>OrgGuard</code> attaches the resolved organization to the request object, making it available in all controllers.</p>
      <h2>Best Practices</h2>
      <p>When building features on top of NgCoreKit, always use the <code>@CurrentOrg()</code> decorator in your NestJS controllers to access the current organization context safely.</p>
    `,
  },
  {
    slug: 'stripe-billing-integration',
    title: 'Integrating Stripe Billing into Your SaaS',
    description: 'Step-by-step guide to configuring Stripe checkout sessions, webhooks, and customer portals with NgCoreKit.',
    date: '2026-04-08',
    category: 'Billing',
    readingTime: 10,
    content: `
      <h2>Overview</h2>
      <p>NgCoreKit includes a complete Stripe billing integration out of the box. This guide explains how to configure your Stripe account and customize the billing plans for your product.</p>
      <h2>Setting Up Stripe</h2>
      <p>First, create a Stripe account and obtain your API keys. Add them to your <code>.env</code> file:</p>
      <pre><code>STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...</code></pre>
      <h2>Customizing Plans</h2>
      <p>Edit <code>apps/api/src/billing/billing-plans.ts</code> to define your pricing tiers. Each plan includes a display name, description, price IDs, feature limits, and whether a free trial is available.</p>
      <h2>Webhook Handling</h2>
      <p>NgCoreKit's webhook controller at <code>POST /webhooks/stripe</code> handles checkout completion and subscription lifecycle events. The endpoint is public and verifies the Stripe signature before processing.</p>
      <h2>Testing</h2>
      <p>Use the Stripe CLI to forward webhooks to your local server during development:</p>
      <pre><code>pnpm stripe-webhooks</code></pre>
    `,
  },
];
