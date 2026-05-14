import React from 'react';
import styles from './WhyChooseUs.module.css';

const REASONS = [
  {
    title: 'Profile & Listing',
    desc: 'Stand-out listings created across all the best channels ( including OnTheMarket ) and with a personal touch.'
  },
  {
    title: 'Professional Photography',
    desc: 'We also offer professional photography for your property to get noticed.'
  },
  {
    title: 'Sell your property quickly',
    desc: 'We market properties smartly. We aim to find a buyer within three to six weeks.'
  },
  {
    title: 'Fixed Price',
    desc: 'Simple packages with everything you need. Cheap, cheerful and no commission on the sale!'
  },
  {
    title: 'Millions of buyers',
    desc: 'Over 90% of buyers visit Rightmove, Zoopla and OnTheMarket. We will advertise your property on all the portals for the maximum exposure.'
  },
  {
    title: 'Account Management',
    desc: 'One point of contact for all of your queries with our dedicated account manager to ensure reliability and knowledge base'
  }
];

export const WhyChooseUs = ({ content }: { content?: Record<string, string> }) => {
  const reasons = content ? [
    { title: content.wcu_reason1_title || 'Profile & Listing', desc: content.wcu_reason1_desc || 'Stand-out listings created across all the best channels ( including OnTheMarket ) and with a personal touch.' },
    { title: content.wcu_reason2_title || 'Professional Photography', desc: content.wcu_reason2_desc || 'We also offer professional photography for your property to get noticed.' },
    { title: content.wcu_reason3_title || 'Sell your property quickly', desc: content.wcu_reason3_desc || 'We market properties smartly. We aim to find a buyer within three to six weeks.' },
    { title: content.wcu_reason4_title || 'Fixed Price', desc: content.wcu_reason4_desc || 'Simple packages with everything you need. Cheap, cheerful and no commission on the sale!' },
    { title: content.wcu_reason5_title || 'Millions of buyers', desc: content.wcu_reason5_desc || 'Over 90% of buyers visit Rightmove, Zoopla and OnTheMarket. We will advertise your property on all the portals for the maximum exposure.' },
    { title: content.wcu_reason6_title || 'Account Management', desc: content.wcu_reason6_desc || 'One point of contact for all of your queries with our dedicated account manager to ensure reliability and knowledge base' }
  ] : REASONS;

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 dangerouslySetInnerHTML={{ __html: content?.wcu_title || 'Why <span>Choose Us?</span>' }} />
          <p>{content?.wcu_subtitle || 'For a smooth process, we are with you every step of the way.'}</p>
        </div>
        
        <div className={styles.grid}>
          {reasons.map((r, i) => (
            <div key={i} className={styles.card}>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
 
        <div className={styles.footer}>
          <div className={styles.licence}>{content?.wcu_licence || 'AML Licence XFML00000191364'}</div>
        </div>
      </div>
    </section>
  );
};
