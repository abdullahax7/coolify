"use client";

import React from 'react';

interface FormRHW19Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    previousNoticeDate?: string;
    expiryDate?: string;
    withdrawalTiming?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW19({ data }: FormRHW19Props) {
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
        .chk-row { display: flex; align-items: flex-start; gap: 10pt; padding: 8pt; border-bottom: 1px solid #000; }
        .chk-row:last-child { border-bottom: none; }
        .chkbox { display: inline-block; width: 12pt; height: 12pt; border: 1px solid #000; text-align: center; line-height: 12pt; font-weight: bold; margin-top: 2pt; flex-shrink: 0; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; }
        .sig-col { flex: 0 0 60%; }
        .date-col { flex: 0 0 35%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 25pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
      `}</style>

      <div className="form-id">FORM RHW19</div>
      <div className="form-title">
        NOTICE OF WITHDRAWAL OF LANDLORD'S NOTICE OF TERMINATION:<br/>
        PERIODIC STANDARD CONTRACT
      </div>
      <div className="form-subtitle">
        This form is for use by a landlord to give notice to a contract-holder under section 180(3) of the Renting<br/>
        Homes (Wales) Act 2016 that the notice previously given under section 173 of that Act is withdrawn.
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
        <div className="part-header">Part D: Withdrawal of Notice to Give Up Possession</div>
        <div className="part-d-body">
          <p>On [<em>date</em>] <span className="field-input-val" style={{ display: 'inline-block', width: '100pt', textAlign: 'center' }}>{data.previousNoticeDate}</span> the landlord gave notice under section 173 of the Renting Homes (Wales) Act 2016 that you, the contract-holder(s), are required to give up possession of the dwelling on [<em>date</em>] <span className="field-input-val" style={{ display: 'inline-block', width: '100pt', textAlign: 'center' }}>{data.expiryDate}</span></p>
          <p style={{ marginTop: '8pt' }}>The landlord now gives further notice under section 180(3) of that Act that the previous notice referred to above is withdrawn. If this notice is given <strong>after</strong> 28 days from the date of the previous notice, you, the contract-holder(s), may object to the withdrawal in writing within a reasonable period.</p>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part E: Right to Object to the Withdrawal</div>
        <div style={{ fontStyle: 'italic', fontSize: '10pt', textAlign: 'center', padding: '2pt', borderBottom: '1px solid #000' }}>Tick as applicable.</div>
        <div className="chk-row">
          <span className="chkbox">{data.withdrawalTiming === 'Within 28 days of the previous notice (contract-holder may NOT object)' ? '✓' : ''}</span>
          <span>This notice is provided <strong>during</strong> the 28 days from the date of the previous notice under section 173 of the Renting Homes (Wales) Act 2016. You, the contract-holder(s), may <strong>not</strong> object to the withdrawal of that notice.</span>
        </div>
        <div className="chk-row">
          <span className="chkbox">{data.withdrawalTiming === 'After 28 days of the previous notice (contract-holder MAY object)' ? '✓' : ''}</span>
          <span>This notice is provided <strong>after</strong> 28 days from the date of the previous notice under section 173 of the Renting Homes (Wales) Act 2016. You, the contract-holder(s), may object to the withdrawal of that notice. Any objection must be in writing and must be issued to the landlord before the end of a reasonable period.</span>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part F: Signature</div>
        <div className="part-e-body" style={{ padding: '8pt' }}>
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
