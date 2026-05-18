import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase/server';

export const revalidate = 3600;

const baseUrl = 'https://pt1.co.uk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/we-buy-any-house`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact/landlord-application`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/legal/privacy-notice-landlord`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/fair-processing-notice`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/terms-and-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/data-protection-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/complaints-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/tenants-fees`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/blog/brexit-right-to-rent`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/blog/best-roofs-wales-england`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/blog/property-trader-strategy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const supabase = await createStaticClient();

    // Try with deleted_at filter (post-migration). Fall back if column missing.
    const withSoftDelete = await supabase
      .from('custom_properties')
      .select('id, created_at, updated_at')
      .eq('is_approved', true)
      .is('deleted_at', null)
      .or(`expires_at.is.null,expires_at.gt.${now.toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(5000);

    const data = withSoftDelete.error
      ? (await supabase
          .from('custom_properties')
          .select('id, created_at, updated_at')
          .eq('is_approved', true)
          .or(`expires_at.is.null,expires_at.gt.${now.toISOString()}`)
          .order('created_at', { ascending: false })
          .limit(5000)
        ).data
      : withSoftDelete.data;

    const propertyRoutes: MetadataRoute.Sitemap = (data ?? []).map((p: { id: string; created_at?: string; updated_at?: string }) => ({
      url: `${baseUrl}/properties/${p.id}`,
      lastModified: new Date(p.updated_at || p.created_at || now),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [...staticRoutes, ...propertyRoutes];
  } catch {
    return staticRoutes;
  }
}
