import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
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
          404 — Not Found
        </p>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.6rem)', margin: 0, marginBottom: '0.9rem', lineHeight: 1.2 }}>
          We couldn&apos;t find that page
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
          The link may be broken or the property may have been removed. Try one of the options below.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go to Homepage
          </Link>
          <Link
            href="/properties"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Browse Properties
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
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
