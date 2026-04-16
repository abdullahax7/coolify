import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../legal.module.css';
import Link from 'next/link';

export default function LandlordPrivacyNotice() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>Landlord Guidelines</p>
            <h1>GDPR Privacy Notice to Landlord</h1>
          </header>
          
          <div className={styles.content}>
            <h2>Introduction</h2>
            <p>
              Mohammed Athar Rashid T/A Property Trader Nts Letting & Sales is a “data controller”. 
              This means that we are responsible for deciding how we hold and use personal information about you.
              We collect and process personal data relating to landlords and prospective landlords in order to provide:
            </p>
            <ul>
              <li>Lettings services to find a tenant and set up tenancy.</li>
              <li>Deposit holding services.</li>
              <li>Rent collection services.</li>
              <li>Full property management.</li>
            </ul>

            <h2>Data Protection Principles</h2>
            <p>Your personal information must be:</p>
            <ul>
              <li>Used lawfully, fairly and in a transparent way.</li>
              <li>Collected only for valid purposes explained to you.</li>
              <li>Accurate and kept up to date.</li>
              <li>Kept securely and only for as long as necessary.</li>
            </ul>

            <h2>What information do we collect?</h2>
            <p>We process a range of data including:</p>
            <ul>
              <li>Identity and contact details (Name, address, email, phone).</li>
              <li>Bank account details and proof of ownership.</li>
              <li>Accounting, letting, and management records.</li>
              <li>Insurance information and license applications.</li>
              <li>Mortgage details and lender restrictions.</li>
              <li>General correspondence (letters, emails, texts).</li>
            </ul>

            <h2>Why do we process your data?</h2>
            <p>
              We process data to perform our lettings service contract, comply with legal obligations (e.g. deposit schemes), 
              and pursue legitimate interests in managing your property portfolio effectively.
            </p>

            <h2>Sharing Your Data</h2>
            <p>We share your data with third parties where required by law or necessary for our service, including:</p>
            <ul>
              <li>Professional advisers (solicitors, accountants).</li>
              <li>Freeholders or managing agents.</li>
              <li>Local authorities and government bodies.</li>
              <li>Utilities and service providers.</li>
              <li>Contractors and tradespeople.</li>
              <li>Tenancy deposit schemes & HMRC.</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              The period for which your data is held after the end of a tenancy is <strong>three years</strong>. 
              The period for which your data is held is one year for a potential landlord who does not contract for our services.
            </p>

            <h2>Your Rights</h2>
            <p>
              You have the right to access your data, require corrections, request erasure, or object to processing. 
              If you would like to exercise these rights, please contact <strong>Mohammed Athar Rashid</strong>.
            </p>

            <div className={styles.addressBlock}>
              <strong>ICO Contact Information:</strong><br />
              Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF<br />
              Tel: 0303 123 1113
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
