import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../legal.module.css';
import Link from 'next/link';

export default function DataProtectionPolicy() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>Policy & Procedure</p>
            <h1>Data Protection Policy</h1>
          </header>
          
          <div className={styles.content}>
            <h2>1. Policy Statement</h2>
            <p>
              Mohammed Athar Rashid T/A Property Trader Nts Letting & Sales is committed to being 
              clear and transparent about how it collects and uses data and to meeting its data 
              protection obligations.
            </p>

            <h2>2. Data Protection Principles</h2>
            <p>The Agent will comply with data protection law. This means that the personal information we hold must be:</p>
            <ul>
              <li>Used lawfully, fairly and in a transparent way.</li>
              <li>Collected only for valid purposes that we have explained to you clearly.</li>
              <li>Relevant to the purposes we have told you about and limited only to those purposes.</li>
              <li>Accurate and kept up to date.</li>
              <li>Kept only for such time as is necessary for the purposes we have told you about.</li>
              <li>Kept securely.</li>
            </ul>

            <h2>3. Security Measures</h2>
            <p>
              We take the security of your data seriously. We have internal policies and controls 
              in place to prevent your data being lost, accidentally destroyed, misused or disclosed. 
              Internal access to your personal data is restricted to employees who need that access 
              for the performance of their duties.
            </p>

            <h2>4. Third Party Processing</h2>
            <p>
              When the Agent engages third parties to process personal data on its behalf, they 
              do so on the basis of written instructions, are under a duty of confidentiality 
              and are obliged to implement appropriate technical and organisational measures 
              to ensure the security of data.
            </p>

            <h2>5. Data Breaches</h2>
            <p>
              In the event of a data breach, the Agent will notify the ICO and the affected data 
              subjects where legally required to do so.
            </p>

            <div className={styles.addressBlock}>
              <strong>Registration Information:</strong><br />
              ICO Registration Number: ZA326361<br />
              Data Controller: Mohammed Athar Rashid
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
