import React from 'react';
import styles from './ListingBenefits.module.css';

const BENEFITS = [
  {
    icon: '👔',
    title: 'Market Experts',
    desc: 'With our extensive knowledge of the property market, we can provide specialist services on all aspects of residential and commercial property from tenant find and all documents that are required for the process.'
  },
  {
    icon: '🛠️',
    title: 'Professional Services',
    desc: 'Sell or let quickly. We will help you advertise on our portal and help do everything for you. Our network of local experts stretches out across the entire UK.'
  },
  {
    icon: '💷',
    title: 'Fixed Fees',
    desc: 'No surprises and commission. You will only pay one fee, and it is fixed from the beginning. Simply select the advertising period and pay for the service.'
  },
  {
    icon: '👀',
    title: 'Seen by Thousands',
    desc: 'Get seen by millions on Rightmove, Zoopla and PrimeLocation. 98% of buyers and tenants start their search online.'
  },
  {
    icon: '🕒',
    title: 'Open 24/7',
    desc: 'We are here for you 24 hours a day seven days a week! If a buyer or tenant wants to view your property after working hours, no problem! he can leave a massage in your inbox'
  },
  {
    icon: '🏠',
    title: 'Viewings',
    desc: 'You can host viewings whenever you want, or when is suits you, we have made it easy for you to sell or rent your house without the hassle of high fees or expensive estate agent charges.'
  }
];

export const ListingBenefits = ({ content }: { content?: Record<string, string> }) => {
  const dynamicBenefits = [
    { icon: '👔', title: content?.benefit_1_title || BENEFITS[0].title, desc: content?.benefit_1_desc || BENEFITS[0].desc },
    { icon: '🛠️', title: content?.benefit_2_title || BENEFITS[1].title, desc: content?.benefit_2_desc || BENEFITS[1].desc },
    { icon: '💷', title: content?.benefit_3_title || BENEFITS[2].title, desc: content?.benefit_3_desc || BENEFITS[2].desc },
    { icon: '👀', title: content?.benefit_4_title || BENEFITS[3].title, desc: content?.benefit_4_desc || BENEFITS[3].desc },
    { icon: '🕒', title: content?.benefit_5_title || BENEFITS[4].title, desc: content?.benefit_5_desc || BENEFITS[4].desc },
    { icon: '🏠', title: content?.benefit_6_title || BENEFITS[5].title, desc: content?.benefit_6_desc || BENEFITS[5].desc },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {dynamicBenefits.map((b, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.icon}>{b.icon}</div>
              <h3 dangerouslySetInnerHTML={{__html: b.title}} />
              <p dangerouslySetInnerHTML={{__html: b.desc}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
