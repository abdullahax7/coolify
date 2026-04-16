'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuickStartSection } from '@/components/services/QuickStartSection';
import { SERVICE_CATALOG } from '@/data/pricing_data';
import styles from './services-page.module.css';

export default function ServicesHubPage() {
  const [activeCategory, setActiveCategory] = useState(SERVICE_CATALOG[0].category);

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroLayout}>
              <div className={styles.heroText}>
                <div className={styles.badge}>Compliance & Care</div>
                <h1 className={styles.title}>Professional <span>Landlord Services</span></h1>
                <p className={styles.subtitle}>
                  A comprehensive catalog of management solutions, safety certificates, and legal documentation 
                  designed to keep your property compliant and profitable.
                </p>
              </div>
              <div className={styles.heroImage}>
                <Image 
                  src="/services_hero.png" 
                  alt="Landlord Services Illustration" 
                  width={500} 
                  height={400} 
                  className={styles.heroIllustration}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Full Service Catalog Section - NOW THE PRIMARY FOCUS */}
        <section className={styles.section} id="catalog">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Full Service <span>Catalog</span></h2>
              <p className={styles.sectionSubtitle}>Individual services, products, and compliance certificates for landlords.</p>
            </div>

            <div className={styles.catalogLayout}>
              {/* Category Tabs */}
              <div className={styles.catalogNav}>
                {SERVICE_CATALOG.map((cat) => (
                  <button 
                    key={cat.category}
                    className={`${styles.navItem} ${activeCategory === cat.category ? styles.navActive : ''}`}
                    onClick={() => setActiveCategory(cat.category)}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className={styles.catalogGrid}>
                {SERVICE_CATALOG.find(c => c.category === activeCategory)?.items.map((item, idx) => (
                  <div key={idx} className={styles.catalogCard}>
                    <div className={styles.cardHeader}>
                      <h3>{item.name}</h3>
                      <span className={styles.price}>{item.price}</span>
                    </div>
                    <p>{item.desc}</p>
                    <button 
                      className={styles.selectBtn}
                      onClick={() => window.location.href = `/checkout?service=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}`}
                    >
                      SELECT SERVICE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <QuickStartSection />

        {/* Contact/CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2>Need a Bespoke Solution?</h2>
              <p>Contact our expert team for portfolio management or specialized commercial services.</p>
              <button onClick={() => window.location.href='/contact'}>Talk to an Expert</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
