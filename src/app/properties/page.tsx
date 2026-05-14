import Image from 'next/image';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ListingBenefits } from '@/components/listing/ListingBenefits';
import { PropertyFAQ } from '@/components/listing/PropertyFAQ';
import { PROPERTIES, type Property } from '@/data/properties';
import { createStaticClient } from '@/lib/supabase/server';
import { getPageContent } from '@/lib/getContent';
import PropertiesClient from './PropertiesClient';
import styles from './properties.module.css';

export const metadata = {
  title: 'Properties for Sale & Rent in the UK | Property Trader',
  description: 'Browse UK properties for sale and rent — flats, houses, apartments across England and Wales. Verified listings from Property Trader.',
  alternates: { canonical: '/properties' },
};

export const revalidate = 600; // Refresh properties every 10 minutes

async function fetchCustomProperties(): Promise<(Property & { isUnavailable?: boolean })[]> {
  try {
    const supabase = await createStaticClient();
    
    // Fetch properties
    const { data } = await supabase
      .from('custom_properties')
      .select('*')
      .eq('is_approved', true)
      .eq('status', 'Live')
      .order('created_at', { ascending: false });

    if (!data) return [];

    // Extract unique assigned emails
    const emails = Array.from(new Set(data.map((p: { assigned_to_email: string | null }) => p.assigned_to_email).filter(Boolean)));
    
    // Fetch roles for these emails
    const { data: profiles } = await supabase
      .from('profiles')
      .select('email, role')
      .in('email', emails);

    const tenantEmails = new Set(
      (profiles ?? [])
        .filter((pr: { role: string; email: string }) => pr.role === 'tenant')
        .map((pr: { email: string }) => pr.email)
    );

    return data.map((p: Record<string, unknown>) => ({
      id: p.id as string,
      title: p.title as string,
      location: p.location as string,
      price: p.price as string,
      beds: parseInt(String(p.beds ?? '0')) || 0,
      baths: parseInt(String(p.baths ?? '0')) || 0,
      sqft: parseInt(String(p.sqft ?? '0')) || 0,
      type: p.type as string,
      listingType: ((p.listingType ?? (p.type === 'Rent' ? 'Rent' : 'Sale')) as 'Sale' | 'Rent'),
      sector: ((p.sector ?? 'Residential') as 'Residential' | 'Commercial'),
      image: (p.image_url as string) || '/images/prop_1.png',
      gallery: p.gallery_urls
        ? (Array.isArray(p.gallery_urls)
            ? (p.gallery_urls as string[])
            : String(p.gallery_urls).split('|DELIM|').map((s: string) => s.trim()).filter(Boolean))
        : [],
      features: p.features
        ? (Array.isArray(p.features)
            ? (p.features as string[])
            : String(p.features).split(/[\n,]/).map((s: string) => s.trim()).filter(Boolean))
        : [],
      videoUrl: (p.video_url as string) ?? '',
      mapEmbedUrl: (p.map_embed_url as string) || (p.location ? `https://www.google.com/maps?q=${encodeURIComponent(p.location as string)}&output=embed` : ''),
      description: (p.description as string) ?? '',
      detailedInfo: { interior: '', exterior: '', neighbourhood: '' },
      amenities: [],
      agent: { name: '', role: '', image: '', phone: '' },
      isUnavailable: p.assigned_to_email ? tenantEmails.has(p.assigned_to_email as string) : false
    }));
  } catch (err) {
    console.error("Error fetching properties:", err);
    return [];
  }
}

export default async function PropertiesPage() {
  const customProperties = await fetchCustomProperties();
  const allProperties: Property[] = [...PROPERTIES, ...customProperties];

  const content = await getPageContent('properties', {
    benefit_1_title: 'Market Experts',
    benefit_1_desc: 'With our extensive knowledge of the property market...',
    benefit_2_title: 'Professional Services',
    benefit_2_desc: 'Sell or let quickly...',
    benefit_3_title: 'Fixed Fees',
    benefit_3_desc: 'No surprises and commission...',
    benefit_4_title: 'Seen by Thousands',
    benefit_4_desc: 'Get seen by millions...',
    benefit_5_title: 'Open 24/7',
    benefit_5_desc: 'We are here for you 24 hours a day...',
    benefit_6_title: 'Viewings',
    benefit_6_desc: 'You can host viewings whenever you want...',
    hero_image_url: '/propertybg.png'
  });

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero} aria-label="Property Trader portfolio">
          <Image
            src={content.hero_image_url || "/propertybg.png"}
            alt="Browse UK property listings — houses, flats and commercial property for sale and rent"
            width={1920}
            height={1280}
            className={styles.heroImg}
            sizes="100vw"
            priority
            fetchPriority="high"
          />
        </section>

        <Suspense fallback={<div className={styles.loading}>Loading Properties...</div>}>
          <PropertiesClient initialProperties={allProperties} />
        </Suspense>

        <ListingBenefits content={content} />
        <PropertyFAQ />
      </main>

      <Footer />
    </div>
  );
}
