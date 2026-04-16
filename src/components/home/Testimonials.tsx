"use client";

import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/data/testimonials';
import styles from './HomeSections.module.css';

export const Testimonials: React.FC = () => {
  return (
    <section className={styles.testimonials}>
      <div className={styles.sectionHeader}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Client <span>Testimonials</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>What our partners say about the Property Trader standard.</p>
      </div>

      <div className={styles.staticGrid}>
        {TESTIMONIALS.slice(0, 3).map((t, idx) => (
          <div key={idx} className={styles.card}>
            <p className={styles.quote}>&quot;{t.quote}&quot;</p>
            <div className={styles.author}>
              <Image src={t.image} alt={t.author} className={styles.authorImg} width={48} height={48} />
              <div className={styles.authorInfo}>
                <h4>{t.author}</h4>
                <p>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
