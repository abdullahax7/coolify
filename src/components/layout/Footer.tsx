import React from 'react';
import Link from 'next/link';
import { Logo } from '../common/Logo';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <Logo variant="footer" showPhone={false} className={styles.footerLogo} />
          <p className={styles.description}>
            Elevating property management through technology and timeless design. Managing your assets with the care they deserve.
          </p>
          <div className={styles.socials}>
            <span className={styles.socialIcon}>LinkedIn</span>
            <span className={styles.socialIcon}>Twitter</span>
            <span className={styles.socialIcon}>Instagram</span>
          </div>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.linkColumn}>
            <h4>Contact Us</h4>
            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p>Property Trader NTS Letting & Sales, 113-114 Commercial Road, Newport, United Kingdom, NP20 2GW</p>
            </div>
            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <Link href="mailto:info@propertytrader1.co.uk">info@propertytrader1.co.uk</Link>
            </div>
            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <Link href="tel:08006890604">08006890604</Link>
            </div>
          </div>

          <div className={styles.linkColumn}>
            <h4>About Us</h4>
            <Link href="/about#team">Meet The Team</Link>
            <Link href="/about#testimonials">Testimonials</Link>
            <Link href="/contact">Contact Us</Link>
          </div>

          <div className={styles.linkColumn}>
            <h4>Services</h4>
            <Link href="/services">Property Investments</Link>
            <Link href="/services">Professional Services</Link>
            <Link href="/services">Sales</Link>
            <Link href="/services">Lettings</Link>
            <Link href="/services">Property Management</Link>
            <Link href="/services">Valuation</Link>
          </div>

          <div className={styles.linkColumn}>
            <h4>Legal</h4>
            <Link href="/legal/privacy-notice-landlord">Landlord Privacy Notice</Link>
            <Link href="/legal/fair-processing-notice">Tenant Privacy Notice</Link>
            <Link href="/legal/terms-and-conditions">Terms & Conditions</Link>
            <Link href="/legal/data-protection-policy">Data Protection Policy</Link>
            <Link href="/legal/complaints-policy">Complaints Policy</Link>
            <Link href="/legal/tenants-fees">Tenants Fees</Link>
          </div>

          <div className={styles.linkColumn}>
            <h4>Quick Links</h4>
            <Link href="/properties">Browse Properties</Link>
            <Link href="/pricing">List Your Property</Link>
            <Link href="/we-buy-any-house">We Buy Any House</Link>
            <Link href="/tools">Property Tools</Link>
          </div>

          <div className={styles.linkColumn}>
            <h4>Our Blog</h4>
            <Link href="/blog/brexit-right-to-rent">Brexit & Right to Rent</Link>
            <Link href="/blog/best-roofs-wales-england">Company History</Link>
            <Link href="/blog/property-trader-strategy">Our Strategy</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <div className={styles.legalInfo}>
            <p>© Copyright Property Trader NTS Letting & Sales. All rights reserved 2026</p>
            <p className={styles.regulatoryText}>
              AML Licence Number: XFML00000191364 • Licensed Agent: Rent Smart Wales • Member of The Property Ombudsman (TPO) • Client Money Protect (CMP) Member • ICO Registered
            </p>
          </div>
          <div className={styles.legalLinks}>
            <Link href="tel:08006890604">0800 6890604</Link>
            <span className={styles.dot}>•</span>
            <Link href="mailto:info@propertytrader1.co.uk">info@propertytrader1.co.uk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
