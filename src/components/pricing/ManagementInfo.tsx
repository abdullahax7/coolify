import React from 'react';
import Image from 'next/image';
import styles from './ManagementInfo.module.css';

interface ManagementInfoProps {
  isVisible: boolean;
}

export const ManagementInfo: React.FC<ManagementInfoProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.wrapper}>
      {/* Moving Forward Section */}
      <section className={styles.topSection}>
        <div className={styles.content}>
          <h2 className={styles.title}>Property Asset Management Service</h2>
          <h3 className={styles.subtitle}>Here’s What We Will Do: Moving Forward</h3>
          
          <div className={styles.textBlock}>
            <p>
              If you have decided you do not want the hassle of possible late night telephone calls about the boiler that has suddenly broken down, or the electricity socket that needed a new fuse. It’s also most probable, you do not have the time to organise the sourcing and delivery of a replacement washing machine or chase up the electrician who failed to turn up as pre-arranged but could not be bothered to cancel.
            </p>
            <p>
              Maybe you are an overseas landlord with property assets in need of good management.
            </p>
            <p>
              Don’t worry, it is part of what landlords pay us to do. Manage their residential property assets. You are in very good hands. All you need do is pick up the phone, give us a call and one of our dedicated and qualified property managers will be happy to assist with any questions you may have.
            </p>
          </div>
          
          <button className={styles.ctaBtn}>
            <span className={styles.btnIcon}>→</span> View our properties
          </button>
        </div>
        
        <div className={styles.imageBox}>
          <Image 
            src="/handing_keys.png" 
            alt="Handing keys" 
            width={500} 
            height={500} 
            className={styles.illustration}
          />
        </div>
      </section>

      {/* Offer Section */}
      <section className={styles.bottomSection}>
        <div className={styles.imageBoxLeft}>
          <Image 
            src="/signing_contract.png" 
            alt="Signing contract" 
            width={500} 
            height={500} 
            className={styles.illustration}
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>And Here’s What We Offer!</h2>
          <h4 className={styles.accentText}>Whatever your requirements, we would endeavour to accommodate</h4>
          
          <ul className={styles.list}>
            <li>Terms and conditions of business: We make sure that you have a copy of our operational guide.</li>
            <li>Free and none obligatory rental appraisal for your particular property.</li>
            <li>Professional advice on best rental property practices and landlords statutory obligations.</li>
            <li>Free internet property advertising on effective property portals.</li>
            <li>Carry out appointed and accompanied property viewings.</li>
            <li>The selection process: Candidates are fully checked for affordability and previous landlord reference.</li>
            <li>Arrange provision of statutory Energy Performance Certificate (EPC) where a landlord instructs us to arrange one on their behalf.</li>
            <li>Arrangement of statutory gas safe report where none is provided. Subsequent year on year gas safety check as at when due.</li>
            <li>Carry out property inventory where none has been provided.</li>
            <li>Key hand-overs.</li>
            <li>Arrange statutory tenancy deposit.</li>
            <li>Quarterly property inspection: For the purpose of property assessment and subsequent report to landlord. This means that the landlord is kept on notice with updated reports on each managed property condition.</li>
            <li>Check-in and check-out procedures.</li>
            <li>Collect monthly rent as at when due. Remit same to elected landlord client account; less management fees and approved expenses.</li>
            <li>Regular monthly rental payment statements.</li>
            <li>Carry out necessary minor repairs subject to agreed terms and conditions allowed limit.</li>
            <li>Serve appropriate notices as at when required.</li>
            <li>Arrange rent guarantee insurance where required by landlord client for their peace of mind.</li>
            <li>Urgent mails requiring landlord notification and action are passed on for the landlord client’s attention as quickly as practicable where applicable.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
