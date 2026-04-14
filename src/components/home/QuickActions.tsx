import React from 'react';
import Link from 'next/link';
import styles from './QuickActions.module.css';

export const QuickActions: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link href="/pricing" className={styles.actionBtn}>
          <span className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 16 12 12 16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </span>
          Pricing & Packages
        </Link>

        <Link href="/services" className={styles.actionBtn}>
          <span className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M3 7v1a3 3 0 006 0V7m0 1a3 3 0 006 0V7m0 1a3 3 0 006 0V7" />
              <path d="M4 21V10" />
              <path d="M20 21V10" />
              <path d="M7 21v-4" />
              <path d="M12 21v-4" />
              <path d="M17 21v-4" />
              <path d="M12 3L2 7h20L12 3z" />
            </svg>
          </span>
          Landlord Services
        </Link>

        <Link href="/services#insurance" className={styles.actionBtn}>
          <span className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
              <line x1="8" y1="9" x2="8" y2="13" />
              <line x1="6" y1="11" x2="10" y2="11" />
            </svg>
          </span>
          Insurance - Tenants Reference
        </Link>
      </div>
    </div>
  );
};
