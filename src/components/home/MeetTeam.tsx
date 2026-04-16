"use client";

import React from 'react';
import Image from 'next/image';
import { STAFF } from '@/data/staff';
import styles from './MeetTeam.module.css';

export const MeetTeam: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.badge}>DEDICATED STAFF</div>
        <h2 className={styles.title}>Meet our <span>Professional Team</span></h2>
        <p className={styles.subtitle}>Our friendly and professional staff are here to help you through your property journey.</p>
      </div>

      <div className={styles.grid}>
        {STAFF.map((member) => (
          <div key={member.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              {/* Using a placeholder if specific image not provided, 
                  but the layout is ready for user's replacement */}
              <Image 
                src={member.image} 
                alt={member.name}
                width={300}
                height={400}
                className={styles.image}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";
                }}
              />
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{member.name}</h3>
              <div className={styles.role}>{member.role}</div>
              <p className={styles.description}>{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
