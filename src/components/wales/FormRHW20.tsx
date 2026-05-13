"use client";

import React from 'react';

interface FormRHW20Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    arrearsType?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW20({ data }: FormRHW20Props) {
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
        .chk-row { display: flex; align-items: flex-start; gap: 10pt; padding: 6pt 8pt; border-top: 1px solid #000; }
        .chkbox { display: inline-block; width: 12pt; height: 12pt; border: 1px solid #000; text-align: center; line-height: 12pt; font-weight: bold; margin-top: 2pt; flex-shrink: 0; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; }
        .sig-col { flex: 0 0 60%; }
        .date-col { flex: 0 0 35%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 25pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
      `}</style>

      <div className="form-id">FORM RHW20</div>
      <div className="form-title">
        NOTICE OF POSSESSION CLAIM ON THE GROUND OF SERIOUS RENT<br/>
        ARREARS: STANDARD CONTRACT (OTHER THAN INTRODUCTORY<br/>
        STANDARD CONTRACT OR PROHIBITED CONDUCT STANDARD<br/>
        CONTRACT)
      </div>
      <div className="form-subtitle">
        This form is for use by a landlord to give notice to a contract-holder of a standard contract (except those<br/>
        holding an introductory standard contract or prohibited conduct standard contract) under section<br/>
        182(1) or 188(1) of the Renting Homes (Wales) Act 2016 that the landlord intends to make a possession<br/>
        claim to the court.
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
        <div className="part-header">Part D: Notice of Possession Claim</div>
        <div className="part-d-body">
          <p>The landlord gives notice to you, the contract-holder(s), that the landlord intends to apply to the court for an order requiring you to give up possession of the above dwelling on the ground of serious rent arrears. The details of your serious rent arrears are as follows:</p>
          <p style={{ fontStyle: 'italic', marginTop: '6pt', fontSize: '10pt' }}>Tick as applicable.</p>
        </div>
        <div className="chk-row">
          <span className="chkbox">{data.arrearsType === "At least eight weeks' rent is unpaid (Weekly/Fortnightly)" ? '✓' : ''}</span>
          <span>At least eight weeks' rent is unpaid (where rent is paid weekly/fortnightly/four-weekly)</span>
        </div>
        <div className="chk-row">
          <span className="chkbox">{data.arrearsType === "At least two months' rent is unpaid (Monthly)" ? '✓' : ''}</span>
          <span>At least two months' rent is unpaid (where rent is paid monthly)</span>
        </div>
        <div className="chk-row">
          <span className="chkbox">{data.arrearsType === "At least one quarter's rent is more than three months in arrears (Quarterly)" ? '✓' : ''}</span>
          <span>At least one quarter's rent is more than three months in arrears (where rent is paid quarterly)</span>
        </div>
        <div className="chk-row">
          <span className="chkbox">{data.arrearsType === "At least 25% of the rent is more than three months in arrears (Annually)" ? '✓' : ''}</span>
          <span>At least 25% of the rent is more than three months in arrears (where rent is paid annually)</span>
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
    </div>
  );
}
