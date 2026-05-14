"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './we-buy-any-house.module.css';
import { createClient } from '@/lib/supabase/client';

export function CashBuyClient({ content }: { content: Record<string, string> }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    price: '',
    address: '',
    postcode: ''
  });
  const [status, setStatus] = useState<'idle' | 'busy' | 'done'>('idle');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imageUrls.length + files.length > 20) {
      setError('Maximum 20 images allowed.');
      return;
    }

    setUploading(true);
    setError('');
    
    const newUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `cash-inquiries/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cash-inquiries')
        .upload(filePath, file);

      if (uploadError) {
        setError('Failed to upload one or more images.');
        console.error(uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('cash-inquiries')
        .getPublicUrl(filePath);

      newUrls.push(publicUrl);
    }

    setImageUrls(prev => [...prev, ...newUrls]);
    setUploading(false);
  };

  const removeImage = (url: string) => {
    setImageUrls(prev => prev.filter(u => u !== url));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      setError('Please upload at least one image of your property.');
      return;
    }

    setStatus('busy');
    try {
      const res = await fetch('/api/cash-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image_urls: imageUrls }),
      });
      
      if (!res.ok) throw new Error('Submission failed');
      
      setStatus('done');
      setForm({ name: '', phone: '', email: '', price: '', address: '', postcode: '' });
      setImageUrls([]);
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  const set = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroLayout}>
              <div className={styles.heroText}>
                <div className={styles.heroBadge} dangerouslySetInnerHTML={{__html: content.hero_badge || "UK's Trusted Cash Buyer"}} />
                <h1 className={styles.heroTitle} dangerouslySetInnerHTML={{__html: content.hero_title || 'Sell Your House Fast <span>For Cash</span>'}} />
                <p className={styles.heroSubtitle} dangerouslySetInnerHTML={{__html: content.hero_subtitle || 'Get a guaranteed offer in 24 hours. No fees, no viewings, and total peace of mind. We buy houses in any condition, across the UK.'}} />
              </div>
              <div className={styles.heroImage}>
                <Image
                  src={content.hero_image_url || "/sell banner.png"}
                  alt="Sell your house fast for cash with Property Trader UK"
                  width={550}
                  height={450}
                  className={styles.heroIllustration}
                  sizes="(max-width: 768px) 100vw, 550px"
                  priority
                  fetchPriority="high"
                />
              </div>
            </div>
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
                    <h2 style={{ color: 'var(--primary)' }} dangerouslySetInnerHTML={{__html: content.form_success_heading || 'Offer Request Received!'}} />
                    <p dangerouslySetInnerHTML={{__html: content.form_success_text || 'Thank you. One of our property experts will review your details and contact you within 24 hours with a formal offer.'}} />
                    <button className={styles.submitBtn} style={{ marginTop: '24px', background: 'var(--secondary)', color: 'white', padding: '12px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer' }} onClick={() => setStatus('idle')}>Submit Another Request</button>
                  </div>
                ) : (
                  <>
                    <h2 dangerouslySetInnerHTML={{__html: content.form_default_heading || 'Get Your <span>Free Offer</span>'}} />
                    <p dangerouslySetInnerHTML={{__html: content.form_default_text || "Complete the form below and we'll be in touch within 24 hours."}} />
                  </>
                )}
              </div>

              {status !== 'done' && (
                <form className={styles.form} onSubmit={submit}>
                  <div className={styles.inputGroup}>
                    <div className={styles.field}>
                      <label htmlFor="cb-name">Full Name</label>
                      <input id="cb-name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required autoComplete="name" maxLength={80} aria-required="true" />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="cb-phone">Phone Number</label>
                      <input id="cb-phone" name="phone" type="tel" placeholder="07123 456789" value={form.phone} onChange={e => set('phone', e.target.value)} required autoComplete="tel" inputMode="tel" pattern="[\d\s\(\)+\-]{7,20}" aria-required="true" />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.field}>
                      <label htmlFor="cb-email">Email Address</label>
                      <input id="cb-email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" inputMode="email" aria-required="true" />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="cb-price">Asking Price (£)</label>
                      <input id="cb-price" name="price" type="text" placeholder="e.g. 250,000" value={form.price} onChange={e => set('price', e.target.value)} required inputMode="numeric" pattern="[\d,£\s]+" aria-required="true" />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="cb-address">Property Address</label>
                    <input id="cb-address" name="address" type="text" placeholder="House number and street name" value={form.address} onChange={e => set('address', e.target.value)} required autoComplete="street-address" maxLength={200} aria-required="true" />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="cb-postcode">Postcode</label>
                    <input id="cb-postcode" name="postcode" type="text" placeholder="e.g. CF10 1AA" value={form.postcode} onChange={e => set('postcode', e.target.value)} required autoComplete="postal-code" pattern="[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}" title="UK postcode format, e.g. CF10 1AA" aria-required="true" />
                  </div>

                  <div className={styles.field}>
                    <label>Property Images <span style={{ color: '#e11d48' }}>*</span></label>
                    <div className={styles.uploadArea}>
                      <input 
                        type="file" 
                        id="image-upload" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className={styles.fileInput}
                      />
                      <label htmlFor="image-upload" className={styles.uploadLabel}>
                        <i>📷</i>
                        <span>{uploading ? 'Uploading...' : 'Click to upload screenshots/photos'}</span>
                        <small>Max 20 images. At least one required.</small>
                      </label>
                    </div>

                    {imageUrls.length > 0 && (
                      <div className={styles.imageGrid}>
                        {imageUrls.map(url => (
                          <div key={url} className={styles.imageThumb}>
                            <Image src={url} alt="Property" fill style={{ objectFit: 'cover' }} unoptimized />
                            <button type="button" onClick={() => removeImage(url)} title="Remove">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {error && <div className={styles.errorMsg}>{error}</div>}

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
              <h2 dangerouslySetInnerHTML={{__html: content.process_heading || 'How It <span>Works</span>'}} />
              <p dangerouslySetInnerHTML={{__html: content.process_subtext || 'Our 3-step process to a fast, stress-free sale.'}} />
            </div>

            <div className={styles.processGrid}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>01</div>
                <h3 dangerouslySetInnerHTML={{__html: content.step_1_title || 'Request Offer'}} />
                <p dangerouslySetInnerHTML={{__html: content.step_1_desc || "Call or email us with your property details. We'll research your area and value your property instantly."}} />
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>02</div>
                <h3 dangerouslySetInnerHTML={{__html: content.step_2_title || 'Receive Offer'}} />
                <p dangerouslySetInnerHTML={{__html: content.step_2_desc || "We'll provide a formal cash offer within 24 hours. There's no obligation to accept."}} />
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>03</div>
                <h3 dangerouslySetInnerHTML={{__html: content.step_3_title || 'Cash In Bank'}} />
                <p dangerouslySetInnerHTML={{__html: content.step_3_desc || "If you accept, we'll instruct lawyers and complete the sale in as little as 7-14 days."}} />
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
                <h3 dangerouslySetInnerHTML={{__html: content.benefit_1_title || 'NAPB Approved'}} />
                <p dangerouslySetInnerHTML={{__html: content.benefit_1_desc || 'Member of the National Association of Property Buyers.'}} />
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🆓</div>
                <h3 dangerouslySetInnerHTML={{__html: content.benefit_2_title || 'Zero Costs'}} />
                <p dangerouslySetInnerHTML={{__html: content.benefit_2_desc || 'No agency fees, no legal fees, no hidden costs.'}} />
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIcon}>🔄</div>
                <h3 dangerouslySetInnerHTML={{__html: content.benefit_3_title || 'Any Chain'}} />
                <p dangerouslySetInnerHTML={{__html: content.benefit_3_desc || 'We buy even if you have a broken chain or need a quick move.'}} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
