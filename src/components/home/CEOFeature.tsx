"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { STAFF_DEFAULTS } from '@/data/staff';
import styles from './CEOFeature.module.css';

export const CEOFeature: React.FC = () => {
  const [dynamicImage, setDynamicImage] = React.useState<string | null>(null);
  const ceo = STAFF_DEFAULTS.find(s => s.id === 'mohammed');
  
  React.useEffect(() => {
    fetch('/api/content?page=global')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          const item = data.content.find((i: { section_key: string; content_value: string }) => i.section_key === 'staff_mohammed_image');
          if (item?.content_value) setDynamicImage(item.content_value);
        }
      })
      .catch(err => console.error('Failed to fetch dynamic CEO image:', err));
  }, []);

  if (!ceo) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageSide}>
            <div className={styles.imageFrame}>
              <Image 
                src={dynamicImage || ceo.image} 
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
              &quot;At Property Trader, we don&apos;t just manage buildings; we manage the futures of our clients 
              and the communities we serve. Our commitment is to provide a seamless, premium experience 
              built on trust and decades of industry expertise.&quot;
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
