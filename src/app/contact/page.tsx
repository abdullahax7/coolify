"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './contact.module.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      } else {
        // Save message for admin panel
        try {
          const msgs = JSON.parse(localStorage.getItem('pt_messages') || '[]');
          msgs.unshift({ id: `MSG-${Date.now()}`, ...form, receivedAt: new Date().toISOString(), read: false });
          localStorage.setItem('pt_messages', JSON.stringify(msgs));
        } catch { /* ignore */ }
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.badge}>Get In Touch</div>
            <h1>Contact <span>Property Trader</span></h1>
            <p className={styles.subtitle}>
              Ready to elevate your property experience? Speak with our dedicated specialists today.
            </p>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.container}>
            <div className={styles.grid}>

              {/* ── Contact Info ── */}
              <div className={styles.contactInfo}>
                <h2>Direct <span>Lines</span></h2>

                <div className={styles.infoItem}>
                  <span className={styles.icon}>📞</span>
                  <div>
                    <label>Freephone</label>
                    <a href="tel:08006890604">0800 6890604</a>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>✉️</span>
                  <div>
                    <label>Email Support</label>
                    <a href="mailto:info@propertytrader1.co.uk">info@propertytrader1.co.uk</a>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📍</span>
                  <div>
                    <label>Headquarters</label>
                    <address>113-114 Commercial Road, Newport, NP20 2GW</address>
                  </div>
                </div>

                <div className={styles.officeHours}>
                  <h3>Office Hours</h3>
                  <ul>
                    <li><span>Monday – Friday</span><span>08:00 – 19:00</span></li>
                    <li><span>Saturday</span><span>09:00 – 16:00</span></li>
                    <li><span>Sunday</span><span>Closed</span></li>
                  </ul>
                </div>
              </div>

              {/* ── Contact Form ── */}
              <div className={styles.formWrapper}>
                {status === 'success' ? (
                  <div className={styles.successState}>
                    <div className={styles.successIcon}>✓</div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. We'll get back to you within 1 business day.</p>
                    <button className={styles.resetBtn} onClick={() => setStatus('idle')}>
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name <span className={styles.required}>*</span></label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={handleChange}
                          required
                          disabled={status === 'loading'}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address <span className={styles.required}>*</span></label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                          disabled={status === 'loading'}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+44 7000 000000"
                          value={form.phone}
                          onChange={handleChange}
                          disabled={status === 'loading'}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="subject">Subject</label>
                        <select
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          disabled={status === 'loading'}
                        >
                          <option value="">Select a subject…</option>
                          <option>Property Management Enquiry</option>
                          <option>Lettings Enquiry</option>
                          <option>Sales Enquiry</option>
                          <option>Investment Advice</option>
                          <option>We Buy Any House</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="message">Message <span className={styles.required}>*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        required
                        disabled={status === 'loading'}
                      />
                    </div>

                    {status === 'error' && (
                      <div className={styles.errorBanner}>{errorMsg}</div>
                    )}

                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <span className={styles.spinner} />
                      ) : (
                        'Send Message →'
                      )}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
