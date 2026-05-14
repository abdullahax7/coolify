"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { useRouter } from 'next/navigation';
import Captcha from '@/components/common/Captcha';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'tenant' as 'tenant' | 'landlord' });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleCaptcha = useCallback((token: string | null) => setCaptchaToken(token), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (!captchaToken) { setError('Please complete the CAPTCHA.'); return; }
    
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      if (data.needsConfirmation) {
        setConfirmed(true);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) return (
    <div className={styles.page}>
      <div className={styles.right} style={{ width: '100%', justifyContent: 'center' }}>
        <div className={styles.formCard} style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <h2>Check your email</h2>
          <p style={{ color: '#64748b', marginTop: '0.75rem', lineHeight: 1.6 }}>
            We sent a confirmation link to <strong>{form.email}</strong>.
            Click the link to activate your account, then come back to sign in.
          </p>
          <Link href="/login" className={styles.submitBtn}
            style={{ display: 'block', marginTop: '1.5rem', textDecoration: 'none', textAlign: 'center' }}>
            Go to Sign In →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Link href="/" className={styles.backLink}>← Back to site</Link>
          <Logo className={styles.logo} showPhone={false} variant="sidebar" />
          <h1>Join us <span>today.</span></h1>
          <p>Create a free account to list your property, access services, and manage everything in one place.</p>
          <div className={styles.trustItems}>
            <div className={styles.trustItem}><span>⚡</span> Get listed in minutes</div>
            <div className={styles.trustItem}><span>💷</span> Save on agent fees</div>
            <div className={styles.trustItem}><span>📞</span> Dedicated support team</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          <h2>Create Account</h2>
          <p className={styles.sub}>Already have an account? <Link href="/login">Sign in</Link></p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.roleSelector}>
              <button 
                type="button" 
                className={`${styles.roleBtn} ${form.role === 'tenant' ? styles.activeRole : ''}`}
                onClick={() => setForm(p => ({ ...p, role: 'tenant' }))}
              >
                <span className={styles.roleIcon}>🔑</span>
                <div className={styles.roleLabel}>
                  <strong>I am a Tenant</strong>
                  <span>Looking for a property</span>
                </div>
              </button>
              <button 
                type="button" 
                className={`${styles.roleBtn} ${form.role === 'landlord' ? styles.activeRole : ''}`}
                onClick={() => setForm(p => ({ ...p, role: 'landlord' }))}
              >
                <span className={styles.roleIcon}>🏠</span>
                <div className={styles.roleLabel}>
                  <strong>I am a Landlord</strong>
                  <span>Listing my property</span>
                </div>
              </button>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="reg-name">Full Name <span>*</span></label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  autoComplete="name"
                  maxLength={80}
                  aria-required="true"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="reg-phone">Phone</label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="+44 7000 000000"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="tel"
                  inputMode="tel"
                  pattern="[\d\s\(\)+\-]{7,20}"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="reg-email">Email Address <span>*</span></label>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="email"
                inputMode="email"
                aria-required="true"
              />
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="reg-password">Password <span>*</span></label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  aria-required="true"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="reg-confirm">Confirm Password <span>*</span></label>
                <input
                  id="reg-confirm"
                  name="confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  aria-required="true"
                />
              </div>
            </div>

            <Captcha onChange={handleCaptcha} />

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading || !captchaToken}>
              {loading ? <span className={styles.spinner} /> : 'Create Account →'}
            </button>
          </form>

          <p className={styles.terms}>
            By registering you agree to our <Link href="/legal/terms-and-conditions">Terms of Service</Link> and <Link href="/legal/privacy-notice-landlord">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
