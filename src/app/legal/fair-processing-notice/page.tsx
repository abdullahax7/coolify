import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../legal.module.css';
import Link from 'next/link';

export default function TenantFairProcessingNotice() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>Tenant Notice</p>
            <h1>Personal Data Fair Processing Notice</h1>
          </header>
          
          <div className={styles.content}>
            <p>
              This notice explains what information we collect, when we collect it and how we use this. 
              During the course of our activities, we will process personal data (which may be held on 
              paper, electronically, or otherwise) about you and we recognise the need to treat it 
              in an appropriate and lawful manner.
            </p>

            <h2>Who are we?</h2>
            <p>
              Mohammed Athar Rashid T/A Property Trader Nts Letting And Sales at 113-114 Commercial Road, 
              Newport City NP20 2GW, takes the issue of security and data protection very seriously and 
              strictly adheres to guidelines published in the General Data Protection Regulation (EU) 2016/679.
            </p>
            <p>
              We are notified as a Data Controller with the Office of the Information Commissioner under 
              registration number <strong>#ZA326361</strong>.
            </p>

            <h2>How we collect information from you</h2>
            <p>We collect information about you from:</p>
            <ul>
              <li>Your application for accommodation.</li>
              <li>Relevant third parties (employers, references).</li>
            </ul>

            <h2>What information do we collect?</h2>
            <ul>
              <li><strong>Tenant/Guarantor Details:</strong> Name, e-mail, phone, DoB, addresses, marital status, National Insurance Number, nationality, next of kin.</li>
              <li><strong>Property Details:</strong> Term, rent, deposit, utility and service responsibilities.</li>
              <li><strong>Employment Status:</strong> Salary information, employer contact details, length of employment.</li>
              <li><strong>Financial Details:</strong> Bank account details, account number, sort code, credit card or loan agreements.</li>
              <li><strong>Eligibility:</strong> Any welfare benefits you may be eligible for.</li>
            </ul>

            <h2>Why we need this information</h2>
            <ul>
              <li>To perform our obligations in accordance with our contract with you.</li>
              <li>To supply you with the services and information which you have requested.</li>
              <li>To help you to manage your tenancy.</li>
              <li>To carry out due diligence on prospective tenants and guarantors.</li>
              <li>To contact you regarding changes to our suppliers which may affect you.</li>
            </ul>

            <h2>Sharing Your Information</h2>
            <p>
              The information you provide to us will be treated as confidential and will only be shared 
              with third parties who act for us, including:
            </p>
            <ul>
              <li>Third parties carrying out due diligence/affordability checks.</li>
              <li>Parties assisting in recovery of debt if payments are missed.</li>
              <li>Service/utility providers, local authorities, and tenancy deposit schemes.</li>
            </ul>

            <h2>Security</h2>
            <p>
              When you give Property Trader information we take steps to make sure that your 
              personal information is kept secure and safe.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right at any time to:</p>
            <ul>
              <li>Ask for a copy of the information about you held by us.</li>
              <li>Require us to correct any inaccuracies in your information.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to receiving marketing communications.</li>
            </ul>

            <div className={styles.addressBlock}>
              <strong>Contact:</strong><br />
              Email: info@propertytrader1.co.uk<br />
              Tel: 01633 46100
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
