'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { exportPDF, uint8ToBase64 } from '@/components/PSPDFKitViewer';
import styles from './preview.module.css';

// Dynamic import – PSPDFKit is browser-only
const PSPDFKitViewer = dynamic(() => import('@/components/PSPDFKitViewer'), {
  ssr: false,
  loading: () => <div className={styles.pdfLoading}>Loading PDF editor…</div>,
});

/** Map "Form RHW1" → "/forms/form-RHW01.pdf" */
function formPdfUrl(formName: string): string {
  const match = formName.match(/RHW(\d+)/i);
  if (!match) return '';
  const num = parseInt(match[1], 10);
  const padded = String(num).padStart(2, '0');
  return `/forms/form-RHW${padded}.pdf`;
}

function FormPreviewContent() {
  const params  = useSearchParams();
  const router  = useRouter();
  const form    = params.get('form') || '';   // e.g. "Form RHW1"
  const price   = params.get('price') || '£10.00';

  const pdfUrl  = formPdfUrl(form);
  const instanceRef = useRef<unknown>(null);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => {
    if (!form || !pdfUrl) router.push('/services');
  }, [form, pdfUrl, router]);

  const handleSaveAndPay = async () => {
    if (!instanceRef.current) {
      setError('PDF editor not ready — please wait a moment.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const bytes  = await exportPDF(instanceRef.current);
      const base64 = uint8ToBase64(bytes);
      // Store in sessionStorage so checkout can pick it up
      sessionStorage.setItem('rhw_draft_pdf',      base64);
      sessionStorage.setItem('rhw_draft_pdf_name', `${form}.pdf`);
      sessionStorage.setItem('rhw_draft_form_name', form);
      // Redirect to checkout
      router.push(`/checkout?service=${encodeURIComponent(form)}&price=${encodeURIComponent(price)}`);
    } catch (err) {
      console.error(err);
      setError('Failed to save PDF. Please try again.');
      setSaving(false);
    }
  };

  if (!pdfUrl) return null;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/services" className={styles.backLink}>← Back to Services</Link>
        <div className={styles.headerCenter}>
          <h1>🏴󠁧󠁢󠁷󠁬󠁳󠁿 {form}</h1>
          <p>Fill in the form below, then proceed to payment to get your completed document.</p>
        </div>
        <div className={styles.headerActions}>
          {error && <span className={styles.errorBadge}>{error}</span>}
          <button
            className={styles.payBtn}
            onClick={handleSaveAndPay}
            disabled={saving}
          >
            {saving ? 'Saving…' : `Save & Pay ${price} →`}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className={styles.infoBanner}>
        <span>ℹ️</span>
        <span>
          Complete the form using the editor below. Use the toolbar to type, annotate or
          digitally sign. When done, click <strong>Save &amp; Pay</strong> — your filled
          PDF will be saved after payment and available to download from your dashboard.
        </span>
      </div>

      {/* PSPDFKit editor */}
      <div className={styles.editorWrap}>
        <PSPDFKitViewer
          document={pdfUrl}
          onLoad={(inst) => { instanceRef.current = inst; }}
          style={{ height: 800 }}
        />
        
        {/* Anti-screenshot Watermark */}
        <div className={styles.watermarkOverlay}>
          <div className={styles.watermarkText}>PREVIEW - PAY TO DOWNLOAD</div>
          <div className={styles.watermarkText}>PREVIEW - PAY TO DOWNLOAD</div>
          <div className={styles.watermarkText}>PREVIEW - PAY TO DOWNLOAD</div>
          <div className={styles.watermarkText}>PREVIEW - PAY TO DOWNLOAD</div>
          <div className={styles.watermarkText}>PREVIEW - PAY TO DOWNLOAD</div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className={styles.bottomBar}>
        {error && <span className={styles.errorBadge}>{error}</span>}
        <Link href="/services" className={styles.cancelLink}>Cancel</Link>
        <button
          className={styles.payBtn}
          onClick={handleSaveAndPay}
          disabled={saving}
        >
          {saving ? 'Saving…' : `Save & Pay ${price} →`}
        </button>
      </div>
    </div>
  );
}

export default function FormPreviewPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading…</div>}>
      <FormPreviewContent />
    </Suspense>
  );
}
