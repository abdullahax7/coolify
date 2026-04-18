"use client";

import React from 'react';
import Link from 'next/link';
import { PropertyCard } from './PropertyCard';
import { Button } from '../common/Button';
import styles from './FeaturedProperties.module.css';

interface FeaturedProperty {
  id: string;
  gallery_urls?: string | string[];
  image_url?: string;
  title: string;
  location: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  type: string;
}

export const FeaturedProperties: React.FC = () => {
  const [featured, setFeatured] = React.useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/properties/custom')
      .then(res => res.json())
      .then(data => {
        const properties = data.properties ?? [];
        setFeatured(properties.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!loading && featured.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>FEATURED <span>PROPERTIES</span></h2>
            <p className={styles.subtitle}>Handpicked premium listings in prime locations.</p>
          </div>
          <Link href="/properties">
            <Button variant="outline">View All Properties</Button>
          </Link>
        </div>

        <div className={styles.grid}>
          {featured.map((prop) => (
            <PropertyCard
              key={prop.id}
              id={prop.id}
              image={(() => {
                if (prop.gallery_urls) {
                  const list = Array.isArray(prop.gallery_urls) ? prop.gallery_urls : prop.gallery_urls.split('|DELIM|').filter(Boolean);
                  if (list.length > 0) return list[0];
                }
                return prop.image_url || '/placeholder-property.jpg';
              })()}
              title={prop.title}
              location={prop.location}
              price={prop.price}
              beds={parseInt(prop.beds) || 0}
              baths={parseInt(prop.baths) || 0}
              sqft={parseInt(prop.sqft) || 0}
              type={prop.type}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
