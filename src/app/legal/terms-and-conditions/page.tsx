import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../legal.module.css';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>Legal & Usage</p>
            <h1>Terms and Conditions</h1>
          </header>
          
          <div className={styles.content}>
            <h2>BACKGROUND:</h2>
            <p>
              These Terms and Conditions, together with any and all other documents referred to herein, 
              set out the terms of use under which you may use this website, www.propertytrader1.com. 
              Please read these Terms and Conditions carefully and ensure that you understand them. 
              Your agreement to comply with and be bound by these Terms and Conditions is deemed to 
              occur upon your first use of Our Site. If you do not agree to comply with and be bound 
              by these Terms and Conditions, you must stop using Our Site immediately.
            </p>

            <h2>1. Definitions and Interpretation</h2>
            <p>In these Terms and Conditions, unless the context otherwise requires, the following expressions have the following meanings:</p>
            <ul>
              <li><strong>"Content"</strong> means any and all text, images, audio, video, scripts, code, software, databases and any other form of information capable of being stored on a computer that appears on, or forms part of, Our Site; and</li>
              <li><strong>"We/Us/Our"</strong> means Property Trader Nts Letting and Sales whose trading address is 113-114 Commercial Road Newport City NP20 2GW and whose main trading.</li>
            </ul>

            <h2>2. Information About Us</h2>
            <p>
              Our Site, <strong>www.propertytrader1.com</strong>, is owned and operated by Mohammed Athar Rashid T/A 
              Property Trader Nts Letting and Sales address is 113-114 Commercial Road Newport City NP20 2GW.
            </p>

            <h2>3. Access to Our Site</h2>
            <ul>
              <li>Access to Our Site is free of charge.</li>
              <li>It is your responsibility to make any and all arrangements necessary in order to access Our Site.</li>
              <li>Access to Our Site is provided "as is" and on an "as available" basis. We may alter, suspend or discontinue Our Site (or any part of it) at any time and without notice. We will not be liable to you in any way if Our Site (or any part of it) is unavailable at any time and for any period.</li>
            </ul>

            <h2>4. Intellectual Property Rights</h2>
            <ul>
              <li>
                All Content included on Our Site and the copyright and other intellectual property rights 
                subsisting in that Content, unless specifically labelled otherwise, belongs to or has 
                been licensed by Us. All Content is protected by applicable United Kingdom and international 
                intellectual property laws and treaties.
              </li>
              <li>
                You may not reproduce, copy, distribute, sell, rent, sub-licence, store, or in any other 
                manner re-use Content from Our Site unless given express written permission to do so by Us.
              </li>
              <li>You may access, view and use Our Site in a web browser; download Our Site (or any part of it) for caching; print pages; and save pages for later offline viewing.</li>
            </ul>

            <h2>5. Links to Our Site</h2>
            <p>
              You may link to Our Site provided that you do so in a fair and legal manner; you do not 
              imply any form of association, endorsement or approval on Our part where none exists; 
              and you do not use any logos or trademarks without Our express written permission.
            </p>

            <h2>6. Links to Other Sites</h2>
            <p>
              Links to other sites may be included on Our Site. Unless expressly stated, these 
              sites are not under Our control. We neither assume nor accept responsibility or 
              liability for the content of third party sites.
            </p>

            <h2>7. Disclaimers</h2>
            <p>
              Nothing on Our Site constitutes advice on which you should rely. It is provided for 
              general information purposes only. Insofar as is permitted by law, We make no 
              representation, warranty, or guarantee that Our Site will meet your requirements.
            </p>

            <h2>8. Our Liability</h2>
            <p>
              To the fullest extent permissible by law, We accept no liability to any user for any loss 
              or damage, whether foreseeable or otherwise, in contract, tort (including negligence), 
              for breach of statutory duty, or otherwise, arising out of or in connection with the 
              use of (or inability to use) Our Site or the use of or reliance upon any Content.
            </p>

            <h2>9. Viruses, Malware and Security</h2>
            <p>
              We exercise all reasonable skill and care to ensure that Our Site is secure and 
              free from viruses and other malware. You are responsible for protecting your 
              hardware, software, data and other material from viruses, malware, and other 
              internet security risks.
            </p>

            <h2>10. Data Protection</h2>
            <p>
              All personal information that We may use will be collected, processed, and held in 
              accordance with the provisions of EU Regulation 2016/679 General Data Protection 
              Regulation ("GDPR") and your rights under the GDPR.
            </p>

            <h2>11. Law and Jurisdiction</h2>
            <p>
              These Terms and Conditions, and the relationship between you and Us (whether contractual 
              or otherwise) shall be governed by, and construed in accordance with the law of England & Wales.
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
