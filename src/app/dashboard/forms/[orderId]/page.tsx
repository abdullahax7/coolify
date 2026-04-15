'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getOrders, updateOrder, getUser, type Order } from '@/lib/auth';
import { fillAndDownloadPDF } from '@/lib/pdf-service';
import { FORM_SCHEMAS } from '@/data/form_schemas';
import styles from './form-editor.module.css';

const PDFPreview = dynamic(() => import('./pdf-preview'), {
  ssr: false,
  loading: () => <div className={styles.pdfLoading}>Loading PDF preview…</div>,
});

export default function FormEditorPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const [order] = useState<Order | null>(() => {
    if (typeof window === 'undefined') return null;
    const orders = getOrders();
    return orders.find(ord => ord.id === orderId) || null;
  });
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    const orders = getOrders();
    const o = orders.find(ord => ord.id === orderId);
    return o?.formData || {};
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const schema =
    (order?.formType && FORM_SCHEMAS[order.formType]) || FORM_SCHEMAS['default'];

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push('/login'); return; }

    if (!order || !order.formType) { router.push('/dashboard'); }
  }, [order, router]);

  const handleChange = (key: string, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    if (saveMsg) setSaveMsg('');
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateOrder(orderId, { formData });
      setSaving(false);
      setSaveMsg('Changes saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    }, 500);
  };

  const handleDownload = async () => {
    if (!order) return;
    const formNum = order.formType?.match(/\d+/)?.[0] || '';
    const padNum = formNum.padStart(2, '0');
    const pdfUrl = `/forms/form-RHW${padNum}.pdf`;
    await fillAndDownloadPDF(pdfUrl, formData, `${order.formType}.pdf`);
  };

  if (!order) return <div className={styles.loading}>Loading form…</div>;

  const formNum = order.formType?.match(/\d+/)?.[0] || '';
  const padNum = formNum.padStart(2, '0');
  const pdfUrl = `/forms/form-RHW${padNum}.pdf`;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
          <div className={styles.titleArea}>
            <h1>Edit: <span>{order.formType}</span></h1>
            <p>{schema.title}</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : '💾 Save Draft'}
            </button>
            <button className={styles.downloadBtn} onClick={handleDownload}>
              📥 Download PDF
            </button>
          </div>
        </header>

        {saveMsg && <div className={styles.successMsg}>{saveMsg}</div>}

        <div className={styles.editorLayout}>
          {/* ── Left: form fields ── */}
          <div className={styles.formArea}>
            <div className={styles.formSection}>
              <h3>Form Details</h3>
              <div className={styles.grid}>
                {schema.fields.map(field => (
                  <div
                    key={field.key}
                    className={`${styles.field} ${field.type === 'textarea' ? styles.spanFull : ''}`}
                  >
                    <label>{field.label}</label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        className={styles.selectInput}
                        value={formData[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                      >
                        <option value="">Select…</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: PDF preview ── */}
          <div className={styles.previewSidebar}>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <span>Document Preview</span>
                <span className={styles.draftBadge}>Draft</span>
              </div>
              <PDFPreview pdfUrl={pdfUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
