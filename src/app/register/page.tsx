"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, saveUser } from '@/lib/auth';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getUser()) router.replace('/dashboard');
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => {
      saveUser({ name: form.name, email: form.email, phone: form.phone, createdAt: new Date().toISOString() });
      router.push('/dashboard');
    }, 800);
  };

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

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
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
