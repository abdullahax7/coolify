"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../common/Button';
import styles from './Hero.module.css';

export const Hero: React.FC<{ content?: Record<string, string> }> = ({ content = {} }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [sector, setSector] = useState('Residential');
  const [listingType, setListingType] = useState('Sale');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (sector) params.append('sector', sector);
    if (listingType) params.append('listingType', listingType === 'Sale' ? 'Sale' : 'Rent');
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    
    window.location.href = `/properties?${params.toString()}`;
  };

  const sectorOptions = ['Residential', 'Commercial'];
  const typeOptions = ['Sale', 'Rent'];

  return (
    <section className={styles.hero}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.overlay} />
        <Image
          src={content.hero_image_url || "/uk_properties_hero_v2.png"}
          alt="Luxury UK property portfolio — featured listings across Wales and England"
          className={styles.bgImage}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={90}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.badge}>{content.hero_badge || 'Luxury Property Management'}</div>
        <h1 
          className={styles.title} 
          dangerouslySetInnerHTML={{ __html: content.hero_title || 'THE ULTIMATE PROPERTY STANDARD. <br /><span>LUXURY MANAGEMENT REDEFINED.</span>' }} 
        />
        <p className={styles.subtitle}>
          {content.hero_subtitle || "Stop settling for average. We provide elite property management for the world's most exclusive residences and the owners who demand excellence."}
        </p>

        <div className={styles.searchBar}>
          <div className={styles.searchFields} ref={dropdownRef}>
            <div className={styles.field}>
              <label>Location</label>
              <input 
                type="text" 
                placeholder="Where?" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className={styles.divider} />
            
            <div className={styles.field}>
              <label>Sector</label>
              <div className={styles.customSelectWrapper}>
                <div
                  className={styles.customSelect}
                  onClick={() => setActiveDropdown(activeDropdown === 'sector' ? null : 'sector')}
                >
                  {sector}
                  <span className={`${styles.arrowIcon} ${activeDropdown === 'sector' ? styles.arrowRotate : ''}`}>▾</span>
                </div>
                {activeDropdown === 'sector' && (
                  <div className={styles.dropdownMenu}>
                    {sectorOptions.map((opt) => (
                      <div
                        key={opt}
                        className={`${styles.dropdownOption} ${sector === opt ? styles.activeOption : ''}`}
                        onClick={() => {
                          setSector(opt);
                          setActiveDropdown(null);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.field}>
              <label>Type</label>
              <div className={styles.customSelectWrapper}>
                <div
                  className={styles.customSelect}
                  onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                >
                  {listingType === 'Sale' ? 'Buy' : 'Rent'}
                  <span className={`${styles.arrowIcon} ${activeDropdown === 'type' ? styles.arrowRotate : ''}`}>▾</span>
                </div>
                {activeDropdown === 'type' && (
                  <div className={styles.dropdownMenu}>
                    {typeOptions.map((opt) => (
                      <div
                        key={opt}
                        className={`${styles.dropdownOption} ${listingType === opt ? styles.activeOption : ''}`}
                        onClick={() => {
                          setListingType(opt);
                          setActiveDropdown(null);
                        }}
                      >
                        {opt === 'Sale' ? 'Buy' : 'Rent'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.field}>
              <label>Min Price</label>
              <input 
                type="text" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className={styles.divider} />

            <div className={styles.field}>
              <label>Max Price</label>
              <input 
                type="text" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            className={styles.searchBtn}
            onClick={handleSearch}
          >
            SEARCH
          </Button>
        </div>

        <div className={styles.heroSecondaryActions}>
          <Button
            variant="outline"
            size="md"
            onClick={() => window.location.href = '/pricing'}
            className={styles.pricingBtn}
          >
            Pricing & Packages
          </Button>
          <span className={styles.actionNote}>Clear, upfront costs. No hidden fees.</span>
        </div>

        <div className={styles.trustBar}>
          <div className={styles.trustItem}>
            <span>Rated 4.9/5</span>
            <p>Customer Service</p>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span>15+ Years</span>
            <p>Market Leaders</p>
          </div>
        </div>
      </div>
    </section>
  );
};
