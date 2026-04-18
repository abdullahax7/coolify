"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Captcha from '@/components/common/Captcha';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
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
          <div className={styles.logo}>PROPERTY <span>TRADER</span></div>
          <h1>Join us <span>today.</span></h1>
          <p>Create a free account to list your property, access services, and manage everything in one place.</p>
          <div className={styles.trustItems}>
            <div className={styles.trustItem}><span>⚡</span> Get listed in minutes</div>
            <div className={styles.trustItem}><span>💰</span> Save on agent fees</div>
            <div className={styles.trustItem}><span>📞</span> Dedicated support team</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          <h2>Create Account</h2>
          <p className={styles.sub}>Already have an account? <Link href="/login">Sign in</Link></p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Full Name <span>*</span></label>
                <input name="name" type="text" placeholder="John Doe"
                  value={form.name} onChange={handleChange} disabled={loading} />
              </div>
              <div className={styles.field}>
                <label>Phone</label>
                <input name="phone" type="tel" placeholder="+44 7000 000000"
                  value={form.phone} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className={styles.field}>
              <label>Email Address <span>*</span></label>
              <input name="email" type="email" placeholder="john@example.com"
                value={form.email} onChange={handleChange} disabled={loading} />
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Password <span>*</span></label>
                <input name="password" type="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} disabled={loading} />
              </div>
              <div className={styles.field}>
                <label>Confirm Password <span>*</span></label>
                <input name="confirm" type="password" placeholder="Repeat password"
                  value={form.confirm} onChange={handleChange} disabled={loading} />
              </div>
            </div>

            <Captcha onChange={handleCaptcha} />

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading || !captchaToken}>
              {loading ? <span className={styles.spinner} /> : 'Create Account →'}
            </button>
          </form>

          <p className={styles.terms}>
            By registering you agree to our <Link href="/contact">Terms of Service</Link> and <Link href="/contact">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
