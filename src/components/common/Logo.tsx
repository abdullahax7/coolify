import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Logo.module.css';

interface LogoProps {
  showPhone?: boolean;
  className?: string;
  variant?: 'header' | 'footer';
}

export const Logo: React.FC<LogoProps> = ({ showPhone = true, className = '', variant = 'header' }) => {
  return (
    <div className={`${styles.logoWrapper} ${className} ${styles[variant]}`}>
      <Link href="/" className={styles.topRow}>
        <div className={styles.logoImage}>
          <Image
            src="/images/logo.png"
            alt="Property Trader Logo"
            width={240}
            height={60}
            className={styles.img}

            priority
          />

        </div>
      </Link>
      {showPhone && (
        <a href="tel:08006890604" className={styles.phone}>
          0800 6890604
        </a>
      )}
    </div>
  );
};
