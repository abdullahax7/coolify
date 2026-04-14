import React from 'react';
import Link from 'next/link';
import styles from './CashBuy.module.css';

export const CashBuy: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textSide}>
            <div className={styles.badge}>CASH BUY SERVICE</div>
            <h2 className={styles.title}>
              WE BUY ANY HOUSE.<br />
              <span>GET A CASH OFFER IN 24 HOURS.</span>
            </h2>
            <p className={styles.description}>
              Skip the property market stress. We buy your house directly with cash.
              No fees, no viewings, and completion in as little as 7 days.
            </p>

            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>⚡</span>
                <div>
                  <h4>7-Day Sale</h4>
                  <p>Fastest completion in the UK</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>💰</span>
                <div>
                  <h4>Zero Fees</h4>
                  <p>We pay your legal costs</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🏠</span>
                <div>
                  <h4>Any Condition</h4>
                  <p>No repairs or cleanup needed</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSide}>
            <div className={styles.formCard}>
              <h3>Get Your Cash Offer</h3>
              <p>Call or email us today for a free, no-obligation valuation.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                <a href="tel:08006890604" className={styles.submitBtn} style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                  📞 CALL 0800 6890604
                </a>
                <Link href="/we-buy-any-house" className={styles.submitBtn} style={{ textAlign: 'center', textDecoration: 'none', display: 'block', background: 'transparent', border: '1px solid currentColor' }}>
                  LEARN MORE →
                </Link>
              </div>

              <div className={styles.formFooter}>
                <span>🔒 Secure & Confidential</span>
                <span>•</span>
                <span>No obligation to sell</span>
              </div>
            </div>

            <div className={styles.ratingBox}>
              <div className={styles.stars}>★★★★★</div>
              <p>Rated 4.9/5 by 2,000+ UK Homeowners</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
