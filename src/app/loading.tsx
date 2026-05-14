import React from 'react';
import { Header } from '@/components/layout/Header';

export default function Loading() {
  return (
    <>
      <Header />
      <div
        style={{
          minHeight: 'calc(100vh - 200px)',
          maxWidth: 1280,
          margin: '0 auto',
          padding: '120px 24px 80px',
        }}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="pt-skel" style={{ height: 56, width: '55%', marginBottom: 28, borderRadius: 12 }} />
        <div className="pt-skel" style={{ height: 22, width: '85%', marginBottom: 14, borderRadius: 8 }} />
        <div className="pt-skel" style={{ height: 22, width: '72%', marginBottom: 14, borderRadius: 8 }} />
        <div className="pt-skel" style={{ height: 22, width: '60%', marginBottom: 48, borderRadius: 8 }} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 28,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="pt-skel-card"
              style={{
                borderRadius: 16,
                padding: 20,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
              }}
            >
              <div className="pt-skel" style={{ height: 180, marginBottom: 16, borderRadius: 12 }} />
              <div className="pt-skel" style={{ height: 20, width: '70%', marginBottom: 10, borderRadius: 6 }} />
              <div className="pt-skel" style={{ height: 16, width: '90%', marginBottom: 8, borderRadius: 6 }} />
              <div className="pt-skel" style={{ height: 16, width: '50%', borderRadius: 6 }} />
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pt-skel {
          background: linear-gradient(90deg, #eef2f7 0%, #f8fafc 50%, #eef2f7 100%);
          background-size: 200% 100%;
          animation: pt-shimmer 1.4s ease-in-out infinite;
        }
        .pt-skel-card {
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }
        @keyframes pt-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `,
        }}
      />
    </>
  );
}
