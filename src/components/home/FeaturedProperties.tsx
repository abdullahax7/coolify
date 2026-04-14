"use client";

import React from 'react';
import Link from 'next/link';
import { PropertyCard } from './PropertyCard';
import { Button } from '../common/Button';
import { PROPERTIES } from '@/data/properties';
import styles from './FeaturedProperties.module.css';

export const FeaturedProperties: React.FC = () => {
  const featured = PROPERTIES.slice(0, 3);

  if (featured.length === 0) return null;

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
              image={Array.isArray(prop.gallery) && prop.gallery.length > 0 ? prop.gallery[0] : prop.image}
              title={prop.title}
              location={prop.location}
              price={prop.price}
              beds={prop.beds}
              baths={prop.baths}
              sqft={prop.sqft}
              type={prop.type}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
