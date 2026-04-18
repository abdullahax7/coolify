"use client";

import React, { useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth';
import Captcha from '@/components/common/Captcha';
import styles from './login.module.css';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [form, setForm] = useState({ email: '', password: '' });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleCaptcha = useCallback((token: string | null) => setCaptchaToken(token), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (!captchaToken) { setError('Please complete the CAPTCHA.'); return; }
    setLoading(true);
    const { error: err } = await signIn(form.email, form.password, captchaToken);
    if (err) { setError(err); setLoading(false); return; }
    const dest = redirect && redirect.startsWith('/') ? redirect : '/dashboard';
    router.push(dest);
    router.refresh();
  };

  return (
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

      <Captcha onChange={handleCaptcha} />

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submitBtn} disabled={loading || !captchaToken}>
        {loading ? <span className={styles.spinner} /> : 'Sign In →'}
      </button>
    </form>
  );
}

export default function LoginPage() {
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
          <p className={styles.sub}>Don&apos;t have an account? <Link href="/register">Create one free</Link></p>

          <Suspense fallback={<div style={{ height: 200 }} />}>
            <LoginForm />
          </Suspense>

          <p className={styles.dividerText}>or</p>
          <Link href="/register" className={styles.altBtn}>Create a New Account</Link>
        </div>
      </div>
    </div>
  );
}
