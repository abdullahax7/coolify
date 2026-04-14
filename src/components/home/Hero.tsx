"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../common/Button';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState('Full Management');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = ['Full Management', 'Investment Only', 'Luxury Lettings'];

  return (
    <section className={styles.hero}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.overlay} />
        <img 
          src="/images/hero_luxury.png" 
          alt="Luxury Property Portfolio" 
          className={styles.bgImage}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.badge}>Luxury Property Management</div>
        <h1 className={styles.title}>
          THE ULTIMATE PROPERTY STANDARD. <br />
          <span>LUXURY MANAGEMENT REDEFINED.</span>
        </h1>
        <p className={styles.subtitle}>
          Stop settling for average. We provide elite property management for the world's most 
          exclusive residences and the owners who demand excellence.
        </p>

        <div className={styles.searchBar}>
          {/* ... existing fields ... */}
          <div className={styles.searchFields}>
            <div className={styles.field}>
              <label>Location</label>
              <input type="text" placeholder="London, Dubai, NY..." />
            </div>
            <div className={styles.divider} />
            <div className={styles.field}>
              <label>Service</label>
              <div className={styles.customSelectWrapper} ref={dropdownRef}>
                <div 
                  className={styles.customSelect} 
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {service}
                  <span className={`${styles.arrowIcon} ${isOpen ? styles.arrowRotate : ''}`}>▾</span>
                </div>
                {isOpen && (
                  <div className={styles.dropdownMenu}>
                    {options.map((opt) => (
                      <div 
                        key={opt} 
                        className={`${styles.dropdownOption} ${service === opt ? styles.activeOption : ''}`}
                        onClick={() => {
                          setService(opt);
                          setIsOpen(false);
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
              <label>Min. Portfolio</label>
              <input type="text" placeholder="£1M+" />
            </div>
          </div>
          <Button variant="primary" size="lg" className={styles.searchBtn}>GET STARTED</Button>
        </div>

        <div className={styles.heroSecondaryActions}>
          <Button 
            variant="outline" 
            size="md" 
            onClick={() => window.location.href='/pricing'}
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
            <span>£12B+</span>
            <p>Managed Assets</p>
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
