"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { STAFF } from '@/data/staff';
import styles from './CEOFeature.module.css';

export const CEOFeature: React.FC = () => {
  const ceo = STAFF.find(s => s.id === 'mohammed');
  
  if (!ceo) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageSide}>
            <div className={styles.imageFrame}>
              <Image 
                src={ceo.image} 
                alt={ceo.name} 
                width={500} 
                height={600} 
                className={styles.image}
                priority
              />
              <div className={styles.experienceBadge}>
                <strong>25+</strong>
                <span>Years Experience</span>
              </div>
            </div>
          </div>
          
          <div className={styles.textSide}>
            <div className={styles.badge}>Our Visionary</div>
            <h2 className={styles.title}>Leading with <span>Integrity & Excellence</span></h2>
            <p className={styles.quote}>
              "At Property Trader, we don't just manage buildings; we manage the futures of our clients 
              and the communities we serve. Our commitment is to provide a seamless, premium experience 
              built on trust and decades of industry expertise."
            </p>
            
            <div className={styles.ceoDetails}>
              <h3 className={styles.name}>{ceo.name}</h3>
              <p className={styles.role}>{ceo.role}</p>
            </div>

            <div className={styles.actions}>
              <Link href="/about" className={styles.primaryBtn}>Read Our Story</Link>
              <Link href="/contact" className={styles.secondaryBtn}>Direct Executive Inquiry</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
