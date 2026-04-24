import type { ChangelogEntry } from './content.types';

export const CHANGELOGS: ChangelogEntry[] = [
  {
    slug: 'v1-2-0',
    version: 'v1.2.0',
    date: '2026-04-20',
    title: 'Marketing Pages and Content System',
    summary: 'Full marketing site with blog, docs, changelog timeline, feedback popover, and support module.',
    content: `
      <h2>New Features</h2>
      <ul>
        <li><strong>Content System</strong> — Static TypeScript content files for blog posts, docs, and changelogs with a ContentService for querying</li>
        <li><strong>Home Page Sections</strong> — Hero, features grid, bento layout, pain/solution, stats, testimonials, pricing, FAQ accordion, and final CTA</li>
        <li><strong>Blog</strong> — Post list with category badges, post detail with HTML rendering, and category filter pages</li>
        <li><strong>Docs</strong> — Sidebar navigation grouped by section, full doc pages with prev/next navigation</li>
        <li><strong>Changelog</strong> — Timeline layout, detail pages, and a ChangelogManagerStore tracking seen versions in localStorage</li>
        <li><strong>Legal Pages</strong> — Privacy policy and Terms of service placeholders</li>
        <li><strong>About &amp; Contact</strong> — Mission statement, team section, and contact form</li>
        <li><strong>404 and Error Pages</strong> — Custom not-found and generic error pages</li>
        <li><strong>Feedback Popover</strong> — Floating widget with star rating, message, and optional email; visible in the public layout</li>
        <li><strong>Support Dialog</strong> — Subject/message/email form that calls <code>POST /api/support</code></li>
        <li><strong>NestJS Support Module</strong> — <code>POST /api/support</code> public endpoint with validation</li>
        <li><strong>SEO Endpoints</strong> — <code>GET /sitemap.xml</code> and <code>GET /robots.txt</code> via SeoModule</li>
      </ul>
      <h2>Improvements</h2>
      <ul>
        <li>Public layout now includes LandingHeader and Footer components</li>
        <li>Authenticated users visiting public routes are redirected to <code>/orgs</code></li>
        <li>MetaService for setting page titles and Open Graph tags</li>
      </ul>
    `,
  },
  {
    slug: 'v1-1-0',
    version: 'v1.1.0',
    date: '2026-04-15',
    title: 'Admin Panel and Feedback System',
    summary: 'Complete admin dashboard with user management, organization oversight, feedback tracking, and impersonation.',
    content: `
      <h2>New Features</h2>
      <ul>
        <li><strong>Admin Panel</strong> — Dedicated admin layout at <code>/admin</code> protected by <code>adminGuard</code></li>
        <li><strong>Admin Dashboard</strong> — Stats cards showing total users, organizations, MRR, and active subscriptions</li>
        <li><strong>User Management</strong> — List with search and pagination; detail view with impersonation and delete actions</li>
        <li><strong>Organization Management</strong> — List with search; detail with subscription info and member removal</li>
        <li><strong>Feedback Management</strong> — List with status filter; detail with status update buttons</li>
        <li><strong>Impersonation</strong> — Admins can sign in as any user; impersonation banner visible in the main app layout</li>
        <li><strong>Feedback Module (API)</strong> — <code>POST /api/feedback</code> for authenticated and anonymous submissions</li>
      </ul>
      <h2>Bug Fixes</h2>
      <ul>
        <li>Fixed type annotation in <code>organizations.service.ts</code> that caused subscription data to be dropped</li>
        <li>Switched Angular app from <code>provideZoneChangeDetection</code> to <code>provideZonelessChangeDetection</code></li>
      </ul>
    `,
  },
  {
    slug: 'v1-0-0',
    version: 'v1.0.0',
    date: '2026-04-01',
    title: 'Initial Release',
    summary: 'First production-ready release with authentication, multi-tenancy, and Stripe billing.',
    content: `
      <h2>Initial Release</h2>
      <p>NgCoreKit v1.0.0 is the first stable release. It includes everything you need to start building a production SaaS application.</p>
      <h2>Included Features</h2>
      <ul>
        <li><strong>Authentication</strong> — Email/password sign-in and sign-up via Better Auth; session management with NgRx SignalStore</li>
        <li><strong>Multi-Tenancy</strong> — Organization creation and management; organization-scoped routes with membership RBAC</li>
        <li><strong>Stripe Billing</strong> — Checkout sessions, subscription management, customer portal, webhook handling</li>
        <li><strong>Monorepo</strong> — Turborepo + pnpm workspace with shared types and config packages</li>
        <li><strong>Database</strong> — PostgreSQL with Prisma ORM; multi-file schema</li>
        <li><strong>Developer Experience</strong> — Docker Compose, hot reload, Swagger API docs, Vitest unit tests, Playwright e2e</li>
      </ul>
    `,
  },
];
