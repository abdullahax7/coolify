"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPricingData, PricingTier, PricingFeature } from '@/data/pricing_data';
import { ManagementInfo } from './ManagementInfo';
import styles from './Pricing.module.css';

const CheckIcon = () => (
  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CrossIcon = () => (
  <svg className={styles.crossIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface SubComponentProps {
  tiers: PricingTier[];
  features: PricingFeature[];
  type: 'sell' | 'let' | 'manage';
  router: ReturnType<typeof useRouter>;
}

/** Mobile card view — one card per tier with all features listed */
const MobilePricingCards: React.FC<SubComponentProps> = ({ tiers, features, type, router }) => {
  const [selected, setSelected] = useState(
    tiers.findIndex((t) => t.isPopular) || 0
  );

  return (
    <div className={styles.mobileWrapper}>
      {/* Tier selector tabs */}
      <div className={styles.mobileTabs}>
        {tiers.map((tier, idx) => (
          <button
            key={`${type}-${idx}`}
            className={`${styles.mobileTab} ${selected === idx ? styles.mobileTabActive : ''} ${tier.isPopular ? styles.mobileTabPopular : ''}`}
            onClick={() => setSelected(idx)}
          >
            {tier.name}
          </button>
        ))}
      </div>

      {/* Active tier card */}
      {tiers.map((tier, idx) => (
        <div
          key={`${type}-card-${idx}`}
          className={`${styles.mobileCard} ${selected !== idx ? styles.mobileCardHidden : ''} ${tier.isPopular ? styles.mobileCardPopular : ''}`}
        >
          {tier.isPopular && (
            <span className={styles.badge}>{tier.highlight || 'Most Popular'}</span>
          )}
          <div className={styles.mobilePriceRow}>
            <span className={styles.tierName}>{tier.name}</span>
            <span className={styles.tierPrice}>{tier.price}</span>
          </div>
          {tier.subtitle && (
            <span className={styles.tierSubtitle}>{tier.subtitle}</span>
          )}

          <ul className={styles.mobileFeatureList}>
            {features.map((feature, fIdx) => {
              const val = feature.values[idx];
              return (
                <li key={fIdx} className={`${styles.mobileFeatureItem} ${val === false ? styles.mobileFeatureDisabled : ''}`}>
                  <span className={styles.mobileFeatureIcon}>
                    {typeof val === 'boolean' ? (
                      val ? <CheckIcon /> : <CrossIcon />
                    ) : (
                      <CheckIcon />
                    )}
                  </span>
                  <span className={styles.mobileFeatureName}>{feature.name}</span>
                  {typeof val === 'string' && (
                    <span className={styles.mobileFeatureValue}>{val}</span>
                  )}
                </li>
              );
            })}
          </ul>

          <button
            className={`${styles.selectBtn} ${tier.isPopular ? styles.popularBtn : ''} ${styles.mobileSelectBtn}`}
            onClick={() => {
              if (type === 'manage') {
                router.push(`/contact/landlord-application?plan=${encodeURIComponent(tier.name)}`);
              } else if (type === 'sell' && tier.name === 'Ultimate') {
                router.push(`/contact?plan=${encodeURIComponent(tier.name)}`);
              } else {
                router.push(`/checkout?plan=${encodeURIComponent(tier.name)}&type=${type}`);
              }
            }}
          >
            {type === 'sell' && tier.name === 'Ultimate'
              ? 'CONTACT AGENT'
              : `SELECT ${tier.name.toUpperCase()}`}
          </button>
        </div>
      ))}
    </div>
  );
};

/** Desktop table view */
const DesktopPricingTable: React.FC<SubComponentProps> = ({ tiers, features, type, router }) => (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.typeHeader}>
            {type === 'manage'
              ? 'Landlord Fees and Service options'
              : type === 'sell'
                ? 'Plan Features to Sell Property'
                : 'Plan Features to Let Property'}
          </th>
          {tiers.map((tier, idx) => (
            <th key={idx} className={tier.isPopular ? styles.popularColumn : ''}>
              <div className={styles.tierInfo}>
                {tier.isPopular && <span className={styles.badge}>{tier.highlight || 'Most Popular'}</span>}
                <span className={styles.tierName}>{tier.name}</span>
                <span className={styles.tierPrice}>{tier.price}</span>
                {tier.subtitle && <span className={styles.tierSubtitle}>{tier.subtitle}</span>}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((feature, fIdx) => (
          <tr key={fIdx} className={styles.featureRow}>
            <td className={styles.featureName}>{feature.name}</td>
            {feature.values.map((val, vIdx) => {
              const tier = tiers[vIdx];
              return (
                <td key={vIdx} className={tier.isPopular ? styles.popularColumn : ''}>
                  {typeof val === 'boolean' ? (
                    val ? <CheckIcon /> : <CrossIcon />
                  ) : (
                    <span className={styles.textValue}>{val}</span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
        <tr className={styles.footerRow}>
          <td>{/* Footer Cell */}</td>
          {tiers.map((tier, idx) => (
            <td key={idx} className={tier.isPopular ? styles.popularColumn : ''}>
              <button
                className={`${styles.selectBtn} ${tier.isPopular ? styles.popularBtn : ''}`}
                onClick={() => {
                  if (type === 'manage') {
                    router.push(`/contact/landlord-application?plan=${encodeURIComponent(tier.name)}`);
                  } else if (type === 'sell' && tier.name === 'Ultimate') {
                    router.push(`/contact?plan=${encodeURIComponent(tier.name)}`);
                  } else {
                    router.push(`/checkout?plan=${encodeURIComponent(tier.name)}&type=${type}`);
                  }
                }}
              >
                {type === 'sell' && tier.name === 'Ultimate'
                  ? 'CONTACT AGENT'
                  : `SELECT ${tier.name.toUpperCase()}`}
              </button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

export const PricingTable: React.FC = () => {
  const router = useRouter();
  const [activeType, setActiveType] = useState<'sell' | 'let' | 'manage'>('sell');
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/content?page=pricing')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          const mapped: Record<string, string> = {};
          data.content.forEach((item: { section_key: string; content_value: string }) => {
            mapped[item.section_key] = item.content_value;
          });
          setOverrides(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch pricing overrides:', err));
  }, []);

  const { tiers: staticTiers, features } = getPricingData(activeType);

  // Apply overrides
  const tiers = staticTiers.map(tier => {
    const baseKey = `${activeType}_${tier.name.toLowerCase()}`;
    return {
      ...tier,
      price: overrides[`${baseKey}_price`] || tier.price,
      subtitle: overrides[`${baseKey}_subtitle`] || tier.subtitle,
      isPopular: overrides[`${baseKey}_popular`] === 'true' ? true : (overrides[`${baseKey}_popular`] === 'false' ? false : tier.isPopular),
      highlight: overrides[`${baseKey}_highlight`] || tier.highlight,
    };
  });

  return (
    <div className={styles.container}>

      {/* Toggle Selector */}
      <div className={styles.toggleWrapper}>
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleBtn} ${activeType === 'sell' ? styles.toggleActive : ''}`}
            onClick={() => setActiveType('sell')}
          >
            I want to SELL
          </button>
          <button
            className={`${styles.toggleBtn} ${activeType === 'let' ? styles.toggleActive : ''}`}
            onClick={() => setActiveType('let')}
          >
            I want to LET
          </button>
          <button
            className={`${styles.toggleBtn} ${activeType === 'manage' ? styles.toggleActive : ''}`}
            onClick={() => setActiveType('manage')}
          >
            Management
          </button>
          <div className={`${styles.toggleSlider} ${activeType === 'let' ? styles.sliderLet :
              activeType === 'manage' ? styles.sliderManage : ''
            }`} />
        </div>
      </div>

      <p className={styles.subtitle}>
        {activeType === 'sell' && "Professional estate agency services at a fraction of the cost."}
        {activeType === 'let' && "Find the perfect tenant with our comprehensive letting packages."}
        {activeType === 'manage' && "Experienced property management for complete peace of mind."}
      </p>

      {/* Desktop: full comparison table */}
      <div className={styles.desktopOnly}>
        <DesktopPricingTable tiers={tiers} features={features} type={activeType} router={router} />
      </div>

      {/* Mobile: card-based selector */}
      <div className={styles.mobileOnly}>
        <MobilePricingCards key={activeType} tiers={tiers} features={features} type={activeType} router={router} />
      </div>

      <div className={styles.bespokeCall}>
        <p>Bespoke Service Call: <strong>0800 6890604</strong></p>
      </div>

      <ManagementInfo isVisible={activeType === 'manage'} />
    </div>
  );
};
