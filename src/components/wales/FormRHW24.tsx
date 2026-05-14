"use client";

import React from 'react';

interface FormRHW24Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    expiryDate?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW24({ data }: FormRHW24Props) {
  return (
    <div className="wales-form-html" style={{ 
      background: '#fff', 
      fontFamily: '"Times New Roman", Times, serif', 
      fontSize: '11pt', 
      color: '#000',
      width: '210mm',
      margin: '0 auto',
      padding: '15mm 20mm',
      boxSizing: 'border-box'
    }}>
      <style jsx>{`
        .form-id { text-align: center; font-size: 11pt; margin-bottom: 12pt; }
        .form-title { text-align: center; font-size: 11pt; font-weight: bold; margin-bottom: 10pt; line-height: 1.4; }
        .form-subtitle { text-align: center; font-style: italic; font-size: 10pt; line-height: 1.4; margin-bottom: 12pt; }
        .parts-row { display: flex; width: 100%; border: 1px solid #000; }
        .parts-row .col { flex: 1; border-right: 1px solid #000; }
        .parts-row .col:last-child { border-right: none; }
        .part-header { font-weight: bold; font-size: 11pt; text-align: center; padding: 3pt 6pt; border-bottom: 1px solid #000; background: #f1f5f9; }
        .part-body { padding: 6pt 8pt 10pt; font-size: 10.5pt; line-height: 1.6; }
        .field-row { display: flex; align-items: baseline; margin-bottom: 4pt; gap: 4pt; }
        .field-input-val { border-bottom: 1px dotted #000; flex: 1; min-height: 1.2em; }
        .part-single { border: 1px solid #000; border-top: none; }
        .part-d-body { padding: 8pt; font-size: 10.5pt; line-height: 1.5; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; }
        .sig-col { flex: 0 0 60%; }
        .date-col { flex: 0 0 35%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 25pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
        .guidance-section { margin-top: 20pt; font-size: 10pt; line-height: 1.4; border-top: 1px solid #ccc; padding-top: 10pt; }
      `}</style>

      <div className="form-id">FORM RHW24</div>
      <div className="form-title">
        NOTICE OF TERMINATION UNDER LANDLORD'S BREAK CLAUSE: FIXED<br/>
        TERM STANDARD CONTRACT WITH SIX-MONTH MINIMUM NOTICE<br/>
        PERIOD
      </div>
      <div className="form-subtitle">
        This form is for use by a landlord to give notice to a contract-holder of a fixed term standard contract<br/>
        entitled to a six-month minimum notice period, in accordance with the landlord's break clause and<br/>
        section 194(1) of the Renting Homes (Wales) Act 2016, that he or she must give up possession of the<br/>
        dwelling on a specified date.
      </div>

      <div className="parts-row">
        <div className="col">
          <div className="part-header">Part A: Landlord</div>
          <div className="part-body">
            <div className="field-row"><strong>Name:</strong> <span className="field-input-val">{data.landlordName}</span></div>
            <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.landlordAddress}</span></div>
          </div>
        </div>
        <div className="col">
          <div className="part-header">Part B: Contract-Holder(s)</div>
          <div className="part-body">
            <div className="field-row"><strong>Name(s):</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.tenantName}</span></div>
          </div>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part C: Dwelling</div>
        <div className="part-body">
          <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.dwellingAddress}</span></div>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part D: Notice to Give Up Possession</div>
        <div className="part-d-body">
          <p>The landlord gives notice of the exercise of the landlord's break clause in the occupation contract of the above dwelling. The landlord requires you, the contract-holder(s), to give up possession of the dwelling on [<em>date</em>] <span className="field-input-val" style={{ display: 'inline-block', width: '150pt', textAlign: 'center' }}>{data.expiryDate}</span></p>
          <p style={{ fontStyle: 'italic', marginTop: '8pt', fontSize: '10pt' }}>Note: The specified date must not be less than six months after the day on which notice is given to the contract-holder(s) in accordance with the landlord's break clause.</p>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part E: Signature</div>
        <div className="part-body" style={{ padding: '8pt' }}>
          <div className="sig-row">
            <div className="sig-col">
              <strong>Signed by, or on behalf of, the landlord:</strong>
              <div className="sig-line">
                {data.signedBy?.startsWith('data:image') ? (
                  <img src={data.signedBy} alt="Signature" style={{ maxHeight: '35pt', maxWidth: '100%' }} />
                ) : (
                  <span style={{ fontSize: '11pt' }}>{data.signedBy}</span>
                )}
              </div>
            </div>
            <div className="date-col">
              <strong>Date:</strong>
              <div style={{ borderBottom: '1px solid #000', width: '100%', marginTop: '12pt', minHeight: '20pt' }}>
                {data.signatureDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="guidance-section">
        <strong>Guidance notes for contract-holders</strong>
        <p style={{ marginTop: '5pt' }}>This notice is the first step requiring you to give up possession of the dwelling identified at Part C. You should read it very carefully. If you do not give up possession by the date given in Part D, your landlord may apply to the court for an order requiring you to give up possession.</p>
      </div>
    </div>
  );
}
