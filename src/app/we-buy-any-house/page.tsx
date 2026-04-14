import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './we-buy-any-house.module.css';

export default function CashBuyPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroBadge}>UK&apos;s Trusted Cash Buyer</div>
            <h1 className={styles.heroTitle}>Sell Your House Fast <span>For Cash</span></h1>
            <p className={styles.heroSubtitle}>
              Get a guaranteed offer in 24 hours. No fees, no viewings, and total peace of mind.
              We buy houses in any condition, across the UK.
            </p>
            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="tel:08006890604" style={{ padding: '16px 32px', background: 'var(--gold)', color: '#000', fontWeight: 700, borderRadius: '4px', textDecoration: 'none', fontSize: '1rem' }}>
                📞 CALL 0800 6890604
              </a>
              <a href="mailto:info@propertytrader1.co.uk" style={{ padding: '16px 32px', background: 'transparent', color: 'inherit', fontWeight: 700, borderRadius: '4px', textDecoration: 'none', fontSize: '1rem', border: '2px solid currentColor' }}>
                ✉️ Email Us
              </a>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className={styles.processSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>How It <span>Works</span></h2>
              <p>Our 3-step process to a fast, stress-free sale.</p>
            </div>

            <div className={styles.processGrid}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>01</div>
                <h3>Request Offer</h3>
                <p>Call or email us with your property details. We&apos;ll research your area and value your property instantly.</p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>02</div>
                <h3>Receive Offer</h3>
                <p>We&apos;ll provide a formal cash offer within 24 hours. There&apos;s no obligation to accept.</p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>03</div>
                <h3>Cash In Bank</h3>
                <p>If you accept, we&apos;ll instruct lawyers and complete the sale in as little as 7-14 days.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🤝</div>
                <h3>NAPB Approved</h3>
                <p>Member of the National Association of Property Buyers.</p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🆓</div>
                <h3>Zero Costs</h3>
                <p>No agency fees, no legal fees, no hidden costs.</p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🔄</div>
                <h3>Any Chain</h3>
                <p>We buy even if you have a broken chain or need a quick move.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
