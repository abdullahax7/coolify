"use client";

import React, { useState } from 'react';
import { getPricingData, PricingTier, PricingFeature } from '@/data/pricing_data';
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
  type: 'sell' | 'let';
}

/** Mobile card view — one card per tier with all features listed */
const MobilePricingCards: React.FC<SubComponentProps> = ({ tiers, features, type }) => {
  const [selected, setSelected] = useState(
    tiers.findIndex((t) => t.isPopular) || 0
  );

  // Sync selected index when type changes
  React.useEffect(() => {
    setSelected(tiers.findIndex((t) => t.isPopular) || 0);
  }, [type, tiers]);

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
            onClick={() => window.location.href = `/checkout?plan=${encodeURIComponent(tier.name)}&type=${type}`}
          >
            SELECT {tier.name.toUpperCase()}
          </button>
        </div>
      ))}
    </div>
  );
};

/** Desktop table view */
const DesktopPricingTable: React.FC<SubComponentProps> = ({ tiers, features, type }) => (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th>{/* Feature name column */}</th>
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
                onClick={() => window.location.href = `/checkout?plan=${encodeURIComponent(tier.name)}&type=${type}`}
              >
                SELECT {tier.name.toUpperCase()}
              </button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

export const PricingTable: React.FC = () => {
  const [activeType, setActiveType] = useState<'sell' | 'let'>('sell');
  const { tiers, features } = getPricingData(activeType);

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
          <div className={`${styles.toggleSlider} ${activeType === 'let' ? styles.sliderLet : ''}`} />
        </div>
      </div>

      <p className={styles.subtitle}>
        {activeType === 'sell' 
          ? "Professional estate agency services at a fraction of the cost."
          : "Find the perfect tenant with our comprehensive letting packages."}
      </p>

      {/* Desktop: full comparison table */}
      <div className={styles.desktopOnly}>
        <DesktopPricingTable tiers={tiers} features={features} type={activeType} />
      </div>

      {/* Mobile: card-based selector */}
      <div className={styles.mobileOnly}>
        <MobilePricingCards tiers={tiers} features={features} type={activeType} />
      </div>

      <div className={styles.bespokeCall}>
        <p>Bespoke Service Call: <strong>0800 6890604</strong></p>
      </div>
    </div>
  );
};
