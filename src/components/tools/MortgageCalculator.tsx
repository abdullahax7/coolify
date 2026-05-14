"use client";

import React, { useState } from 'react';
import styles from './Calculators.module.css';

export const MortgageCalculator: React.FC = () => {
  const [price, setPrice] = useState(500000);
  const [deposit, setDeposit] = useState(50000);
  const [interest, setInterest] = useState(4.5);
  const [term, setTerm] = useState(25);
  const principal = price - deposit;
  const monthlyRate = interest / 100 / 12;
  const numberOfPayments = term * 12;

  let monthlyRepayment = 0;
  if (monthlyRate === 0) {
    monthlyRepayment = principal / numberOfPayments;
  } else {
    monthlyRepayment = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  return (
    <div className={styles.grid}>
      <div className={styles.inputs}>
        <div className={styles.inputGroup}>
          <label>Property Price (£)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))} 
            placeholder="e.g. 500,000"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Deposit Amount (£)</label>
          <input 
            type="number" 
            value={deposit} 
            onChange={(e) => setDeposit(Number(e.target.value))} 
            placeholder="e.g. 50,000"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Interest Rate (%)</label>
          <input 
            type="number" 
            step="0.1"
            value={interest} 
            onChange={(e) => setInterest(Number(e.target.value))} 
            placeholder="e.g. 4.5"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Loan Term (Years)</label>
          <input 
            type="number" 
            value={term} 
            onChange={(e) => setTerm(Number(e.target.value))} 
            placeholder="e.g. 25"
          />
        </div>
      </div>

      <div className={styles.results}>
        <div className={styles.resultItem}>
          <p className={styles.resultLabel}>Monthly Repayment</p>
          <h2 className={`${styles.resultValue} ${styles.highlight}`}>
            £{monthlyRepayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
             <span>Principal Loan</span>
             <span className={styles.breakdownValue}>£{(price - deposit).toLocaleString()}</span>
          </div>
          <div className={styles.breakdownItem}>
             <span>Total Amount Repaid</span>
             <span className={styles.breakdownValue}>
                £{(monthlyRepayment * term * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
             </span>
          </div>
          <div className={styles.breakdownItem}>
             <span>Total Interest Cost</span>
             <span className={styles.breakdownValue}>
                £{((monthlyRepayment * term * 12) - (price - deposit)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};
