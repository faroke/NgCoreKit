import { Controller, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class SeoController {
  @Get('sitemap.xml')
  @Public()
  @Header('Content-Type', 'application/xml')
  sitemap(@Res() res: Response) {
    const baseUrl = process.env['APP_URL'] ?? 'https://ngcorekit.dev';

    const routes = [
      '',
      '/posts',
      '/posts/getting-started-with-ngcorekit',
      '/posts/multi-tenant-architecture-explained',
      '/posts/stripe-billing-integration',
      '/docs/introduction',
      '/docs/installation',
      '/docs/project-structure',
      '/changelog',
      '/changelog/v1-2-0',
      '/changelog/v1-1-0',
      '/changelog/v1-0-0',
      '/about',
      '/contact',
      '/legal/privacy',
      '/legal/terms',
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

    res.send(xml);
  }

  @Get('robots.txt')
  @Public()
  @Header('Content-Type', 'text/plain')
  robots(@Res() res: Response) {
    const baseUrl = process.env['APP_URL'] ?? 'https://ngcorekit.dev';

    const content = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;

    res.send(content);
  }
}
