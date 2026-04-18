'use client';

import React, { useState, useEffect } from 'react';
import { SERVICE_CATALOG } from '@/data/pricing_data';
import styles from './Services.module.css';

interface Service {
  title: string;
  description: string;
  icon: string;
  isPortal?: boolean;
}

const SERVICES: Service[] = [
  {
    title: 'Landlord Services',
    description: 'Bespoke management solutions and compliance certificates. Click to view our complete service & pricing catalog.',
    icon: '🏢',
    isPortal: true
  },
  {
    title: 'Tenant Screening',
    description: 'Rigorous background checks and verification processes to find the most reliable tenants for your properties.',
    icon: '🔍'
  },
  {
    title: 'Digital Leases',
    description: 'Seamless automated lease generation and digital signing for quick, legal, and paperless transitions.',
    icon: '📝'
  },
  {
    title: 'Financial Tracking',
    description: 'Real-time dashboards for income, expenses, and tax-ready reporting for property owners.',
    icon: '📈'
  }
];

export const Services: React.FC = () => {
  const [showCatalog, setShowCatalog] = useState(false);
  const [activeCategory, setActiveCategory] = useState(SERVICE_CATALOG[0].category);

  useEffect(() => {
    if (showCatalog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showCatalog]);

  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>OUR <span>SERVICES</span></h2>
          <p className={styles.subtitle}>Professional solutions for every property need.</p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((service, idx) => (
            <div 
              key={idx} 
              className={`${styles.card} ${service.isPortal ? styles.portalCard : ''}`}
              onClick={service.isPortal ? () => setShowCatalog(true) : undefined}
            >
              <div className={styles.icon}>{service.icon}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
              {service.isPortal && <div className={styles.cta}>View Catalog & Pricing →</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Landlord Service Catalog Overlay */}
      {showCatalog && (
        <div className={styles.overlay} onClick={() => setShowCatalog(false)}>
          <div className={styles.overlayContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowCatalog(false)}>✕</button>
            
            <div className={styles.overlayHeader}>
              <h2 className={styles.overlayTitle}>Service <span>Catalog</span></h2>
              <p className={styles.overlaySubtitle}>Complete list of professional landlord services and compliance products.</p>
            </div>

            <div className={styles.catalogLayout}>
              {/* Category Sidebar */}
              <div className={styles.catalogSidebar}>
                {SERVICE_CATALOG.map((cat) => (
                  <button 
                    key={cat.category}
                    className={`${styles.catButton} ${activeCategory === cat.category ? styles.catActive : ''}`}
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
                      <h4>{item.name}</h4>
                      <span className={styles.cardPrice}>{item.price}</span>
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
        </div>
      )}
    </section>
  );
};
