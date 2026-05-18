import { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { createStaticClient } from '@/lib/supabase/server';
import PropertyDetailClient from './PropertyDetailClient';
import { type Property } from '@/data/properties';

export const revalidate = 1800; // 30 minutes

interface Props {
  params: Promise<{ id: string }>;
}

const SITE_URL = 'https://pt1.co.uk';

function parsePrice(raw?: string | number | null): { amount: number | null; currency: string } {
  if (raw === null || raw === undefined) return { amount: null, currency: 'GBP' };
  if (typeof raw === 'number') return { amount: raw, currency: 'GBP' };
  const cleaned = String(raw).replace(/[^\d.]/g, '');
  const n = parseFloat(cleaned);
  return { amount: Number.isFinite(n) ? n : null, currency: 'GBP' };
}

function splitLocation(loc?: string | null): { locality?: string; region?: string; country: string } {
  const parts = (loc || '').split(',').map(s => s.trim()).filter(Boolean);
  return {
    locality: parts[0],
    region: parts[1],
    country: 'GB',
  };
}

async function getPropertyData(id: string) {
  const supabase = await createStaticClient();
  const { data: prop } = await supabase.from('custom_properties').select('*').eq('id', id).single();
  const { data: all } = await supabase.from('custom_properties').select('*').limit(10);

  if (!prop) return null;

  const formattedProp = {
    ...prop,
    image: prop.image_url,
    gallery: prop.gallery_urls
      ? (Array.isArray(prop.gallery_urls) ? prop.gallery_urls : String(prop.gallery_urls).split('|DELIM|').map(s => s.trim()).filter(Boolean))
      : [],
    features: prop.features
      ? (Array.isArray(prop.features) ? prop.features : String(prop.features).split(/[\n,]/).map(s => s.trim()).filter(Boolean))
      : [],
    mapEmbedUrl: prop.map_embed_url || `https://www.google.com/maps?q=${encodeURIComponent(prop.location || '')}&output=embed`,
  };

  const formattedAll = (all ?? []).map((p: Record<string, unknown>) => {
    const row = p as {
      id: string; title?: string; location?: string; price?: string; type?: string;
      sector?: string; beds?: number; baths?: number; sqft?: number;
      image_url?: string; gallery_urls?: string[] | string;
      description?: string; features?: string[] | string; listing_type?: string
    };
    return {
      ...row,
      id: String(row.id ?? ''),
      title: String(row.title ?? ''),
      location: String(row.location ?? ''),
      price: String(row.price ?? ''),
      type: String(row.type ?? ''),
      sector: row.sector || 'Residential',
      beds: Number(row.beds) || 0,
      baths: Number(row.baths) || 0,
      sqft: Number(row.sqft) || 0,
      image: row.image_url || '',
      gallery: row.gallery_urls
        ? (Array.isArray(row.gallery_urls) ? row.gallery_urls : String(row.gallery_urls).split('|DELIM|').map(s => s.trim()).filter(Boolean))
        : [],
      description: row.description || '',
      features: row.features || [],
      listingType: row.listing_type || 'Sale',
      videoUrl: '',
      mapEmbedUrl: '',
      detailedInfo: { interior: '', exterior: '', neighbourhood: '' },
      amenities: [],
      agent: { name: 'Property Trader', role: 'Agent', image: '/images/logo.png', phone: '' }
    } as Property;
  });

  return { property: formattedProp, allProperties: formattedAll };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getPropertyData(id);

  if (!data) {
    return {
      title: 'Property Not Found',
      robots: { index: false, follow: false },
    };
  }

  const p = data.property;
  const { amount, currency } = parsePrice(p.price);
  const beds = Number(p.beds) || 0;
  const type = (p.type || 'Property').toString();
  const listingType = (p.listing_type || 'Sale').toString();
  const verb = /rent/i.test(listingType) ? 'to Rent' : 'for Sale';
  const locality = (p.location || '').split(',')[0]?.trim() || 'UK';
  const priceLabel = amount ? `£${amount.toLocaleString('en-GB')}` : (p.price || '');

  const titleHead = beds > 0
    ? `${beds} Bed ${type} ${verb} in ${locality}`
    : `${type} ${verb} in ${locality}`;
  const title = priceLabel
    ? `${titleHead} — ${priceLabel}`
    : titleHead;

  const baseDesc = p.description
    ? String(p.description).replace(/\s+/g, ' ').trim()
    : `${titleHead}. ${beds > 0 ? `${beds} bedrooms. ` : ''}${p.baths ? `${p.baths} bathrooms. ` : ''}${p.sqft ? `${p.sqft} sq ft. ` : ''}Listed by Property Trader.`;
  const description = baseDesc.length > 158 ? baseDesc.slice(0, 155) + '...' : baseDesc;

  const image = p.image_url || `${SITE_URL}/images/logo.png`;
  const canonical = `${SITE_URL}/properties/${id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Property Trader',
      locale: 'en_GB',
      type: 'website',
      images: [{ url: image, alt: titleHead }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'product:price:amount': amount ? String(amount) : '',
      'product:price:currency': currency,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getPropertyData(id);

  if (!data) notFound();

  const p = data.property;
  const { amount, currency } = parsePrice(p.price);
  const { locality, region, country } = splitLocation(p.location);
  const listingType = (p.listing_type || 'Sale').toString();
  const isRental = /rent/i.test(listingType);
  const images: string[] = ([
    p.image_url,
    ...(Array.isArray(p.gallery) ? p.gallery : []),
  ] as Array<string | undefined | null>).filter((s): s is string => typeof s === 'string' && s.length > 0);

  const propertySchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isRental ? "ApartmentComplex" : "SingleFamilyResidence",
    "name": p.title,
    "description": p.description,
    "url": `${SITE_URL}/properties/${id}`,
    "image": images.length ? images : undefined,
    "numberOfBedrooms": Number(p.beds) || undefined,
    "numberOfBathroomsTotal": Number(p.baths) || undefined,
    "floorSize": p.sqft ? { "@type": "QuantitativeValue", "value": Number(p.sqft), "unitCode": "FTK" } : undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": p.location,
      "addressLocality": locality,
      "addressRegion": region,
      "addressCountry": country,
    },
  };

  const offerSchema: Record<string, unknown> | null = amount ? {
    "@context": "https://schema.org",
    "@type": "Offer",
    "url": `${SITE_URL}/properties/${id}`,
    "price": amount,
    "priceCurrency": currency,
    "availability": "https://schema.org/InStock",
    "itemOffered": {
      "@type": isRental ? "ApartmentComplex" : "SingleFamilyResidence",
      "name": p.title,
    },
    "seller": { "@id": `${SITE_URL}/#organization` },
  } : null;

  const realEstateListing: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": p.title,
    "description": p.description,
    "url": `${SITE_URL}/properties/${id}`,
    "image": images.length ? images : undefined,
    "datePosted": p.created_at,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": p.location,
      "addressLocality": locality,
      "addressRegion": region,
      "addressCountry": country,
    },
    ...(amount ? { "offers": offerSchema } : {}),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Properties", "item": `${SITE_URL}/properties` },
      { "@type": "ListItem", "position": 3, "name": p.title, "item": `${SITE_URL}/properties/${id}` },
    ],
  };

  const ldJson = [realEstateListing, propertySchema, breadcrumbs].filter(Boolean);

  return (
    <>
      <Script
        id="property-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <PropertyDetailClient property={data.property} allProperties={data.allProperties} />
    </>
  );
}
