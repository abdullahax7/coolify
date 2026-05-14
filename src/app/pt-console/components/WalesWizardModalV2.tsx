"use client";

import React, { useState, useEffect, useMemo } from 'react';
import styles from '../admin.module.css';
import { FORM_SCHEMAS } from '@/data/form_schemas';
import SignaturePad from '@/components/SignaturePad';

const WALES_FORMS = [
  "Form RHW1", "Form RHW2", "Form RHW3", "Form RHW4", "Form RHW6", "Form RHW7", 
  "Form RHW8", "Form RHW12", "Form RHW15", "Form RHW16", "Form RHW17", "Form RHW18", 
  "Form RHW19", "Form RHW20", "Form RHW21", "Form RHW22", "Form RHW23", "Form RHW24", 
  "Form RHW25", "Form RHW26", "Form RHW27", "Form RHW28", "Form RHW29", "Form RHW30", 
  "Form RHW32", "Form RHW33", "Form RHW34", "Form RHW35", "Form RHW36", "Form RHW37", "Form RHW38",
  "Fixed Term Standard Occupation Contract"
];

interface WalesFormRecordV2 {
  id: string;
  form_type: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  notes: string;
  form_data: Record<string, any>;
  created_at: string;
  is_user_purchased?: boolean;
  status?: string;
}

interface WalesWizardModalV2Props {
  title: string;
  existing: WalesFormRecordV2 | null;
  onClose: () => void;
  onSave: (data: any) => void;
  fixedType?: string;
}

export default function WalesWizardModalV2({ title, existing, onClose, onSave, fixedType }: WalesWizardModalV2Props) {
  const [formType, setFormType] = useState(existing?.form_type || fixedType || WALES_FORMS[0]);
  const [clientName, setClientName] = useState(existing?.client_name || '');
  const [clientEmail, setClientEmail] = useState(existing?.client_email || '');
  const [clientPhone, setClientPhone] = useState(existing?.client_phone || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [status, setStatus] = useState(existing?.status || 'pending');
  const [walesData, setWalesData] = useState<Record<string, any>>(existing?.form_data || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Robust schema lookup
  const schema = useMemo(() => {
    // 1. Direct match
    if (FORM_SCHEMAS[formType]) return FORM_SCHEMAS[formType];

    // 2. Tenancy Alias Check (Case-insensitive)
    const normalizedType = formType.toLowerCase();
    if (normalizedType.includes('tenancy') || normalizedType.includes('standard occupation contract')) {
      return FORM_SCHEMAS['Fixed Term Standard Occupation Contract'];
    }

    // 3. Fallback
    return FORM_SCHEMAS['default'];
  }, [formType]);

  useEffect(() => {
    if (!schema) return;
    // Sync schema fields without overwriting existing data
    setWalesData(prev => {
      const newData = { ...prev };
      schema.fields.forEach(f => {
        if (newData[f.key] === undefined) {
          if (f.type === 'checkboxes') newData[f.key] = [];
          else newData[f.key] = '';
        }
      });
      return newData;
    });
  }, [schema]);

  const handleInputChange = (key: string, value: any) => {
    setWalesData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxToggle = (key: string, option: string) => {
    const current = (walesData[key] as string[]) || [];
    const next = current.includes(option) 
      ? current.filter(o => o !== option)
      : [...current, option];
    handleInputChange(key, next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) { setError('Client name is required.'); return; }

    setSaving(true);
    try {
      const isPurchased = existing?.is_user_purchased;
      
      // Map payload based on target table
      const payload = isPurchased ? {
        customerName: clientName,
        customerEmail: clientEmail,
        customerPhone: clientPhone,
        formType,
        formData: walesData,
        status: 'completed'
      } : {
        formType,
        clientName,
        clientEmail,
        clientPhone,
        notes,
        formData: walesData,
        status: 'completed'
      };
      
      const method = existing ? 'PUT' : 'POST';
      const idToUse = existing?.id;
      
      const url = isPurchased 
        ? `/api/orders/${idToUse}` 
        : (existing ? `/api/wales-forms/${idToUse}` : '/api/wales-forms');
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        // If it was a purchased form, we need to transform the response back to our record format
        const savedData = isPurchased ? {
          ...existing,
          client_name: data.customer_name,
          client_email: data.customer_email,
          client_phone: data.customer_phone,
          form_data: data.form_data,
          form_type: data.form_type,
          status: data.status
        } : data;

        onSave(savedData);
        onClose();
      } else {
        setError(data.error || 'Failed to save record.');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('A network error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 900 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {error && <div className={styles.loginErr} style={{ marginBottom: 16 }}>{error}</div>}
            
            <div className={styles.wizardGrid}>
              <div className={styles.wizardSection}>
                <h3>RECORD DETAILS</h3>
                <div className={styles.editField}>
                  <label>Form Type</label>
                  <select value={formType} onChange={e => setFormType(e.target.value)} disabled={!!fixedType}>
                    {WALES_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                    {!WALES_FORMS.includes(formType) && <option value={formType}>{formType}</option>}
                  </select>
                </div>
                <div className={styles.editField}>
                  <label>Client Name</label>
                  <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. John Doe" />
                </div>
                <div className={styles.editField}>
                  <label>Client Email</label>
                  <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="e.g. john@example.com" />
                </div>
                <div className={styles.editField}>
                  <label>Client Phone</label>
                  <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="e.g. 07700 900000" />
                </div>
                <div className={styles.editField}>
                  <label>Internal Notes</label>
                  <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>

              <div className={styles.wizardSection}>
                <h3>FORM CONTENT</h3>
                <div className={styles.schemaFields}>
                  {schema.fields.map(field => (
                    <div key={field.key} className={styles.editField}>
                      <label>{field.label}</label>
                      {field.type === 'text' && (
                        <input value={walesData[field.key] || ''} onChange={e => handleInputChange(field.key, e.target.value)} placeholder={field.placeholder} />
                      )}
                      {field.type === 'date' && (
                        <input type="date" value={walesData[field.key] || ''} onChange={e => handleInputChange(field.key, e.target.value)} />
                      )}
                      {field.type === 'textarea' && (
                        <textarea rows={3} value={walesData[field.key] || ''} onChange={e => handleInputChange(field.key, e.target.value)} placeholder={field.placeholder} />
                      )}
                      {field.type === 'select' && (
                        <select value={walesData[field.key] || ''} onChange={e => handleInputChange(field.key, e.target.value)}>
                          <option value="">Select option...</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      )}
                      {field.type === 'checkboxes' && (
                        <div className={styles.checkboxGroup}>
                          {field.options?.map(opt => (
                            <label key={opt} className={styles.checkLabel}>
                              <input type="checkbox" checked={(walesData[field.key] as string[])?.includes(opt)} onChange={() => handleCheckboxToggle(field.key, opt)} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                      {field.type === 'signature' && (
                        <SignaturePad 
                          value={walesData[field.key] || ''} 
                          onChange={(val) => handleInputChange(field.key, val)} 
                        />
                      )}
                      {field.helpText && <p className={styles.helpText}>{field.helpText}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.modalCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.modalSave} disabled={saving}>
              {saving ? 'Saving...' : existing ? 'Update Record' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
