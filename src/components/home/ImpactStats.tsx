"use client";

import React from 'react';
import styles from './HomeSections.module.css';

export const ImpactStats: React.FC = () => {
  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <h2>£12.4B+</h2>
            <p>ASSETS UNDER MANAGEMENT</p>
          </div>
          <div className={styles.statItem}>
            <h2>450+</h2>
            <p>HIGH-VALUE PROPERTIES</p>
          </div>
          <div className={styles.statItem}>
            <h2>98%</h2>
            <p>CLIENT RETENTION RATE</p>
          </div>
          <div className={styles.statItem}>
            <h2>15+ Years</h2>
            <p>OF MARKET LEADERSHIP</p>
          </div>
        </div>
      </div>
      
      <div className={styles.container} style={{ marginTop: '80px', textAlign: 'center' }}>
         <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 800 }}>Trusted by the World&apos;s Most <span>Prestigious</span> Asset Managers.</h2>
         <p style={{ opacity: 0.7, maxWidth: '800px', margin: '16px auto' }}>
            We provide a level of oversight and reporting that traditional agencies simply cannot match. 
            Our platform is built for the owners who demand precision.
         </p>
      </div>
    </section>
  );
};
