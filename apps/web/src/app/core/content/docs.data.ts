import type { Doc } from './content.types';

export const DOCS: Doc[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    order: 1,
    section: 'Getting Started',
    content: `
      <h1>Introduction to NgCoreKit</h1>
      <p>NgCoreKit is a production-ready Angular 21 and NestJS 11 monorepo boilerplate for building SaaS applications. It ships with everything you need to go from zero to production:</p>
      <ul>
        <li><strong>Authentication</strong> — Better Auth with email/password, magic links, and OAuth providers</li>
        <li><strong>Multi-tenancy</strong> — Organization-scoped routes with role-based access control</li>
        <li><strong>Billing</strong> — Full Stripe integration with checkout, webhooks, and customer portal</li>
        <li><strong>Admin Panel</strong> — User and organization management with impersonation</li>
        <li><strong>Type Safety</strong> — Shared types package, strict TypeScript throughout</li>
      </ul>
      <h2>Architecture</h2>
      <p>The monorepo is managed with Turborepo and pnpm workspaces. The two main applications are:</p>
      <ul>
        <li><code>apps/api</code> — NestJS REST API with Prisma ORM and PostgreSQL</li>
        <li><code>apps/web</code> — Angular 21 SPA with TailwindCSS v4 and NgRx SignalStore</li>
      </ul>
      <h2>Philosophy</h2>
      <p>NgCoreKit is opinionated but not restrictive. It provides a solid foundation with clear conventions so your team can move fast without making architectural decisions from scratch.</p>
    `,
    next: { slug: 'installation', title: 'Installation' },
  },
  {
    slug: 'installation',
    title: 'Installation',
    order: 2,
    section: 'Getting Started',
    content: `
      <h1>Installation</h1>
      <p>Follow these steps to set up NgCoreKit on your local machine.</p>
      <h2>Requirements</h2>
      <ul>
        <li>Node.js 20+</li>
        <li>pnpm 9+</li>
        <li>Docker and Docker Compose</li>
        <li>A Stripe account (for billing features)</li>
      </ul>
      <h2>Clone and Install</h2>
      <pre><code>git clone https://github.com/your-org/ngcorekit
cd ngcorekit
pnpm install</code></pre>
      <h2>Environment Variables</h2>
      <p>Copy the example environment files and fill in your values:</p>
      <pre><code>cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env</code></pre>
      <h2>Database Setup</h2>
      <pre><code>docker compose up -d
cd apps/api
pnpm prisma:migrate
pnpm prisma:seed</code></pre>
      <h2>Start Development</h2>
      <pre><code>pnpm dev</code></pre>
      <p>The Angular app runs on <code>http://localhost:4200</code> and the API on <code>http://localhost:3001</code>.</p>
    `,
    prev: { slug: 'introduction', title: 'Introduction' },
    next: { slug: 'project-structure', title: 'Project Structure' },
  },
  {
    slug: 'project-structure',
    title: 'Project Structure',
    order: 3,
    section: 'Getting Started',
    content: `
      <h1>Project Structure</h1>
      <p>Understanding the monorepo layout will help you navigate the codebase and add new features efficiently.</p>
      <h2>Top-Level Layout</h2>
      <pre><code>NgCoreKit/
├── apps/
│   ├── api/          # NestJS API
│   └── web/          # Angular SPA
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared ESLint + TS configs
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml</code></pre>
      <h2>API Structure (apps/api/src/)</h2>
      <pre><code>src/
├── auth/             # Better Auth integration + guards + decorators
├── organizations/    # Multi-tenant org management
├── billing/          # Stripe billing
├── feedback/         # User feedback collection
├── admin/            # Admin panel endpoints
├── support/          # Support ticket handling
├── seo/              # Sitemap + robots.txt
└── prisma/           # PrismaService + PrismaModule</code></pre>
      <h2>Web Structure (apps/web/src/app/)</h2>
      <pre><code>app/
├── core/             # Services, guards, auth, content
├── layouts/          # App, public, admin layout shells
├── pages/            # Route-level page components
├── components/       # Reusable UI components
└── features/         # Feature-specific logic (dialog, feedback, changelog)</code></pre>
    `,
    prev: { slug: 'installation', title: 'Installation' },
  },
];
