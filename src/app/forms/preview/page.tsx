'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { FORM_SCHEMAS } from '@/data/form_schemas';
import SignaturePad from '@/components/SignaturePad';
import FormViewer from '@/components/wales/FormViewer';
import styles from './preview.module.css';

// Extend Window interface for scripts
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

function FormPreviewContent() {
  const params = useSearchParams();
  const router = useRouter();
  const formKey = params.get('form') || '';   // e.g. "Form RHW1"
  const price = params.get('price') || '£10.00';
  const orderId = params.get('orderId');

  const normalizedKey = formKey.toLowerCase().trim();
  let schema = FORM_SCHEMAS[formKey] || FORM_SCHEMAS['default'];
  
  // Handle alias for Tenancy Agreements and robust matching
  if (normalizedKey.includes('tenancy') || normalizedKey.includes('standard occupation contract')) {
    schema = FORM_SCHEMAS['Fixed Term Standard Occupation Contract'] || schema;
  }

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!formKey) router.push('/services');
    
    (async () => {
      // Initialize form data
      const initialData: Record<string, any> = {};
      schema.fields.forEach(f => {
        initialData[f.key] = f.type === 'checkboxes' ? [] : '';
      });

      if (orderId) {
        try {
          const res = await fetch(`/api/orders/${orderId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.form_data) {
              setFormData({ ...initialData, ...data.form_data });
            }
          }
        } catch (err) {
          console.error("Failed to load existing order", err);
        }
      } else {
        setFormData(initialData);
      }
    })();
  }, [formKey, orderId, schema, router]);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };



  const handleSaveAndPay = async () => {
    // Tenancy forms allow submission with any subset of fields filled.
    // Other forms still require all fields.
    const isTenancy = normalizedKey.includes('tenancy') || normalizedKey.includes('standard occupation contract');
    if (!isTenancy) {
      const missingFields = schema.fields.filter(f => {
        const val = formData[f.key];
        if (Array.isArray(val)) return val.length === 0;
        return !val?.trim();
      });

      if (missingFields.length > 0) {
        setError(`Please fill in all fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }
    }

    if (!window.html2canvas || !window.jspdf) {
      setError('PDF engine is still loading. Please wait a moment.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      // ── NEW: Generate High-Fidelity PDF from HTML ──
      const captureElement = document.getElementById('hf-pdf-capture');
      if (!captureElement) return;

      // Ensure capture element is still in the DOM and visible
      captureElement.style.display = 'block';
      captureElement.style.position = 'absolute';
      captureElement.style.left = '-9999px';
      captureElement.style.top = '0';

      if (!window.html2canvas) throw new Error('PDF Engine lost');

      const canvas = await window.html2canvas(captureElement, {
        scale: 2, // High quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Cleanup capture element visibility immediately
      if (document.getElementById('hf-pdf-capture')) {
        captureElement.style.display = 'none';
      }

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const base64 = pdf.output('datauristring');

      captureElement.style.display = 'none';

      // Store large PDF in memory (window object) to avoid QuotaExceededError in sessionStorage
      if (typeof window !== 'undefined') {
        (window as any).__rhw_pdf_draft = base64;
      }
      
      sessionStorage.setItem('rhw_form_data', JSON.stringify(formData));
      sessionStorage.setItem('rhw_form_type', formKey);
      
      if (orderId) {
        // Update existing order via a temporary approach or direct API
        // For now, we'll use a specific sync API we'll ensure exists or use create-payment with orderId
        const res = await fetch('/api/checkout/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId, // Signal update
            service: formKey,
            formData,
            pdfDraft: base64
          })
        });
        if (!res.ok) throw new Error('Update failed');
        router.push('/dashboard');
      } else {
        router.push(`/checkout?service=${encodeURIComponent(formKey)}&price=${encodeURIComponent(price)}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to prepare your high-fidelity document. Please try again.');
      setSaving(false);
    }
  };

  if (!formKey) return null;

  return (
    <div className={styles.page}>
      {/* CDN Scripts for High-Fidelity PDF Generation */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="afterInteractive" />

      {/* Hidden container for PDF capture */}
      <div id="hf-pdf-capture" suppressHydrationWarning style={{ display: 'none', width: '794px', background: '#fff', padding: '40px' }}>
        <FormViewer formType={formKey} data={formData} />
      </div>

      {/* Header */}
      <div className={styles.header}>
        <Link href="/services" className={styles.backLink}>← Back to Services</Link>
        <div className={styles.headerCenter}>
          <h1>{normalizedKey.includes('tenancy') || normalizedKey.includes('standard occupation contract') ? '📄' : '🏴󠁧󠁢󠁷󠁬󠁳󠁿'} {formKey}</h1>
          <p>{normalizedKey.includes('tenancy') || normalizedKey.includes('standard occupation contract') ? 'Fill in the details below to generate your professional tenancy agreement.' : `Fill in the blanks below to complete your ${schema.title}.`}</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.payBtn}
            onClick={handleSaveAndPay}
            disabled={saving}
          >
            {saving ? 'Processing...' : (orderId ? 'Update & Save Record' : `Save & Pay ${price} →`)}
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{normalizedKey.includes('tenancy') || normalizedKey.includes('standard occupation contract') ? 'Occupation contract wales' : 'Document Information'}</h2>
            <p>Please provide the details exactly as they should appear on the official document.</p>
          </div>

          <div className={styles.grid}>
            {schema.fields.map((field) => (
              <div key={field.key} className={styles.fieldGroup} style={{ 
                gridColumn: (field.type === 'textarea' || field.type === 'checkboxes' || field.type === 'signature') ? 'span 2' : 'span 1' 
              }}>
                <div className={styles.labelArea}>
                  <label htmlFor={field.key}>{field.label}</label>
                  {field.helpText && <span className={styles.helpText}>{field.helpText}</span>}
                </div>
                
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.key}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                    rows={3}
                  />
                ) : field.type === 'checkboxes' ? (
                  <div className={styles.checkboxGroup}>
                    {field.options?.map(opt => {
                      const currentValues = (formData[field.key] as string[]) || [];
                      const isChecked = currentValues.includes(opt);
                      
                      return (
                        <label key={opt} className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let nextValues;
                              if (e.target.checked) {
                                nextValues = [...currentValues, opt];
                              } else {
                                nextValues = currentValues.filter(v => v !== opt);
                              }
                              handleInputChange(field.key, nextValues);
                            }}
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    id={field.key}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                  >
                    <option value="">-- Select Option --</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'signature' ? (
                  <SignaturePad 
                    value={formData[field.key] || ''} 
                    onChange={val => handleInputChange(field.key, val)}
                  />
                ) : (
                  <input
                    id={field.key}
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}
        </div>

        <div className={styles.sideInfo}>
          <div className={styles.infoCard}>
            <h3>{formKey === 'Tenancy Agreements' ? 'Contract Builder' : 'How it works'}</h3>
            <ul>
              {formKey === 'Tenancy Agreements' ? (
                <>
                  <li>Enter landlord and tenant details accurately.</li>
                  <li>Specify rent, term dates, and utility responsibilities.</li>
                  <li>Ensure the security deposit information is correct.</li>
                  <li>Review the generated contract before finalizing.</li>
                </>
              ) : (
                <>
                  <li>Enter your details in the blanks provided.</li>
                  <li>Double-check all information is correct.</li>
                  <li>Once satisfied, click &quot;Save &amp; Pay&quot;.</li>
                  <li>Your official document will be available for download instantly after payment.</li>
                </>
              )}
            </ul>
          </div>
          
          <div className={styles.warningCard}>
            <p><strong>💡 Pro Tip:</strong> You can save your progress and come back to edit this form anytime from your dashboard until you are ready to download the final version.</p>
          </div>
          
          <div className={styles.noticeCard}>
            <p><strong>Note:</strong> {formKey === 'Tenancy Agreements' ? 'We use high-fidelity digital templates to ensure your tenancy agreement is legally robust and professional.' : 'We ensure perfect placement of your information onto the official Welsh Government RHW forms using high-fidelity digital templates.'}</p>
          </div>
        </div>
      </div>



      {/* Bottom action bar */}
      <div className={styles.bottomBar}>
        <Link href="/services" className={styles.cancelLink}>Cancel</Link>
        <button
          className={styles.payBtn}
          onClick={handleSaveAndPay}
          disabled={saving}
        >
          {saving ? 'Processing...' : (orderId ? 'Update & Save Record' : `Save & Pay ${price} →`)}
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
