"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './we-buy-any-house.module.css';

export default function CashBuyPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    price: '',
    address: '',
    postcode: ''
  });
  const [status, setStatus] = useState<'idle' | 'busy' | 'done'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('busy');
    
    // Simulate API call and save to localStorage for admin panel
    setTimeout(() => {
      const inquiries = JSON.parse(localStorage.getItem('pt_cash_inquiries') || '[]');
      const newInquiry = {
        ...form,
        id: `CASH-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'new'
      };
      localStorage.setItem('pt_cash_inquiries', JSON.stringify([newInquiry, ...inquiries]));
      
      setStatus('done');
      setForm({ name: '', phone: '', email: '', price: '', address: '', postcode: '' });
    }, 1000);
  };

  const set = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroBadge}>UK&apos;s Trusted Cash Buyer</div>
            <h1 className={styles.heroTitle}>Sell Your House Fast <span>For Cash</span></h1>
            <p className={styles.heroSubtitle}>
              Get a guaranteed offer in 24 hours. No fees, no viewings, and total peace of mind.
              We buy houses in any condition, across the UK.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className={styles.formSection}>
          <div className={styles.container}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                {status === 'done' ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
                    <h2 style={{ color: 'var(--primary)' }}>Offer Request Received!</h2>
                    <p>Thank you. One of our property experts will review your details and contact you within 24 hours with a formal offer.</p>
                    <button className={styles.submitBtn} style={{ marginTop: '24px', background: 'var(--secondary)', color: 'white', padding: '12px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer' }} onClick={() => setStatus('idle')}>Submit Another Request</button>
                  </div>
                ) : (
                  <>
                    <h2>Get Your <span>Free Offer</span></h2>
                    <p>Complete the form below and we&apos;ll be in touch within 24 hours.</p>
                  </>
                )}
              </div>

              {status !== 'done' && (
                <form className={styles.form} onSubmit={submit}>
                  <div className={styles.inputGroup}>
                    <div className={styles.field}>
                      <label>Full Name</label>
                      <input type="text" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div className={styles.field}>
                      <label>Phone Number</label>
                      <input type="tel" placeholder="07123 456789" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.field}>
                      <label>Email Address</label>
                      <input type="email" placeholder="john@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                    </div>
                    <div className={styles.field}>
                      <label>Asking Price (£)</label>
                      <input type="text" placeholder="e.g. 250,000" value={form.price} onChange={e => set('price', e.target.value)} required />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Property Address</label>
                    <input type="text" placeholder="House number and street name" value={form.address} onChange={e => set('address', e.target.value)} required />
                  </div>

                  <div className={styles.field}>
                    <label>Postcode</label>
                    <input type="text" placeholder="e.g. CF10 1AA" value={form.postcode} onChange={e => set('postcode', e.target.value)} required />
                  </div>

                  <button type="submit" disabled={status === 'busy'} style={{ padding: '16px', background: status === 'busy' ? '#94a3b8' : '#e11d48', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: status === 'busy' ? 'not-allowed' : 'pointer', marginTop: '12px' }}>
                    {status === 'busy' ? 'Sending...' : 'Submit Request →'}
                  </button>

                  <p className={styles.formNote}>
                    By submitting this form, you agree to our terms and conditions. Your data is handled securely and we will only contact you regarding your offer.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className={styles.processSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>How It <span>Works</span></h2>
              <p>Our 3-step process to a fast, stress-free sale.</p>
            </div>

            <div className={styles.processGrid}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>01</div>
                <h3>Request Offer</h3>
                <p>Call or email us with your property details. We&apos;ll research your area and value your property instantly.</p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>02</div>
                <h3>Receive Offer</h3>
                <p>We&apos;ll provide a formal cash offer within 24 hours. There&apos;s no obligation to accept.</p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>03</div>
                <h3>Cash In Bank</h3>
                <p>If you accept, we&apos;ll instruct lawyers and complete the sale in as little as 7-14 days.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🤝</div>
                <h3>NAPB Approved</h3>
                <p>Member of the National Association of Property Buyers.</p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🆓</div>
                <h3>Zero Costs</h3>
                <p>No agency fees, no legal fees, no hidden costs.</p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🔄</div>
                <h3>Any Chain</h3>
                <p>We buy even if you have a broken chain or need a quick move.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
