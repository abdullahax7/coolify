"use client";

import React, { useState, useEffect } from 'react';
import styles from './Calculators.module.css';

export const StampDutyCalculator: React.FC = () => {
  const [price, setPrice] = useState(500000);
  const [buyerType, setBuyerType] = useState<'standard' | 'first-time' | 'additional'>('standard');
  const [tax, setTax] = useState(0);

  const calculateSDLT = (val: number, type: 'standard' | 'first-time' | 'additional') => {
    let taxAmount = 0;
    const additionalSurcharge = type === 'additional' ? 0.03 : 0;

    if (type === 'first-time' && val <= 625000) {
      if (val > 425000) {
        taxAmount += (val - 425000) * 0.05;
      }
    } else {
      // Standard Rates
      if (val > 1500000) {
        taxAmount += (val - 1500000) * 0.12;
        val = 1500000;
      }
      if (val > 925000) {
        taxAmount += (val - 925000) * 0.10;
        val = 925000;
      }
      if (val > 250000) {
        taxAmount += (val - 250000) * 0.05;
      }
    }

    // Add additional surcharge on the WHOLE property price if applicable
    if (type === 'additional') {
      taxAmount += price * additionalSurcharge;
    }

    return taxAmount;
  };

  useEffect(() => {
    setTax(calculateSDLT(price, buyerType));
  }, [price, buyerType]);

  return (
    <div className={styles.grid}>
      <div className={styles.inputs}>
        <div className={styles.inputGroup}>
          <label>Property Value (£)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))} 
            placeholder="e.g. 500,000"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Buyer Status</label>
          <select 
            value={buyerType} 
            onChange={(e) => setBuyerType(e.target.value as any)}
          >
            <option value="standard">Moving Main Residence</option>
            <option value="first-time">First-time Buyer</option>
            <option value="additional">Additional Property / Buy-to-let</option>
          </select>
        </div>
      </div>

      <div className={styles.results}>
        <div className={styles.resultItem}>
          <p className={styles.resultLabel}>Total Stamp Duty (SDLT)</p>
          <h2 className={`${styles.resultValue} ${styles.highlight}`}>
             £{tax.toLocaleString()}
          </h2>
        </div>
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
             <span>Effective Tax Rate</span>
             <span className={styles.breakdownValue}>{((tax / price) * 100).toFixed(1)}%</span>
          </div>
          <div className={styles.breakdownItem}>
             <span>Net Property Price</span>
             <span className={styles.breakdownValue}>£{(price + tax).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
