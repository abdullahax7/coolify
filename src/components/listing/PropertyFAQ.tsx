import React from 'react';
import styles from './PropertyFAQ.module.css';

const FAQS = [
  {
    q: "How often are the property listings updated?",
    a: "Our listings are updated in real-time. As soon as a property is uploaded or its status changes, it is reflected on our portal immediately."
  },
  {
    q: "Can I book a viewing directly through the website?",
    a: "Yes! You can click the 'Book Viewing' button on any property detail page to send a direct request to the listing agent or landlord."
  },
  {
    q: "Are there any hidden fees for tenants or buyers?",
    a: "No, we believe in 100% transparency. Any applicable fees are clearly stated in the property description. We do not charge hidden search or registration fees."
  },
  {
    q: "How do I filter for specific property types like 'Commercial'?",
    a: "You can use the secondary sector filter at the top of the search page to toggle between Residential and Commercial properties effortlessly."
  },
  {
    q: "What should I do if I can't find what I'm looking for?",
    a: "You can save your search or contact our support team. We often have new listings coming soon that aren't public yet."
  }
];

export const PropertyFAQ = () => {
  return (
    <section className={styles.section}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })
        }}
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Got <span>Questions?</span></h2>
          <p>We have the answers to help you navigate your property search.</p>
        </div>
        
        <div className={styles.grid}>
          {FAQS.map((faq, i) => (
            <div key={i} className={styles.faqItem}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
