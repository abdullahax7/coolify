'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getOrders, getUser, type Order, type User } from '@/lib/auth';
import { exportPDF } from '@/components/PSPDFKitViewer';
import styles from './form-editor.module.css';

const PSPDFKitViewer = dynamic(() => import('@/components/PSPDFKitViewer'), {
  ssr: false,
  loading: () => <div className={styles.pdfLoading}>Loading PDF editor…</div>,
});

export default function FormStatusPage() {
  const params  = useParams();
  const orderId = params.orderId as string;
  const router  = useRouter();

  const [user, setUser]           = useState<User  | null>(null);
  const [order, setOrder]         = useState<Order | null>(null);
  const [viewMode, setViewMode]   = useState<'status' | 'editor'>('status');
  const [saving,   setSaving]     = useState(false);
  const [saveOk,   setSaveOk]     = useState(false);
  const instanceRef = useRef<unknown>(null);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);
      const orders = await getOrders();
      const found = orders.find(ord => ord.id === orderId) || null;
      if (!found || !found.formType) { router.push('/dashboard'); return; }
      setOrder(found);
    })();
  }, [router, orderId]);

  const documentUrl = order?.pdfUrl ?? null;

  const downloadPDF = async () => {
    if (!instanceRef.current) { if (documentUrl) window.open(documentUrl); return; }
    const bytes = await exportPDF(instanceRef.current);
    const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url   = URL.createObjectURL(blob);
    const a     = Object.assign(document.createElement('a'), { href: url, download: `${order?.formType ?? 'form'}.pdf` });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!instanceRef.current || !order) return;
    setSaving(true);
    try {
      const bytes = await exportPDF(instanceRef.current);
      const fd = new FormData();
      fd.append('file', new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }), `${order.formType}.pdf`);
      const res = await fetch(`/api/orders/${order.id}/pdf`, { method: 'PUT', body: fd });
      if (res.ok) {
        const { pdfUrl } = await res.json();
        setOrder({ ...order, pdfUrl });
        setSaveOk(true);
        setTimeout(() => setSaveOk(false), 3000);
        setViewMode('status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!order) return null;

  const isReady = !!order.pdfUrl;

  /* ── PDF Editor view ── */
  if (viewMode === 'editor' && documentUrl) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Sticky editor header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '0.875rem 1.5rem', background: '#fff',
          borderBottom: '1.5px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50,
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setViewMode('status')}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            ← Back
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>🏴󠁧󠁢󠁷󠁬󠁳󠁿 {order.formType}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Edit your form, then save to update your copy.</div>
          </div>
          {saveOk && (
            <span style={{ background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
              ✅ Saved
            </span>
          )}
          <button
            onClick={downloadPDF}
            style={{
              background: '#fff', color: '#1e293b', border: '1.5px solid #e2e8f0',
              borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            📥 Download
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '9px 20px', fontWeight: 700, fontSize: '0.875rem',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <PSPDFKitViewer
            document={documentUrl!}
            onLoad={(inst) => { instanceRef.current = inst; }}
            style={{ height: 800 }}
          />
        </div>
      </div>
    );
  }

  /* ── Status / overview view ── */
  return (
    <div className={styles.page}>
      <div className={styles.container} style={{ maxWidth: 680 }}>

        <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>

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

            {!isReady && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: '#334155', lineHeight: 1.7, margin: 0 }}>
                  Thank you for your request. Our team has received your order for{' '}
                  <strong>{order.formType}</strong> and will review the details.
                  An admin will contact you shortly — please check your email{' '}
                  <strong>{user?.email}</strong> for updates.
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 12 }}>
                  If you have any questions in the meantime, please contact us directly.
                </p>
              </div>
            )}

            {/* PDF ready — download + re-edit */}
            {isReady && (
              <div style={{
                padding: '16px 20px',
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: 12, marginBottom: 24,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <span style={{ fontSize: '2.5rem' }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#15803d' }}>
                      {order.formData?.pdfName || `${order.formType}.pdf`}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                      Your completed Wales form
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setViewMode('editor')}
                    style={{
                      background: '#6366f1', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '10px 20px',
                      fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
                    }}
                  >
                    ✏️ Edit in PSPDFKit
                  </button>
                  <button
                    onClick={downloadPDF}
                    style={{
                      background: '#16a34a', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '10px 20px',
                      fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
                    }}
                  >
                    📥 Download PDF
                  </button>
                </div>
              </div>
            )}

            {/* Order details */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
              paddingTop: 20, borderTop: '1px solid #f1f5f9',
            }}>
              {[
                { label: 'Form Type',  value: order.formType },
                { label: 'Status',     value: order.status },
                { label: 'Your Name',  value: user?.name },
                { label: 'Your Email', value: user?.email },
                { label: 'Order Date', value: order.date },
                { label: 'Reference',  value: order.id },
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
