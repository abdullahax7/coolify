"use client";

import React from 'react';

interface FormRHW16Props {
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

export default function FormRHW16({ data }: FormRHW16Props) {
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
        .part-e-body { padding: 8pt; font-size: 10.5pt; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; }
        .sig-col { flex: 0 0 60%; }
        .date-col { flex: 0 0 35%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 25pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
        .guidance-section { margin-top: 20pt; font-size: 10pt; line-height: 1.4; page-break-before: always; }
        .section-title { font-weight: bold; margin-bottom: 6pt; text-decoration: underline; }
        .schedule-list { display: flex; gap: 20pt; margin: 10pt 0; font-style: italic; }
      `}</style>

      <div className="form-id">FORM RHW16</div>
      <div className="form-title">
        LANDLORD'S NOTICE OF TERMINATION: PERIODIC STANDARD<br/>
        CONTRACT WITH SIX-MONTH MINIMUM NOTICE PERIOD (OTHER THAN<br/>
        INTRODUCTORY STANDARD CONTRACT OR PROHIBITED CONDUCT<br/>
        STANDARD CONTRACT)
      </div>
      <div className="form-subtitle">
        This form is for use by a landlord to give notice to a periodic standard contract-holder entitled to a six-month<br/>
        minimum notice period (except those holding an introductory standard contract or prohibited conduct standard<br/>
        contract) under section 173(1) of the Renting Homes (Wales) Act 2016 that he or she must give up possession<br/>
        of the dwelling on a specified date.
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
          <p>In accordance with section 173 of the Renting Homes (Wales) Act 2016, the landlord gives notice to you, the contract-holder(s), that you must give up possession of the dwelling above on [<em>date</em>] <span className="field-input-val" style={{ display: 'inline-block', width: '150pt', textAlign: 'center' }}>{data.expiryDate}</span></p>
          <p style={{ marginTop: '8pt' }}>If you, the contract-holder(s), do not give up possession of the dwelling on the date specified above, the landlord may make a possession claim to the court.</p>
          <p style={{ fontStyle: 'italic', marginTop: '8pt', fontSize: '10pt' }}>Note: The specified date must not be less than six months after the day on which this notice is given to the contract-holder(s).</p>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part E: Signature</div>
        <div className="part-e-body">
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
        <div className="section-title">Guidance notes for contract-holders</div>
        <p>This notice is the first step requiring you to give up possession of the dwelling identified at Part C. You should read it very carefully. If you do not give up possession by the date given in Part D, your landlord may apply to the court for an order requiring you to give up possession.</p>
        
        <div className="section-title" style={{ marginTop: '15pt' }}>Restrictions on giving this notice</div>
        <p>In accordance with section 175 of the Renting Homes (Wales) Act 2016, this notice may not be given within the first six months of the occupation date of the contract. This notice may also not be given if the landlord has failed to provide a written statement of the contract, a valid EPC, or has failed to comply with security and deposit requirements.</p>
        
        <div className="section-title" style={{ marginTop: '15pt' }}>Retaliatory possession claim</div>
        <p>If the landlord issues this notice in response to a request for repairs or fitness for human habitation, a court may refuse to make an order for possession if it considers the claim to be retaliatory.</p>
      </div>
    </div>
  );
}
