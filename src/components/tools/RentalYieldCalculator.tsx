"use client";

import React, { useState } from 'react';
import styles from './Calculators.module.css';

export const RentalYieldCalculator: React.FC = () => {
  const [price, setPrice] = useState(500000);
  const [rent, setRent] = useState(2500);
  const [expenses, setExpenses] = useState(300);

  const grossYield = ((rent * 12) / price) * 100;
  const netYield = (((rent - expenses) * 12) / price) * 100;

  return (
    <div className={styles.grid}>
      <div className={styles.inputs}>
        <div className={styles.inputGroup}>
          <label>Purchase Price (£)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))} 
            placeholder="e.g. 500,000"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Monthly Rent (£)</label>
          <input 
            type="number" 
            value={rent} 
            onChange={(e) => setRent(Number(e.target.value))} 
            placeholder="e.g. 2,500"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Monthly Expenses (£)</label>
          <input 
            type="number" 
            value={expenses} 
            onChange={(e) => setExpenses(Number(e.target.value))} 
            placeholder="e.g. 300"
          />
        </div>
      </div>

      <div className={styles.results}>
        <div className={styles.resultItem}>
          <p className={styles.resultLabel}>Gross Rental Yield</p>
          <h2 className={`${styles.resultValue} ${styles.highlight}`}>
             {grossYield.toFixed(2)}%
          </h2>
        </div>
        <div className={styles.resultItem}>
          <p className={styles.resultLabel}>Net Rental Yield</p>
          <h2 className={styles.resultValue}>
             {netYield.toFixed(2)}%
          </h2>
        </div>
        <div className={styles.breakdown}>
           <div className={styles.breakdownItem}>
              <span>Annual Rental Income</span>
              <span className={styles.breakdownValue}>£{(rent * 12).toLocaleString()}</span>
           </div>
           <div className={styles.breakdownItem}>
              <span>Annual Net Income</span>
              <span className={styles.breakdownValue}>£{((rent - expenses) * 12).toLocaleString()}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
