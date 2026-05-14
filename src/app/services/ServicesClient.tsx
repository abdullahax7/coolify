'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuickStartSection } from '@/components/services/QuickStartSection';
import { useCart } from '@/context/CartContext';
import { SERVICE_CATALOG } from '@/data/pricing_data';
import styles from './services-page.module.css';

interface CatalogItem {
  name: string;
  price: string;
  desc: string;
  flag?: 'england' | 'wales';
  image_url?: string;
}

interface CatalogCategory {
  category: string;
  items: CatalogItem[];
}

export function ServicesClient({ content, rawCatalog }: { content: Record<string, string>, rawCatalog?: string }) {
  const router = useRouter();
  const [catalog] = useState(() => {
    if (rawCatalog) {
      try {
        return JSON.parse(rawCatalog);
      } catch (e) {
        // Failed to parse dynamic catalog
      }
    }
    return SERVICE_CATALOG;
  });

  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState(catalog[0]?.category || '');
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const handleAddToCart = (item: CatalogItem) => {
    const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const success = addItem({ id: item.name, name: item.name, price: item.price, numericPrice });
    
    setNotification({
      msg: success ? `Added ${item.name} to cart` : `${item.name} is already in cart`,
      type: success ? 'success' : 'info'
    });

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero} aria-label="Professional Landlord Services">
          <Image
            src={content.hero_image_url || "/servicesbg.png"}
            alt="Professional landlord and property management services in the UK"
            width={1920}
            height={1280}
            className={styles.heroImg}
            sizes="100vw"
            priority
            fetchPriority="high"
          />
        </section>

        {/* Full Service Catalog Section */}
        <section className={styles.section} id="catalog">
          <div className={styles.container}>
            {notification && (
              <div className={`${styles.toast} ${styles[notification.type]}`}>
                {notification.type === 'success' ? '✓' : 'ℹ️'} {notification.msg}
              </div>
            )}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle} dangerouslySetInnerHTML={{__html: content.services_title || 'Full Service <span>Catalog</span>'}} />
              <p className={styles.sectionSubtitle} dangerouslySetInnerHTML={{__html: content.services_subtitle || 'Individual services, products, and compliance certificates for landlords.'}} />
            </div>

            <div className={styles.catalogLayout}>
              {/* Category Sidebar on the left */}
              <div className={styles.catalogNav}>
                {catalog.map((cat: CatalogCategory) => (
                  <button 
                    key={cat.category}
                    className={`${styles.navItem} ${activeCategory === cat.category ? styles.navActive : ''}`}
                    onClick={() => setActiveCategory(cat.category)}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              <div className={styles.catalogGrid}>
                {catalog.find((c: CatalogCategory) => c.category === activeCategory)?.items.map((item: CatalogItem, idx: number) => {
                  const isForm = /Form RHW|Tenancy Agreement/i.test(item.name);

                  return (
                    <div key={idx} className={styles.catalogCard}>
                      {item.image_url && (
                        <div className={styles.cardImageContainer}>
                          <Image 
                            src={item.image_url} 
                            alt={item.name} 
                            width={300} 
                            height={200} 
                            className={styles.cardItemImage}
                            unoptimized
                          />
                        </div>
                      )}
                      <div className={styles.cardHeader}>
                        <h3 className={isForm ? styles.formHeading : ''}>
                          {item.name}
                        </h3>
                        <span className={styles.price}>{item.price}</span>
                      </div>
                      <p className={isForm ? styles.formDesc : ''}>{item.desc}</p>
                      <div className={styles.cardActions}>
                        <button
                          className={styles.selectBtn}
                          onClick={() => {
                            if (isForm) {
                              router.push(`/forms/preview?form=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}`);
                            } else {
                              router.push(`/checkout?service=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}`);
                            }
                          }}
                        >
                        {/Form RHW|Tenancy Agreement/i.test(item.name) ? 'EDIT & PAY' : 'BUY NOW'}
                      </button>
                      {!/Form RHW|Tenancy Agreement/i.test(item.name) && (
                        <button 
                          className={styles.cartBtn}
                          onClick={() => handleAddToCart(item)}
                        >
                          + CART
                        </button>
                      )}
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <QuickStartSection />

        {/* Contact/CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2 dangerouslySetInnerHTML={{__html: content.cta_heading || 'Need a Bespoke Solution?'}} />
              <p dangerouslySetInnerHTML={{__html: content.cta_subtext || 'Contact our expert team for portfolio management or specialized commercial services.'}} />
              <button onClick={() => window.location.href='/contact'}>Talk to an Expert</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
