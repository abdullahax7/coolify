"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Captcha from '@/components/common/Captcha';
import styles from './landlord-application.module.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

function LandlordApplicationForm() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || '';

  const [form, setForm] = useState({
    service: initialPlan,
    propertyType: '',
    certificates: [] as string[],
    heating: '',
    glazing: '',
    bathrooms: '',
    toilets: '',
    kitchens: '',
    cooker: '',
    email: '',
    ownerDetails: '',
    rentalProperty: '',
    contactNumber: '',
    rentalPeriodAmount: '',
  });

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [captcha, setCaptcha] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setForm(prev => ({
            ...prev,
            certificates: checked 
                ? [...prev.certificates, value]
                : prev.certificates.filter(c => c !== value)
        }));
    } else {
        setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captcha) {
      setErrorMsg('Please verify you are not a robot.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...form, 
            subject: 'Landlord Fees And Services Application',
            message: `Service: ${form.service}\nProperty: ${form.propertyType}\nCertificates: ${form.certificates.join(', ')}\nHeating: ${form.heating}\nGlazing: ${form.glazing}\nBathrooms: ${form.bathrooms}, Toilets: ${form.toilets}, Kitchens: ${form.kitchens}\nCooker: ${form.cooker}\nOwner: ${form.ownerDetails}\nAddress: ${form.rentalProperty}\nPhone: ${form.contactNumber}\nPeriod/Amount: ${form.rentalPeriodAmount}`,
            captchaToken: captcha
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      } else {
        // Log to "admin portal" (local storage for demo/prototype consistency in this project)
        try {
          const fullMessage = `Service: ${form.service}\nProperty: ${form.propertyType}\nAddress: ${form.rentalProperty}\nBathrooms: ${form.bathrooms}, Toilets: ${form.toilets}, Kitchens: ${form.kitchens}\nHeating: ${form.heating}\nGlazing: ${form.glazing}\nCooker: ${form.cooker}\nCertificates: ${form.certificates.join(', ') || 'None'}\nPeriod/Amount: ${form.rentalPeriodAmount}\nPhone: ${form.contactNumber}`;

          await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.ownerDetails,
              email: form.email,
              phone: form.contactNumber,
              subject: 'Landlord Application',
              message: fullMessage,
            }),
          });
        } catch { /* ignore */ }
        
        setStatus('success');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h3>Application Submitted!</h3>
        <p>Your application for <strong>{form.service}</strong> has been received. Our management team will contact you shortly.</p>
        <button className={styles.resetBtn} onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Select Service *</label>
        <div className={styles.radioGrid}>
          {['Fully Managed 10%', 'Rent Collection 7%', 'Let only', 'Mini Management'].map(s => (
            <label key={s} className={styles.radioItem}>
              <input 
                type="radio" 
                name="service" 
                value={s} 
                checked={form.service.includes(s) || form.service === s} 
                onChange={handleChange} 
                required 
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
        <p className={styles.infoText}>* All services do not charge VAT</p>
      </div>

      <div className={styles.section}>
        <label className={styles.sectionLabel}>Property Description *</label>
        <div className={styles.selectGrid}>
          <div className={styles.fieldGroup}>
            <label>Type & Size</label>
            <select name="propertyType" value={form.propertyType} onChange={handleChange} required>
              <option value="">Select type...</option>
              <option>1 Bedroom House</option>
              <option>2 Bedroom House</option>
              <option>3 Bedroom House</option>
              <option>4 Bedroom House</option>
              <option>HMO</option>
              <option>1 Bedroom Flat</option>
              <option>2 Bedroom Flat</option>
              <option>3 Bedroom Flat</option>
              <option>Others</option>
            </select>
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Bathrooms</label>
            <select name="bathrooms" value={form.bathrooms} onChange={handleChange} required>
              <option value="">Select...</option>
              {[1,2,3,4].map(n => <option key={n} value={n}>{n} Bathroom</option>)}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Toilets</label>
            <select name="toilets" value={form.toilets} onChange={handleChange} required>
              <option value="">Select...</option>
              {[1,2,3].map(n => <option key={n} value={n}>{n} Toilet</option>)}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Kitchens</label>
            <select name="kitchens" value={form.kitchens} onChange={handleChange} required>
              <option value="">Select...</option>
              {[1,2].map(n => <option key={n} value={n}>{n} Kitchen</option>)}
            </select>
          </div>
        </div>

        <div className={styles.checkboxGrid}>
          <label className={styles.fullWidth}>Compliance & Certificates</label>
          {[
            'Current gas certificate', 
            'Current Energy Performance Certificate', 
            'Electrical Certificate', 
            'Lighting Certificate', 
            'Registered with Rent Smart Wales', 
            'Registered with local authorities (England)'
          ].map(c => (
            <label key={c} className={styles.checkItem}>
              <input type="checkbox" name="certificates" value={c} onChange={handleChange} />
              <span>{c}</span>
            </label>
          ))}
        </div>

        <div className={styles.selectGrid}>
          <div className={styles.fieldGroup}>
             <label>Heating</label>
             <select name="heating" value={form.heating} onChange={handleChange} required>
                <option value="">Select...</option>
                <option>Electric Heating</option>
                <option>Gas Heating</option>
             </select>
          </div>
          <div className={styles.fieldGroup}>
             <label>Glazing</label>
             <select name="glazing" value={form.glazing} onChange={handleChange} required>
                <option value="">Select...</option>
                <option>Single Glazed</option>
                <option>Double Glazed</option>
             </select>
          </div>
          <div className={styles.fieldGroup}>
             <label>Cooker Type</label>
             <select name="cooker" value={form.cooker} onChange={handleChange} required>
                <option value="">Select...</option>
                <option>Gas Cooker</option>
                <option>Electric Cooker</option>
             </select>
          </div>
        </div>
      </div>

      <div className={styles.contactSection}>
        <div className={styles.inputGroup}>
          <label>Email Address *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" />
        </div>
        <div className={styles.inputGroup}>
          <label>Owner Full Name(s) *</label>
          <input type="text" name="ownerDetails" value={form.ownerDetails} onChange={handleChange} required placeholder="Full name of owner(s)" />
        </div>
        <div className={styles.inputGroup}>
          <label>Rental Property Address *</label>
          <input type="text" name="rentalProperty" value={form.rentalProperty} onChange={handleChange} required placeholder="Full address of the property" />
        </div>
        <div className={styles.inputGroup}>
          <label>Contact Number *</label>
          <input type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange} required placeholder="Phone number" />
        </div>
        <div className={styles.inputGroup}>
          <label>Rental Period and Amount *</label>
          <input type="text" name="rentalPeriodAmount" value={form.rentalPeriodAmount} onChange={handleChange} required placeholder="e.g. 12 months, £1200 pcm" />
        </div>
      </div>

      {status === 'error' && <div className={styles.errorBanner}>{errorMsg}</div>}
      <Captcha onChange={setCaptcha} />
      
      <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}

export default function LandlordApplicationPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Landlord Fees And <span>Services Application</span></h1>
            <p>Please provide the details of your property and the management service you require.</p>
          </div>
          <Suspense fallback={<div>Loading application form...</div>}>
            <LandlordApplicationForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
