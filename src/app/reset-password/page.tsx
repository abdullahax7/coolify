"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { updatePassword } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import styles from './reset-password.module.css';

type Stage = 'verifying' | 'ready' | 'invalid' | 'submitting' | 'done';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('verifying');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  // When the user lands on this page from the email link, Supabase parses the
  // recovery tokens from the URL fragment and emits PASSWORD_RECOVERY. We
  // listen for that to confirm the link was valid before showing the form.
  useEffect(() => {
    const supabase = createClient();
    let resolved = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        resolved = true;
        setStage('ready');
      }
    });

    // Fallback: if a session already exists (recovery already parsed), accept it.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !resolved) {
        resolved = true;
        setStage('ready');
      }
    });

    // Give Supabase a moment to parse the URL fragment, then declare invalid.
    const timeout = setTimeout(() => {
      if (!resolved) setStage('invalid');
    }, 2500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setStage('submitting');
    const { error: err } = await updatePassword(password);
    if (err) {
      setError(err);
      setStage('ready');
      return;
    }
    setStage('done');
    // Auto-redirect after a brief success view.
    setTimeout(() => router.push('/login'), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Link href="/" className={styles.backLink}>← Back to site</Link>
          <Logo className={styles.logo} showPhone={false} variant="sidebar" />
          <h1>Set a new <span>password.</span></h1>
          <p>Choose a strong password for your account. After saving, you&apos;ll be redirected to sign in.</p>
          <div className={styles.trustItems}>
            <div className={styles.trustItem}><span>🔑</span> Use at least 8 characters</div>
            <div className={styles.trustItem}><span>🔒</span> Mix letters, numbers and symbols</div>
            <div className={styles.trustItem}><span>📵</span> Don&apos;t reuse old passwords</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          {stage === 'verifying' && (
            <div className={styles.centered}>
              <div className={styles.spinnerLarge} />
              <p className={styles.muted}>Verifying your reset link…</p>
            </div>
          )}

          {stage === 'invalid' && (
            <div className={styles.successState}>
              <div className={styles.errorIcon}>!</div>
              <h2>Link expired or invalid</h2>
              <p>
                This password reset link is no longer valid. Reset links expire after 24 hours and can only be used once.
              </p>
              <Link href="/forgot-password" className={styles.backToLogin}>Request a new link →</Link>
            </div>
          )}

          {stage === 'done' && (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✓</div>
              <h2>Password updated</h2>
              <p>You can now sign in with your new password. Redirecting you to the sign-in page…</p>
              <Link href="/login" className={styles.backToLogin}>Sign in now →</Link>
            </div>
          )}

          {(stage === 'ready' || stage === 'submitting') && (
            <>
              <h2>New password</h2>
              <p className={styles.sub}>Pick something memorable but hard to guess.</p>

              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.field}>
                  <label htmlFor="new-password">New password</label>
                  <div className={styles.passwordRow}>
                    <input
                      id="new-password"
                      name="password"
                      type={show ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      disabled={stage === 'submitting'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(s => !s)}
                      className={styles.showBtn}
                      aria-label={show ? 'Hide password' : 'Show password'}
                    >
                      {show ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="confirm-password">Confirm new password</label>
                  <input
                    id="confirm-password"
                    name="confirm"
                    type={show ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    disabled={stage === 'submitting'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    aria-required="true"
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button type="submit" className={styles.submitBtn} disabled={stage === 'submitting'}>
                  {stage === 'submitting' ? <span className={styles.spinner} /> : 'Save New Password →'}
                </button>
              </form>

              <p className={styles.dividerText}>or</p>
              <Link href="/login" className={styles.altBtn}>Back to Sign In</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
