import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../legal.module.css';
import Link from 'next/link';

export default function ComplaintsPolicy() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>Customer Service</p>
            <h1>Complaints Procedure</h1>
          </header>
          
          <div className={styles.content}>
            <p>
              Property Trader Nts Letting and Sales are committed to providing a professional service to all our 
              clients and customers. So when something goes wrong, please first tell us, this will help us 
              to improve our standards.
            </p>

            <h2>How to Raise a Complaint</h2>
            <p>
              Please put your complaint in writing, or email it to <strong>info@propertytrader1.co.uk</strong> 
              including as much detail as possible. You can also call us on <strong>01633 746100</strong> 
              (10:30am to 5:30pm Monday to Friday).
            </p>
            <div className={styles.addressBlock}>
              <strong>Postal Address:</strong><br />
              Nts Plaza – 113-114 Commercial Road, Newport City, NP20 2GW
            </div>

            <h2>What will happen next?</h2>
            <ul>
              <li>
                <strong>Acknowledgement:</strong> We will send you a letter acknowledging receipt of your 
                complaint within three working days.
              </li>
              <li>
                <strong>Investigation:</strong> Our office manager will review your file and investigate 
                the matter. A formal written outcome will be sent to you within 15 working days.
              </li>
              <li>
                <strong>Review:</strong> If you are still not satisfied, you can contact us for a 
                separate review by a senior member of staff. We will provide our final viewpoint within 15 working days.
              </li>
            </ul>

            <h2>Independent Redress</h2>
            <p>
              If you remain dissatisfied, you can contact the Property Redress Scheme for an independent review. 
              You must refer your complaint to them within 12 months of receiving our final viewpoint letter.
            </p>
            
            <div className={styles.addressBlock}>
              <strong>Property Redress Scheme</strong><br />
              Membership Number: PRS005537<br />
              Tel: 0333 321 9418<br />
              Email: info@theprs.co.uk
            </div>

            <h2>Client Money Protection</h2>
            <p>
              Mohammed Athar Rashid T/A Property Trader Nts Letting and Sales is a member of 
              <strong>Client Money Protect (CMP)</strong>. 
              Membership Number: <strong>CMP003620</strong>.
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
