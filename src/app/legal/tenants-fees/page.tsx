"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../legal.module.css';
import Link from 'next/link';

export default function TenantsFees() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>Tenancy Information</p>
            <h1>Tenants Fees & Welcome Pack</h1>
          </header>
          
          <div className={styles.content}>
            <div className={styles.downloadSection}>
              <h2>Welcome Pack</h2>
              <p>Welcome pack for New tenants welcome letter 2024</p>
              <button className={styles.primaryBtn} onClick={() => window.open('https://propertytrader1.com/welcome-pack.pdf', '_blank')}>
                Download Tenants Welcome Pack
              </button>
            </div>

            <hr className={styles.divider} />

            <h2>Fees Information</h2>
            <p><strong>Property Trader will not charge finder fees or introductory fees.</strong> The following fees will apply:</p>
            
            <div className={styles.feesGrid}>
              <div className={styles.feeItem}>
                <span className={styles.feeAmount}>£50</span>
                <p>For name change on tenancy</p>
              </div>
              <div className={styles.feeItem}>
                <span className={styles.feeAmount}>£15</span>
                <p>Lost key or replacement key</p>
              </div>
              <div className={styles.feeItem}>
                <span className={styles.feeAmount}>3%</span>
                <p>Late rent fee of more than 14 days (charged at 3% above Bank of England base rate)</p>
              </div>
            </div>

            <p className={styles.note}>
              For more information on full fees payable, please visit our Tenants Section on the main website.
            </p>

            <hr className={styles.divider} />

            <h2>Useful Contact Information</h2>
            <div className={styles.contactList}>
              <div className={styles.contactEntry}>
                <strong>Newport City Council</strong>
                <span>(01633) 656 656</span>
              </div>
              <div className={styles.contactEntry}>
                <strong>Cardiff City Council</strong>
                <span>029 2087 2087</span>
              </div>
              <div className={styles.contactEntry}>
                <strong>Welsh Water</strong>
                <span>0800 052 0145</span>
              </div>
              <div className={styles.contactEntry}>
                <strong>Wales and West Utilities</strong>
                <span>02920 278500</span>
              </div>
              <div className={styles.contactEntry}>
                <strong>Western Power</strong>
                <span>0800 096 3080</span>
              </div>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
