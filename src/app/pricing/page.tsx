import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PricingTable } from '@/components/pricing/PricingTable';
import styles from './pricing-page.module.css';

export const metadata = {
  title: 'Pricing & Packages | Property Trader NTS',
  description: 'Choose the perfect advertising length for your property. From Basic to Ultimate, we have a package that fits your needs.',
};

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>Simple, Transparent <span>Pricing</span></h1>
            <p className={styles.subtitle}>
              Maximize your property's exposure with our curated advertising packages. 
              No hidden fees, just results.
            </p>
          </div>
        </div>

        <section className={styles.pricingSection}>
          <PricingTable />
        </section>

        <section className={styles.faqSection}>
          <div className={styles.container}>
            <h2 className={styles.faqTitle}>Frequently Asked <span>Questions</span></h2>
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h3>How long does it take for my listing to go live?</h3>
                <p>Once you select a package and complete the details, your property is usually live on our site within minutes and on portals like OnTheMarket within 24 hours.</p>
              </div>
              <div className={styles.faqItem}>
                <h3>Can I upgrade my package later?</h3>
                <p>Yes, you can upgrade your package at any time from your dashboard to increase exposure or add professional services like floor plans.</p>
              </div>
              <div className={styles.faqItem}>
                <h3>What is the "No Sale No Fee" package?</h3>
                <p>Our Ultimate package means you pay nothing upfront. We only take a 1% fee once your property is successfully sold and completion has taken place.</p>
              </div>
              <div className={styles.faqItem}>
                <h3>Is professional photography included?</h3>
                <p>Professional photography and floor plans are included in our Gold and Ultimate packages. You can also add them as a standalone service to any other package.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
