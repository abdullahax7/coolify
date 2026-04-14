"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/home/PropertyCard';
import { PROPERTIES as allProperties } from '@/data/properties';
import styles from './properties.module.css';

type ListingType = 'All' | 'Sale' | 'Rent';
type SectorType = 'All' | 'Residential' | 'Commercial';

export default function PropertiesPage() {
  const [listingType, setListingType] = useState<ListingType>('All');
  const [sector, setSector] = useState<SectorType>('All');
  const [sortBy, setSortBy] = useState('Price: High to Low');
  const properties = allProperties;
  const loadingProps = false;

  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop: any) => {
        const matchesType =
          listingType === 'All' ||
          (prop.listing_type ?? prop.listingType ?? '').toLowerCase() === listingType.toLowerCase();
        const matchesSector =
          sector === 'All' ||
          (prop.sector ?? '').toLowerCase() === sector.toLowerCase();
        return matchesType && matchesSector;
      })
      .sort((a: any, b: any) => {
        const priceA = parseInt(String(a.price ?? '0').replace(/[^0-9]/g, '')) || 0;
        const priceB = parseInt(String(b.price ?? '0').replace(/[^0-9]/g, '')) || 0;
        if (sortBy === 'Price: High to Low') return priceB - priceA;
        if (sortBy === 'Price: Low to High') return priceA - priceB;
        return 0;
      });
  }, [properties, listingType, sector, sortBy]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.badge}>Exclusive Collection</div>
            <h1>The <span>Property Portfolio</span></h1>
            <p className={styles.subtitle}>Handpicked luxury residences managed to the highest global standards.</p>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.container}>
            {/* Primary Listing Type Tabs */}
            <div className={styles.categoryTabs}>
              {(['All', 'Sale', 'Rent'] as ListingType[]).map((type) => (
                <button
                  key={type}
                  className={`${styles.tab} ${listingType === type ? styles.activeTab : ''}`}
                  onClick={() => setListingType(type)}
                >
                  {type === 'All' ? 'View All Listings' : `For ${type}`}
                </button>
              ))}
            </div>

            {/* Secondary Sector Filters */}
            <div className={styles.subFilters}>
              {(['All', 'Residential', 'Commercial'] as SectorType[]).map((s) => (
                <button
                  key={s}
                  className={`${styles.subFilter} ${sector === s ? styles.activeSub : ''}`}
                  onClick={() => setSector(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <p>Displaying <span>{filteredProperties.length}</span> curated properties</p>
                <div className={styles.sort}>
                  <label>Order by:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option>Price: High to Low</option>
                    <option>Price: Low to High</option>
                  </select>
                </div>
              </div>

              {loadingProps ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                  Loading properties...
                </div>
              ) : (
                <div className={styles.grid}>
                  {filteredProperties.map((prop: any) => (
                    <PropertyCard
                      key={prop.id}
                      id={prop.id}
                      image={
                        Array.isArray(prop.images) && prop.images.length > 0
                          ? prop.images[0]
                          : prop.image ?? '/placeholder-property.jpg'
                      }
                      title={prop.title ?? ''}
                      location={prop.location ?? ''}
                      price={prop.price ?? ''}
                      beds={prop.beds ?? prop.bedrooms ?? 0}
                      baths={prop.baths ?? prop.bathrooms ?? 0}
                      sqft={prop.sqft ?? 0}
                      type={prop.type ?? prop.property_type ?? ''}
                    />
                  ))}
                </div>
              )}

              {!loadingProps && filteredProperties.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0', borderTop: '1px solid var(--border-light)' }}>
                   <h3 style={{ color: 'var(--text-muted)' }}>No properties match your exact criteria.</h3>
                   <p>Try adjusting your sector or listing filters.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
