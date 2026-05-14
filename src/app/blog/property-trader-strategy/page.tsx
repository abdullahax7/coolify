"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../blog.module.css';
import Link from 'next/link';

export default function PropertyTraderStrategy() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>25th April 2024 • Our Strategy</p>
            <h1>Property Trader at your service Since 1996</h1>
          </header>
          
          <div className={styles.content}>
            <h2>Our Business Strategy</h2>
            <p>
              The Property Trader business strategy is to focus on organic growth within the UK property 
              advertising market through the delivery of exciting property investment opportunities to 
              private individuals, corporate and institutional investors.
            </p>

            <p>
              We pride ourselves on our ability to provide clients with comprehensive bespoke services 
              and industry-leading independent advice. Since our inception in 1996, we have stayed 
              true to our core values while adapting to the rapidly changing technological landscape 
              of the real estate industry.
            </p>

            <h3>Core Pillars of Service</h3>
            <ul>
              <li><strong>Independence:</strong> Being privately owned allows us to provide unbiased advice.</li>
              <li><strong>Experience:</strong> Over 25 years in the Wales and England markets.</li>
              <li><strong>Innovation:</strong> Leading the way in digital property advertising and management.</li>
              <li><strong>Commitment:</strong> Hard work to ensure the best possible service for every client.</li>
            </ul>

            <p>
              Whether you are looking for a simple tenant introduction or full-scale entire property management, 
              we work extremely hard to ensure we provide the best possible service whatever option you choose.
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
