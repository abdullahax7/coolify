"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyCard } from '@/components/home/PropertyCard';
import { type Property } from '@/data/properties';
import styles from './properties.module.css';

type ListingType = 'All' | 'Sale' | 'Rent';
type SectorType = 'All' | 'Residential' | 'Commercial';

const PAGE_SIZE = 12;

interface PropertiesClientProps {
  initialProperties: Property[];
}

export default function PropertiesClient({ initialProperties }: PropertiesClientProps) {
  const searchParams = useSearchParams();

  const [listingType, setListingType] = useState<ListingType>(() => (searchParams.get('listingType') as ListingType) || 'All');
  const [sector, setSector] = useState<SectorType>(() => (searchParams.get('sector') as SectorType) || 'All');
  const [sortBy, setSortBy] = useState('Newest Listed');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('location') || '');
  const [minPrice] = useState(() => searchParams.get('minPrice') || '');
  const [maxPrice] = useState(() => searchParams.get('maxPrice') || '');
  const [page, setPage] = useState(1);

  const filteredProperties = useMemo(() => {
    return initialProperties
      .filter((prop: Property) => {
        const matchesType =
          listingType === 'All' ||
          (prop.listingType ?? '').toLowerCase() === listingType.toLowerCase();
        
        const matchesSector =
          sector === 'All' ||
          (prop.sector ?? '').toLowerCase() === sector.toLowerCase();

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          !searchQuery || 
          (prop.title ?? '').toLowerCase().includes(searchLower) ||
          (prop.location ?? '').toLowerCase().includes(searchLower) ||
          (prop.description ?? '').toLowerCase().includes(searchLower) ||
          (prop.type ?? '').toLowerCase().includes(searchLower);

        // Price filtering
        const priceValue = parseInt(String(prop.price ?? '0').replace(/[^0-9]/g, '')) || 0;
        const matchesMin = !minPrice || priceValue >= (parseInt(minPrice.replace(/[^0-9]/g, '')) || 0);
        const matchesMax = !maxPrice || priceValue <= (parseInt(maxPrice.replace(/[^0-9]/g, '')) || 0);

        return matchesType && matchesSector && matchesSearch && matchesMin && matchesMax;
      })
      .sort((a: Property, b: Property) => {
        if (sortBy === 'Price: High to Low') {
          const priceA = parseInt(String(a.price ?? '0').replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(String(b.price ?? '0').replace(/[^0-9]/g, '')) || 0;
          return priceB - priceA;
        }
        if (sortBy === 'Price: Low to High') {
          const priceA = parseInt(String(a.price ?? '0').replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(String(b.price ?? '0').replace(/[^0-9]/g, '')) || 0;
          return priceA - priceB;
        }
        if (sortBy === 'Bedrooms: High to Low') {
          return (b.beds ?? 0) - (a.beds ?? 0);
        }
        if (sortBy === 'Area: Largest First') {
          return (b.sqft ?? 0) - (a.sqft ?? 0);
        }
        if (sortBy === 'Newest Listed') {
          // Fallback to ID comparison if date isn't available, or assuming higher ID is newer
          return b.id.localeCompare(a.id);
        }
        return 0;
      });
  }, [initialProperties, listingType, sector, sortBy, searchQuery, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PAGE_SIZE));
  // Reset to page 1 whenever filters/sort change the result set.
  useEffect(() => { setPage(1); }, [listingType, sector, sortBy, searchQuery, minPrice, maxPrice]);
  // Clamp if the underlying list shrinks below the current page.
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const pagedProperties = useMemo(
    () => filteredProperties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredProperties, page],
  );

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Compact page-number list with ellipses (e.g. 1 … 4 5 6 … 12).
  const pageNumbers = useMemo<(number | 'ellipsis')[]>(() => {
    const result: (number | 'ellipsis')[] = [];
    const windowSize = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - windowSize && i <= page + windowSize)
      ) {
        result.push(i);
      } else if (result[result.length - 1] !== 'ellipsis') {
        result.push('ellipsis');
      }
    }
    return result;
  }, [page, totalPages]);

  return (
    <section className={styles.content}>
      <div className={styles.container}>
        <div className={styles.filterSection}>
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

          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="Search by location, title, or type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

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
                <option>Newest Listed</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
                <option>Bedrooms: High to Low</option>
                <option>Area: Largest First</option>
              </select>
            </div>
          </div>

          <div className={styles.grid}>
            {pagedProperties.map((prop: Property) => (
              <PropertyCard
                key={prop.id}
                id={prop.id}
                image={
                  prop.image
                    ? prop.image
                    : (Array.isArray(prop.gallery) && prop.gallery.length > 0
                        ? prop.gallery[0]
                        : '/images/prop_1.png')
                }
                title={prop.title ?? ''}
                location={prop.location ?? ''}
                price={prop.price ?? ''}
                beds={prop.beds ?? 0}
                baths={prop.baths ?? 0}
                sqft={prop.sqft ?? 0}
                type={prop.type ?? ''}
                isUnavailable={(prop as Property & { isUnavailable?: boolean }).isUnavailable}
              />
            ))}
          </div>

          {filteredProperties.length > PAGE_SIZE && (
            <nav className={styles.pagination} aria-label="Properties pagination">
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                ‹ Prev
              </button>
              {pageNumbers.map((n, idx) =>
                n === 'ellipsis' ? (
                  <span key={`e-${idx}`} className={styles.pageEllipsis} aria-hidden>…</span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ''}`}
                    onClick={() => goToPage(n)}
                    aria-current={n === page ? 'page' : undefined}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                Next ›
              </button>
            </nav>
          )}

          {filteredProperties.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid var(--border-light)' }}>
              <h3 style={{ color: 'var(--foreground)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                {initialProperties.length === 0 ? 'No live listings yet' : 'No properties match your filters'}
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                {initialProperties.length === 0
                  ? 'New properties are added every week. Check back soon or browse our services in the meantime.'
                  : 'Try widening your search, removing some filters, or browsing the full portfolio.'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {initialProperties.length > 0 && (
                  <button
                    onClick={() => {
                      setListingType('All');
                      setSector('All');
                      setSearchQuery('');
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: '#3b82f6',
                      color: '#fff',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                    }}
                  >
                    Clear filters
                  </button>
                )}
                <a
                  href="/contact"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Speak to an agent
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

