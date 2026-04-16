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

export const WhyChooseUs = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Why <span>Choose Us?</span></h2>
          <p>For a smooth process, we are with you every step of the way.</p>
        </div>
        
        <div className={styles.grid}>
          {REASONS.map((r, i) => (
            <div key={i} className={styles.card}>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.licence}>AML Licence XFML00000191364</div>
        </div>
      </div>
    </section>
  );
};
