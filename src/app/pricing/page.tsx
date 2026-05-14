import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PricingTable } from '@/components/pricing/PricingTable';
import { WhyChooseUs } from '@/components/pricing/WhyChooseUs';
import { getPageContent } from '@/lib/getContent';
import styles from './pricing-page.module.css';

export const metadata = {
  title: 'Pricing & Packages | Property Trader NTS',
  description: 'Choose the perfect advertising length for your property. From Basic to Ultimate, we have a package that fits your needs.',
};

export default async function PricingPage() {
  const content = await getPageContent('pricing', {
    faq_title: 'Frequently Asked <span class="highlight">Questions</span>',
    faq_1_q: 'How long does it take for my listing to go live?',
    faq_1_a: 'Once you select a package and complete the details, your property is usually live on our site within minutes and on portals like OnTheMarket within 24 hours.',
    faq_2_q: 'Can I upgrade my package later?',
    faq_2_a: 'Yes, you can upgrade your package at any time from your dashboard to increase exposure or add professional services like floor plans.',
    faq_3_q: 'What is the "No Sale No Fee" package?',
    faq_3_a: 'Our Ultimate package means you pay nothing upfront. We only take a 1% fee once your property is successfully sold and completion has taken place.',
    faq_4_q: 'Is professional photography included?',
    faq_4_a: 'Professional photography and floor plans are included in our Gold and Ultimate packages. You can also add them as a standalone service to any other package.',
    wcu_title: 'Why <span>Choose Us?</span>',
    wcu_subtitle: 'For a smooth process, we are with you every step of the way.',
    wcu_reason1_title: 'Profile & Listing',
    wcu_reason1_desc: 'Stand-out listings created across all the best channels ( including OnTheMarket ) and with a personal touch.',
    wcu_reason2_title: 'Professional Photography',
    wcu_reason2_desc: 'We also offer professional photography for your property to get noticed.',
    wcu_reason3_title: 'Sell your property quickly',
    wcu_reason3_desc: 'We market properties smartly. We aim to find a buyer within three to six weeks.',
    wcu_reason4_title: 'Fixed Price',
    wcu_reason4_desc: 'Simple packages with everything you need. Cheap, cheerful and no commission on the sale!',
    wcu_reason5_title: 'Millions of buyers',
    wcu_reason5_desc: 'Over 90% of buyers visit Rightmove, Zoopla and OnTheMarket. We will advertise your property on all the portals for the maximum exposure.',
    wcu_reason6_title: 'Account Management',
    wcu_reason6_desc: 'One point of contact for all of your queries with our dedicated account manager to ensure reliability and knowledge base',
    wcu_licence: 'AML Licence XFML00000191364'
  });

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.hero} aria-label="List your property with Property Trader">
          <Image
            src={content.hero_image_url || "/listpropetybg.png"}
            alt="List your property with Property Trader — transparent UK landlord and seller plans"
            width={1920}
            height={1280}
            className={styles.heroImg}
            sizes="100vw"
            priority
            fetchPriority="high"
          />
        </section>

        <section className={styles.pricingSection}>
          <PricingTable />
        </section>

        <WhyChooseUs content={content} />

        <section className={styles.faqSection}>
          <div className={styles.container}>
            <h2 className={styles.faqTitle} dangerouslySetInnerHTML={{__html: content.faq_title }} />
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h3 dangerouslySetInnerHTML={{__html: content.faq_1_q }} />
                <p dangerouslySetInnerHTML={{__html: content.faq_1_a }} />
              </div>
              <div className={styles.faqItem}>
                <h3 dangerouslySetInnerHTML={{__html: content.faq_2_q }} />
                <p dangerouslySetInnerHTML={{__html: content.faq_2_a }} />
              </div>
              <div className={styles.faqItem}>
                <h3 dangerouslySetInnerHTML={{__html: content.faq_3_q }} />
                <p dangerouslySetInnerHTML={{__html: content.faq_3_a }} />
              </div>
              <div className={styles.faqItem}>
                <h3 dangerouslySetInnerHTML={{__html: content.faq_4_q }} />
                <p dangerouslySetInnerHTML={{__html: content.faq_4_a }} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
