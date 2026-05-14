"use client";

import React from 'react';

interface FormRHW6Props {
  data: {
    headLandlordName?: string;
    headLandlordAddress?: string;
    contractHolderName?: string;
    contractHolderAddress?: string;
    subHolderName?: string;
    dwellingAddress?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW6({ data }: FormRHW6Props) {
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
      boxSizing: 'border-box'
    }}>
      <style jsx>{`
        .form-id { text-align: center; font-size: 12pt; margin-bottom: 18pt; }
        .form-title { text-align: center; font-size: 12pt; font-weight: bold; margin-bottom: 10pt; line-height: 1.4; }
        .form-subtitle { text-align: center; font-style: italic; font-size: 11pt; line-height: 1.45; margin-bottom: 14pt; }
        .parts-row { display: flex; width: 100%; border: 1px solid #000; }
        .parts-row .col { flex: 1; border-right: 1px solid #000; }
        .parts-row .col:last-child { border-right: none; }
        .parts-row.second-row .col { border-top: none; }
        .part-header { font-weight: bold; font-size: 11.5pt; text-align: center; padding: 3pt 6pt; border-bottom: 1px solid #000; }
        .part-subheader { font-style: italic; font-size: 10pt; text-align: center; padding: 2pt 6pt; border-bottom: 1px solid #000; background: #f8fafc; }
        .part-body { padding: 6pt 8pt 10pt; font-size: 11pt; line-height: 1.8; }
        .field-row { display: flex; align-items: baseline; margin-bottom: 6pt; gap: 4pt; }
        .field-input-val { border-bottom: 1px dotted #000; flex: 1; min-height: 1.2em; }
        .part-single { border: 1px solid #000; border-top: none; }
        .part-e-body { padding: 6pt 8pt 10pt; font-size: 11pt; line-height: 1.5; }
        .part-f-body { padding: 6pt 8pt 12pt; font-size: 11pt; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; }
        .sig-col { flex: 0 0 60%; }
        .date-col { flex: 0 0 35%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 30pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
      `}</style>

      <div className="form-id">FORM RHW6</div>
      <div className="form-title">
        NOTICE OF HEAD LANDLORD'S DECISION TO TREAT SUB-OCCUPATION<br/>
        CONTRACT AS A PERIODIC STANDARD CONTRACT
      </div>
      <div className="form-subtitle">
        This form is for use by the head landlord to give notice to the contract-holder and the sub-holder under<br/>
        section 61(7) of the Renting Homes (Wales) Act 2016 of the decision to treat the sub-occupation contract<br/>
        as a periodic standard contract.
      </div>

      <div className="parts-row">
        <div className="col">
          <div className="part-header">Part A: Head Landlord</div>
          <div className="part-body">
            <div className="field-row"><strong>Name:</strong> <span className="field-input-val">{data.headLandlordName}</span></div>
            <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.headLandlordAddress}</span></div>
          </div>
        </div>
        <div className="col">
          <div className="part-header">Part B: Contract-Holder(s)</div>
          <div className="part-subheader">Landlord(s) to the sub-holder(s)</div>
          <div className="part-body">
            <div className="field-row"><strong>Name(s):</strong> <span className="field-input-val">{data.contractHolderName}</span></div>
            <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.contractHolderAddress}</span></div>
          </div>
        </div>
      </div>

      <div className="parts-row second-row">
        <div className="col">
          <div className="part-header">Part C: Sub-Holder(s)</div>
          <div className="part-body">
            <div className="field-row"><strong>Name(s):</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.subHolderName}</span></div>
          </div>
        </div>
        <div className="col">
          <div className="part-header">Part D: Dwelling</div>
          <div className="part-body">
            <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.dwellingAddress}</span></div>
          </div>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part E: Notice of Head Landlord's Decision to Treat Sub-Occupation Contract as a Periodic Standard Contract</div>
        <div className="part-e-body">
          <p>The head landlord has decided, in accordance with section 61(6) of the Renting Homes (Wales) Act 2016, to treat the sub-occupation contract of the above dwelling as a periodic standard contract having the following characteristics:</p>
          <p>(a) all the fundamental and supplementary provisions applicable to a periodic standard contract are incorporated without modification,</p>
          <p>(b) any terms of the contract which are incompatible with the fundamental or supplementary provisions referred to at (a) have no effect, and</p>
          <p>(c) otherwise, the terms of the contract are the same.</p>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part F: Signature</div>
        <div className="part-f-body">
          <div className="sig-row">
            <div className="sig-col">
              <strong>Signed by, or on behalf of, the head landlord:</strong>
              <div className="sig-line">
                {data.signedBy?.startsWith('data:image') ? (
                  <img src={data.signedBy} alt="Signature" style={{ maxHeight: '40pt', maxWidth: '100%' }} />
                ) : (
                  <span style={{ fontSize: '11pt' }}>{data.signedBy}</span>
                )}
              </div>
            </div>
            <div className="date-col">
              <strong>Date:</strong>
              <div style={{ borderBottom: '1px solid #000', width: '100%', marginTop: '15pt', minHeight: '20pt' }}>
                {data.signatureDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
