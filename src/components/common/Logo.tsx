"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Logo.module.css';

interface LogoProps {
  showPhone?: boolean;
  className?: string;
  variant?: 'header' | 'footer' | 'sidebar';
  disableLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  showPhone = true, 
  className = '', 
  variant = 'header',
  disableLink = false
}) => {
  const [logoUrl, setLogoUrl] = React.useState('/images/logo.jpg');

  React.useEffect(() => {
    fetch('/api/content?page=global')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          const item = data.content.find((i: { section_key: string; content_value: string }) => i.section_key === 'logo_url');
          if (item?.content_value) setLogoUrl(item.content_value);
        }
      })
      .catch(err => console.error('Failed to fetch dynamic logo:', err));
  }, []);

  const content = (
    <div className={styles.logoImage}>
      <Image
        src={logoUrl}
        alt="Property Trader Logo"
        width={400}
        height={100}
        className={styles.img}
        priority
      />
    </div>
  );

  return (
    <div className={`${styles.logoWrapper} ${className} ${styles[variant]}`}>
      {disableLink ? (
        <div className={styles.topRow}>{content}</div>
      ) : (
        <Link href="/" className={styles.topRow}>
          {content}
        </Link>
      )}
      {showPhone && (
        <a href="tel:08006890604" className={styles.phone}>
          0800 6890604
        </a>
      )}
    </div>
  );
};
