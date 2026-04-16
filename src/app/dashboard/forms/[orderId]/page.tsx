'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrders, getUser, type Order, type User } from '@/lib/auth';
import styles from './form-editor.module.css';

export default function FormStatusPage() {
  const params  = useParams();
  const orderId = params.orderId as string;
  const router  = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [user,  setUser]  = useState<User  | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/login'); return; }
    setUser(u);
    const o = getOrders().find(ord => ord.id === orderId) || null;
    if (!o || !o.formType) { router.push('/dashboard'); return; }
    setOrder(o);
  }, [orderId, router]);

  const downloadPDF = () => {
    if (!order?.formData?.pdfBase64) return;
    const bytes = Uint8Array.from(atob(order.formData.pdfBase64), c => c.charCodeAt(0));
    const blob  = new Blob([bytes], { type: 'application/pdf' });
    const url   = URL.createObjectURL(blob);
    const a     = Object.assign(document.createElement('a'), {
      href: url,
      download: order.formData.pdfName || `${order.formType}.pdf`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!order) return null;

  const isReady = !!order.formData?.pdfBase64;

  return (
    <div className={styles.page}>
      <div className={styles.container} style={{ maxWidth: 680 }}>

        <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>

        {/* Status card */}
        <div style={{
          marginTop: '2rem',
          background: '#fff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          {/* Coloured top bar */}
          <div style={{
            background: isReady ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
            padding: '28px 32px',
            color: '#fff',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
              {isReady ? '✅' : '🏴󠁧󠁢󠁷󠁬󠁳󠁿'}
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              {order.formType}
            </h1>
            <p style={{ opacity: 0.85, marginTop: 4, fontSize: '0.9rem' }}>
              {isReady ? 'Your document is ready to download' : 'Request received — we\'ll be in touch soon'}
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '28px 32px' }}>

            {/* Status row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              background: isReady ? '#f0fdf4' : '#fefce8',
              border: `1.5px solid ${isReady ? '#bbf7d0' : '#fde68a'}`,
              borderRadius: 10, marginBottom: 24,
            }}>
              <span style={{ fontSize: '1.2rem' }}>{isReady ? '✅' : '⏳'}</span>
              <div>
                <div style={{ fontWeight: 700, color: isReady ? '#15803d' : '#92400e', fontSize: '0.9rem' }}>
                  {isReady ? 'Document ready' : 'Pending — awaiting admin review'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                  Order placed {order.date}
                </div>
              </div>
            </div>

            {/* Message */}
            {!isReady && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: '#334155', lineHeight: 1.7, margin: 0 }}>
                  Thank you for your request. Our team has received your order for{' '}
                  <strong>{order.formType}</strong> and will review the details.
                  An admin will contact you shortly — please check your email
                  <strong> {user?.email}</strong> for updates.
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 12 }}>
                  If you have any questions in the meantime, please contact us directly.
                </p>
              </div>
            )}

            {/* PDF ready — download */}
            {isReady && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: 12, marginBottom: 24,
              }}>
                <span style={{ fontSize: '2.5rem' }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#15803d' }}>
                    {order.formData?.pdfName || `${order.formType}.pdf`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                    Completed and uploaded by our team
                  </div>
                </div>
                <button
                  onClick={downloadPDF}
                  style={{
                    background: '#16a34a', color: '#fff', border: 'none',
                    borderRadius: 8, padding: '10px 20px',
                    fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📥 Download
                </button>
              </div>
            )}

            {/* Order details */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
              paddingTop: 20, borderTop: '1px solid #f1f5f9',
            }}>
              {[
                { label: 'Form Type',    value: order.formType },
                { label: 'Status',       value: order.status },
                { label: 'Your Name',    value: user?.name },
                { label: 'Your Email',   value: user?.email },
                { label: 'Order Date',   value: order.date },
                { label: 'Reference',    value: order.id },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </div>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 3, fontSize: '0.875rem', wordBreak: 'break-all' }}>
                    {value || '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 32px',
            background: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            display: 'flex', gap: 12,
          }}>
            <Link href="/dashboard" style={{
              padding: '10px 20px', borderRadius: 8, background: '#1e293b', color: '#fff',
              textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
            }}>
              ← Back to Dashboard
            </Link>
            <Link href="/services" style={{
              padding: '10px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0',
              color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
            }}>
              Browse Services
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
