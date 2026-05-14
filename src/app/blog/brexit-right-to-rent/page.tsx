"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../blog.module.css';
import Link from 'next/link';

export default function BrexitRightToRent() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>15th August 2024 • Landlords, News</p>
            <h1>How Will Brexit Affect Your Tenants’ Right to Rent?</h1>
          </header>
          
          <div className={styles.content}>
            <h2>What’s changing for citizens from the EU, EEA and Switzerland?</h2>
            <p>
              Most citizens from the EU, EEA and Switzerland, and the family members of EU, EEA and EU countries 
              who are living in the UK will need to apply to the EU Settlement Scheme to continue living in the 
              UK after 30th June 2021.
            </p>
            <p>
              Successful applicants will be granted either settled or pre-settled status. The application 
              deadline is 30th June 2021, however, if the UK leaves the EU without a deal, the application 
              deadline will be 31st December 2020.
            </p>
            
            <p>
              Citizens who are granted settled status can stay in the UK as long as they like and will 
              also be able to apply for British citizenship if eligible. Citizens who are granted pre-settled 
              status can stay in the UK for a further five years from the date they get pre-settled status, 
              however, they can apply to change to settled status once they’ve lived in the UK continuously 
              for five years.
            </p>
            
            <p>
              Those with British or Irish citizenship (including dual citizenship), indefinite leave to 
              enter the UK, or indefinite leave to remain in the UK, will not need to apply to the scheme.
            </p>

            <h2>How does this affect right to rent checks?</h2>
            <p>
              The government issued Brexit guidance for letting agents and landlords earlier this year 
              that said there would be no change to the way EU, EEA and Swiss citizens prove their 
              right to rent until 1st January 2021.
            </p>
            
            <p>
              This remains the same if the UK leaves the EU with or without a deal. You do not need to 
              check if new EEA and Swiss tenants arrived before or after the UK left the EU, or if they 
              have status under the EU Settlement Scheme or European temporary leave to remain.
            </p>
            
            <p>
              You will not need to retrospectively check the status of EU, EEA or Swiss tenants or 
              their family members who entered into a tenancy agreement before 1st January 2021.
            </p>

            <div className={styles.noteBlock}>
              <p>It’s important to note that this article isn’t exhaustive and doesn’t constitute legal advice. Visit gov.uk for the latest Brexit advice.</p>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
