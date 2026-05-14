'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error]', error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        color: 'var(--foreground)',
        background: 'var(--background)',
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <p
          style={{
            color: 'var(--primary)',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            marginBottom: '0.75rem',
          }}
        >
          Something went wrong
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.6rem)', margin: 0, marginBottom: '0.9rem', lineHeight: 1.2 }}>
          We hit an unexpected issue
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
          The problem has been logged. Please try again, or contact us if it keeps happening.
        </p>
        {error?.digest && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem', opacity: 0.7 }}>
            Reference: {error.digest}
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go to Homepage
          </Link>
          <Link
            href="/contact"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
