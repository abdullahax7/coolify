"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Link href="/" className={styles.backLink}>← Back to site</Link>
          <div className={styles.logo}>PROPERTY <span>TRADER</span></div>
          <h1>Reset your <span>password.</span></h1>
          <p>Enter your registered email address and we'll send you instructions to reset your password.</p>
          <div className={styles.trustItems}>
            <div className={styles.trustItem}><span>📧</span> Check your inbox after submitting</div>
            <div className={styles.trustItem}><span>⏱️</span> Link expires after 24 hours</div>
            <div className={styles.trustItem}><span>🔒</span> Your account stays secure</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          {submitted ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✓</div>
              <h2>Check your email</h2>
              <p>
                If <strong>{email}</strong> is registered with us, you'll receive password reset instructions shortly. Check your spam folder if you don't see it within a few minutes.
              </p>
              <Link href="/login" className={styles.backToLogin}>← Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h2>Forgot Password</h2>
              <p className={styles.sub}>
                Remember your password? <Link href="/login">Sign in instead</Link>
              </p>

              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.field}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : 'Send Reset Instructions →'}
                </button>
              </form>

              <p className={styles.dividerText}>or</p>
              <Link href="/register" className={styles.altBtn}>Create a New Account</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
