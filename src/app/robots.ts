import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/pt-console/', '/dashboard/', '/api/'],
    },
    sitemap: 'https://property-trader1.co.uk/sitemap.xml',
  };
}
