'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#0f172a',
          color: '#f8fafc',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ fontSize: '2rem', margin: 0, marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            A critical error occurred. Please try again or return to the homepage.
          </p>
          {error?.digest && (
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.5rem', opacity: 0.7 }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              background: '#e11d48',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              marginRight: '0.5rem',
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: '1px solid #334155',
              color: '#f8fafc',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            Homepage
          </a>
        </div>
      </body>
    </html>
  );
}
