import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ListingBenefits } from '@/components/listing/ListingBenefits';
import { PropertyFAQ } from '@/components/listing/PropertyFAQ';
import { PROPERTIES, type Property } from '@/data/properties';
import { createClient } from '@/lib/supabase/server';
import PropertiesClient from './PropertiesClient';
import styles from './properties.module.css';

async function fetchCustomProperties(): Promise<Property[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('custom_properties')
      .select('*')
      .order('created_at', { ascending: false });
    return (data ?? []).map((p: Record<string, unknown>) => ({
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
      image: (p.image_url as string) || '/placeholder-property.jpg',
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
      mapEmbedUrl: (p.map_embed_url as string) ?? '',
      description: (p.description as string) ?? '',
      detailedInfo: { interior: '', exterior: '', neighbourhood: '' },
      amenities: [],
      agent: { name: '', role: '', image: '', phone: '' },
    }));
  } catch {
    return [];
  }
}

export default async function PropertiesPage() {
  const customProperties = await fetchCustomProperties();
  const allProperties: Property[] = [...PROPERTIES, ...customProperties];

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroLayout}>
              <div className={styles.heroText}>
                <div className={styles.badge}>Exclusive Collection</div>
                <h1>The <span>Property Portfolio</span></h1>
                <p className={styles.subtitle}>Handpicked luxury residences managed to the highest global standards.</p>
              </div>
              <div className={styles.heroImage}>
                <Image
                  src="/properties_hero_new.png"
                  alt="House illustration"
                  width={550}
                  height={450}
                  className={styles.heroIllustration}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <PropertiesClient initialProperties={allProperties} />

        <ListingBenefits />
        <PropertyFAQ />
      </main>

      <Footer />
    </div>
  );
}
