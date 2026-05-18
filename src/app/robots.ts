import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/pt-console/',
          '/dashboard/',
          '/api/',
          '/checkout/',
          '/forgot-password',
          '/login',
          '/register',
          '/forms/preview',
          '/forms/RHW',
          '/*?*sort=',
          '/*?*page=',
          '/*?*filter=',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
    ],
    sitemap: 'https://pt1.co.uk/sitemap.xml',
    host: 'https://pt1.co.uk',
  };
}
