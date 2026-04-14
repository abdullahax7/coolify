"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, saveUser } from '@/lib/auth';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
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
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      const name = form.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      saveUser({ name, email: form.email, createdAt: new Date().toISOString() });
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Link href="/" className={styles.backLink}>← Back to site</Link>
          <div className={styles.logo}>PROPERTY <span>TRADER</span></div>
          <h1>Welcome <span>back.</span></h1>
          <p>Sign in to manage your listings, track orders, and access your dashboard.</p>
          <div className={styles.trustItems}>
            <div className={styles.trustItem}><span>🏠</span> Manage your property listings</div>
            <div className={styles.trustItem}><span>📊</span> Track your plans & orders</div>
            <div className={styles.trustItem}><span>🔒</span> Secure & confidential</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          <h2>Sign In</h2>
          <p className={styles.sub}>Don't have an account? <Link href="/register">Create one free</Link></p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label>Email Address</label>
              <input name="email" type="email" placeholder="john@example.com"
                value={form.email} onChange={handleChange} disabled={loading} />
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabelRow}>
                <label>Password</label>
                <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
              </div>
              <input name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} disabled={loading} />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Sign In →'}
            </button>
          </form>

          <p className={styles.dividerText}>or</p>
          <Link href="/register" className={styles.altBtn}>Create a New Account</Link>
        </div>
      </div>
    </div>
  );
}
