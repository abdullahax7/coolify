import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PropertyDetailClient from './PropertyDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getPropertyData(id: string) {
  const supabase = await createClient();
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
    mapEmbedUrl: prop.map_embed_url,
  };

  const formattedAll = (all ?? []).map((p: any) => ({
    ...p,
    image: p.image_url,
    gallery: p.gallery_urls 
      ? (Array.isArray(p.gallery_urls) ? p.gallery_urls : String(p.gallery_urls).split('|DELIM|').map(s => s.trim()).filter(Boolean)) 
      : [],
  }));

  return { property: formattedProp, allProperties: formattedAll };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getPropertyData(id);

  if (!data) return { title: 'Property Not Found' };

  return {
    title: `${data.property.title} in ${data.property.location}`,
    description: data.property.description?.slice(0, 160) || `Check out this amazing ${data.property.type} at ${data.property.location}.`,
    openGraph: {
      title: data.property.title,
      description: data.property.description,
      images: [data.property.image_url].filter(Boolean),
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getPropertyData(id);

  if (!data) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              "name": data.property.title,
              "description": data.property.description,
              "url": `https://property-trader1.co.uk/properties/${id}`,
              "image": data.property.image_url,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": data.property.location
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Properties",
                  "item": "https://property-trader1.co.uk/properties"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": data.property.title,
                  "item": `https://property-trader1.co.uk/properties/${id}`
                }
              ]
            }
          ])
        }}
      />
      <PropertyDetailClient property={data.property} allProperties={data.allProperties} />
    </>
  );
}
