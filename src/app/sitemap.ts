import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://property-trader1.co.uk';

  // Base routes
  const routes = [
    '',
    '/properties',
    '/pricing',
    '/services',
    '/contact',
    '/about',
    '/we-buy-any-house',
    '/tools',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic property routes
  try {
    const res = await fetch(`${baseUrl}/api/properties/custom`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const propertyRoutes = (data.properties ?? []).map((prop: { id: string; created_at?: string }) => ({
      url: `${baseUrl}/properties/${prop.id}`,
      lastModified: new Date(prop.created_at || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));

    return [...routes, ...propertyRoutes];
  } catch {
    return routes;
  }
}
