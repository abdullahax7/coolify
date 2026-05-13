'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrders, getUser, type Order, type User } from '@/lib/auth';
import FormViewer from '@/components/wales/FormViewer';
import styles from './form-editor.module.css';

export default function FormStatusPage() {
  const params  = useParams();
  const orderId = params.orderId as string;
  const router  = useRouter();

  const [user, setUser]           = useState<User  | null>(null);
  const [order, setOrder]         = useState<Order | null>(null);

  // Share modal
  const [showShare, setShowShare]   = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareNote,  setShareNote]  = useState('');
  const [sharing,    setSharing]    = useState(false);
  const [shareOk,    setShareOk]    = useState(false);
  const [shareErr,   setShareErr]   = useState('');

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);
      const orders = await getOrders();
      const found = orders.find(ord => ord.id === orderId) || null;
      if (!found) { router.push('/dashboard'); return; }
      setOrder(found);
    })();
  }, [router, orderId]);

  const documentUrl = order?.pdfUrl ?? null;

  const downloadSaved = () => {
    if (documentUrl) window.open(documentUrl, '_blank');
  };

  const handleShare = async () => {
    if (!order || !shareEmail.trim()) { setShareErr('Email is required'); return; }
    setSharing(true); setShareErr('');
    try {
      if (!documentUrl) throw new Error('PDF not available');
      const res = await fetch(documentUrl);
      const bytes = new Uint8Array(await res.arrayBuffer());
      
      // We need a helper to convert uint8 to base64 since we removed PdfEditor's export
      const base64 = btoa(
        new Uint8Array(bytes)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const send = await fetch('/api/share-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: shareEmail.trim(),
          recipientName:  user?.name ?? '',
          formType:       order.formType,
          pdfBase64:      base64,
          pdfName:        `${order.formType}.pdf`,
          senderNote:     shareNote.trim() || undefined,
        }),
      });
      if (!send.ok) throw new Error((await send.json()).error || 'Failed to send');
      setShareOk(true);
      setShareEmail(''); setShareNote('');
      setTimeout(() => { setShareOk(false); setShowShare(false); }, 1800);
    } catch (err) {
      setShareErr(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSharing(false);
    }
  };

  if (!order) return null;

  const isReady = !!order.pdfUrl;

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
              {order.formType || order.name}
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
                  <strong>{order.formType || order.name}</strong> and will review the details.
                </p>
                
                {(Object.keys(order.formData || {}).length === 0 || !order.formData) && /Form RHW|Tenancy Agreement/i.test(order.formType || order.name) && (
                  <div style={{
                    marginTop: 20,
                    padding: 20,
                    background: '#fffbeb',
                    border: '1.5px solid #fef3c7',
                    borderRadius: 12,
                  }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#92400e', fontWeight: 600 }}>
                      Action Required: You haven&apos;t filled out the details for this document yet.
                    </p>
                    <Link 
                      href={`/forms/preview?form=${encodeURIComponent(order.formType || order.name)}&price=${encodeURIComponent(order.price || '£40.00')}&orderId=${order.id}`}
                      style={{
                        display: 'inline-block',
                        background: '#d97706',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      ✍️ Fill Out Details Now
                    </Link>
                  </div>
                )}

                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 12 }}>
                  An admin will contact you shortly — please check your email{' '}
                  <strong>{user?.email}</strong> for updates.
                </p>
              </div>
            )}

            {/* PDF ready — action buttons */}
            {isReady && (
              <div style={{
                padding: '16px 20px',
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: 12, marginBottom: 24,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                  <span style={{ fontSize: '2.5rem' }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#15803d' }}>
                      {order.formData?.pdfName || `${order.formType || order.name}.pdf`}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                      Your completed Wales form
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={downloadSaved}
                    style={{
                      background: '#16a34a', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '10px 18px',
                      fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                    }}
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => { setShowShare(true); setShareErr(''); }}
                    style={{
                      background: '#0ea5e9', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '10px 18px',
                      fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                    }}
                  >
                    ✉️ Share
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
                { label: 'Service',    value: order.formType || order.name },
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

            {/* Live Preview of the Document Data */}
            {order.formData && Object.keys(order.formData).length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: 16, borderBottom: '2px solid #f1f5f9', paddingBottom: 8 }}>
                  📝 Document Preview
                </h3>
                <div style={{ 
                  background: '#f8fafc', 
                  borderRadius: 12, 
                  border: '1.5px solid #e2e8f0',
                  padding: '24px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  transform: 'scale(0.95)',
                  transformOrigin: 'top center'
                }}>
                  <FormViewer formType={order.formType || order.name} data={order.formData} />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 12, textAlign: 'center' }}>
                  This is a preview of the information you provided. The official PDF will be formatted for printing.
                </p>
              </div>
            )}
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

      {/* Share modal */}
      {showShare && (
        <div
          onClick={() => !sharing && setShowShare(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 14, width: '100%', maxWidth: 480,
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 22px', background: '#0ea5e9', color: '#fff' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>✉️ Share via email</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: 2 }}>
                The recipient will get an email with the PDF attached.
              </div>
            </div>
            <div style={{ padding: 22 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Recipient email
              </label>
              <input
                type="email"
                value={shareEmail}
                onChange={e => setShareEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
                  borderRadius: 8, fontSize: '0.9rem', outline: 'none',
                }}
              />
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginTop: 14, marginBottom: 6 }}>
                Message <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={shareNote}
                onChange={e => setShareNote(e.target.value)}
                rows={3}
                placeholder="Add a short note…"
                style={{
                  width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
                  borderRadius: 8, fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                }}
              />
              {shareErr && (
                <div style={{ marginTop: 10, color: '#b91c1c', fontSize: '0.82rem', fontWeight: 600 }}>
                  {shareErr}
                </div>
              )}
              {shareOk && (
                <div style={{ marginTop: 10, color: '#15803d', fontSize: '0.82rem', fontWeight: 700 }}>
                  ✅ Email sent!
                </div>
              )}
            </div>
            <div style={{ padding: '14px 22px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowShare(false)}
                disabled={sharing}
                style={{
                  padding: '9px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0',
                  background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={sharing || !shareEmail.trim()}
                style={{
                  padding: '9px 20px', borderRadius: 8, border: 'none',
                  background: '#0ea5e9', color: '#fff', fontWeight: 700,
                  cursor: sharing || !shareEmail.trim() ? 'not-allowed' : 'pointer', fontSize: '0.85rem',
                  opacity: sharing || !shareEmail.trim() ? 0.6 : 1,
                }}
              >
                {sharing ? 'Sending…' : 'Send email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
