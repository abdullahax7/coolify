"use client";

import React from 'react';

interface GenericWalesFormProps {
  formType: string;
  data: any;
}

export default function GenericWalesForm({ formType, data }: GenericWalesFormProps) {
  // Extract common fields
  const { 
    landlordName, landlordAddress, 
    tenantName, dwellingAddress, 
    signedBy, signatureDate,
    ...rest 
  } = data;

  return (
    <div className="wales-form-html" style={{ 
      background: '#fff', 
      fontFamily: '"Times New Roman", Times, serif', 
      fontSize: '12pt', 
      color: '#000',
      width: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      padding: '20mm',
      boxSizing: 'border-box',
      border: '1px solid #eee'
    }}>
      <style jsx>{`
        .form-id { text-align: center; font-size: 12pt; margin-bottom: 18pt; text-transform: uppercase; }
        .form-title { text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 24pt; border-bottom: 2px solid #000; padding-bottom: 10pt; }
        
        .box-section { border: 1px solid #000; margin-bottom: -1px; }
        .box-header { background: #f0f0f0; font-weight: bold; padding: 5pt 10pt; border-bottom: 1px solid #000; font-size: 11pt; text-transform: uppercase; }
        .box-body { padding: 10pt 15pt; line-height: 1.6; font-size: 11pt; }
        
        .field-row { margin-bottom: 8pt; display: flex; gap: 10pt; }
        .field-label { font-weight: bold; min-width: 120px; }
        .field-value { flex: 1; border-bottom: 1px dotted #999; min-height: 1.2em; }
        
        .signature-section { margin-top: 30pt; display: flex; justify-content: space-between; gap: 40pt; }
        .sig-box { flex: 1; }
        .sig-line { border-bottom: 1px solid #000; margin-top: 20pt; min-height: 40pt; display: flex; alignItems: flex-end; }
        .sig-label { font-size: 10pt; font-weight: bold; margin-top: 5pt; }
      `}</style>

      <div className="form-id">{formType}</div>
      <div className="form-title">RENTING HOMES (WALES) ACT 2016 NOTICE</div>

      <div className="box-section">
        <div className="box-header">Part A: Landlord Details</div>
        <div className="box-body">
          <div className="field-row">
            <span className="field-label">Name:</span>
            <span className="field-value">{landlordName || '—'}</span>
          </div>
          <div className="field-row">
            <span className="field-label">Address:</span>
            <span className="field-value" style={{ whiteSpace: 'pre-wrap' }}>{landlordAddress || '—'}</span>
          </div>
        </div>
      </div>

      <div className="box-section">
        <div className="box-header">Part B: Contract-Holder Details</div>
        <div className="box-body">
          <div className="field-row">
            <span className="field-label">Name(s):</span>
            <span className="field-value">{tenantName || '—'}</span>
          </div>
        </div>
      </div>

      <div className="box-section">
        <div className="box-header">Part C: Dwelling Details</div>
        <div className="box-body">
          <div className="field-row">
            <span className="field-label">Address:</span>
            <span className="field-value" style={{ whiteSpace: 'pre-wrap' }}>{dwellingAddress || '—'}</span>
          </div>
        </div>
      </div>

      <div className="box-section">
        <div className="box-header">Part D: Notice Information</div>
        <div className="box-body">
          <p style={{ marginBottom: '10pt' }}>This notice is given in accordance with the Renting Homes (Wales) Act 2016.</p>
          {Object.entries(rest).map(([key, val]) => {
            if (key === 'id') return null;
            // Format key from camelCase to Title Case
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            return (
              <div key={key} className="field-row">
                <span className="field-label">{label}:</span>
                <span className="field-value">
                  {Array.isArray(val) ? val.join(', ') : String(val || '—')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="signature-section">
        <div className="sig-box">
          <div className="sig-line">
            {signedBy?.startsWith('data:image') ? (
              <img src={signedBy} alt="Signature" style={{ maxHeight: '50pt' }} />
            ) : (
              <span>{signedBy}</span>
            )}
          </div>
          <div className="sig-label">Signed by / on behalf of Landlord</div>
        </div>
        <div className="sig-box" style={{ maxWidth: '150px' }}>
          <div className="sig-line">
            {signatureDate}
          </div>
          <div className="sig-label">Date</div>
        </div>
      </div>

      <div style={{ marginTop: '40pt', fontSize: '9pt', color: '#666', borderTop: '1px solid #eee', paddingTop: '10pt' }}>
        This is a legally binding notice under the Renting Homes (Wales) Act 2016. Please keep this document for your records.
      </div>
    </div>
  );
}
