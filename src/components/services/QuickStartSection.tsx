import React from 'react';
import styles from './QuickStart.module.css';

export const QuickStartSection: React.FC = () => {
  const sellFeatures = [
    'Advertise your property from only £65 for 3 months',
    'Listing on OntheMarket for free',
    'For Sale board or banners',
    'Professional advert including photos and floorplan',
    '24/7 Dashboard access',
    'Upload your property with details and photos',
    'Manage your enquiries and viewings online',
    'Expert support from start to finish'
  ];

  const letFeatures = [
    'Let your own property from £50',
    'Listing on OntheMarket & Property Trader',
    'To Let board',
    'Professional advert including photos and floorplan',
    '24/7 Dashboard access',
    'Upload your property with details and photos',
    'Manage your enquiries and viewings online',
    'Expert support from start to finish'
  ];

  return (
    <section className={styles.section}>
      <div className={styles.topPills}>
        <button className={styles.pill} onClick={() => window.location.href='/pricing'}>
          <span className={styles.pillIcon}>›</span> Pricing & Packages
        </button>
        <button className={styles.pill} onClick={() => window.location.href='/contact/landlord-application'}>
          <span className={styles.pillIcon}>🏛️</span> Landlord Services
        </button>
        <button className={styles.pill} onClick={() => window.location.href='/services'}>
          <span className={styles.pillIcon}>🚛</span> Insurance - Tenants Reference
        </button>
      </div>

      <div className={styles.splitGrid}>
        <div className={styles.sellCol}>
          <h3>Sell your property online from just <span>£65</span></h3>
          <ul className={styles.featureList}>
            {sellFeatures.map((f, i) => (
              <li key={i}>
                <span className={styles.check}>✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button className={styles.sellBtn} onClick={() => window.location.href='/pricing'}>
            <span className={styles.btnIcon}>›</span> Start selling your property
          </button>
        </div>

        <div className={styles.letCol}>
          <h3>Let your property online from just <span>£50</span></h3>
          <ul className={styles.featureList}>
            {letFeatures.map((f, i) => (
              <li key={i}>
                <span className={styles.check}>✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button className={styles.letBtn} onClick={() => window.location.href='/pricing'}>
            <span className={styles.btnIcon}>›</span> Start letting your property
          </button>
        </div>
      </div>
    </section>
  );
};
