"use client";

import React from 'react';

interface FormRHW3Props {
  data: {
    formerLandlordName?: string;
    formerLandlordAddress?: string;
    contractHolderName?: string;
    dwellingAddress?: string;
    newLandlordName?: string;
    newLandlordAddress?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW3({ data }: FormRHW3Props) {
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
        .parts-ab { display: flex; width: 100%; border: 1px solid #000; }
        .parts-ab .col { flex: 1; border-right: 1px solid #000; }
        .parts-ab .col:last-child { border-right: none; }
        .part-header { font-weight: bold; font-size: 11.5pt; text-align: center; padding: 3pt 6pt; border-bottom: 1px solid #000; }
        .part-body { padding: 6pt 8pt 10pt; font-size: 11pt; line-height: 1.8; }
        .field-row { display: flex; align-items: baseline; margin-bottom: 6pt; gap: 4pt; }
        .field-input-val { border-bottom: 1px dotted #000; flex: 1; min-height: 1.2em; }
        .part-single { border: 1px solid #000; border-top: none; }
        .part-d-body { padding: 6pt 8pt 10pt; font-size: 11pt; line-height: 1.5; }
        .part-d-note { margin-top: 10pt; font-size: 11pt; line-height: 1.45; }
        .part-e-body { padding: 6pt 8pt 12pt; font-size: 11pt; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; }
        .sig-col { flex: 0 0 60%; }
        .date-col { flex: 0 0 35%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 30pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
      `}</style>

      <div className="form-id">FORM RHW3</div>
      <div className="form-title">
        NOTICE OF CHANGE IN LANDLORD'S IDENTITY AND NOTICE OF NEW<br/>
        LANDLORD'S ADDRESS
      </div>
      <div className="form-subtitle">
        This form is for use by a new landlord to give notice to a contract-holder under section 39(2) of the<br/>
        Renting Homes (Wales) Act 2016 of a change in the identity of the landlord and of an address to which<br/>
        documents intended for the new landlord may be sent.
      </div>

      <div className="parts-ab">
        <div className="col">
          <div className="part-header">Part A: Former Landlord</div>
          <div className="part-body">
            <div className="field-row"><strong>Name:</strong> <span className="field-input-val">{data.formerLandlordName}</span></div>
            <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.formerLandlordAddress}</span></div>
          </div>
        </div>
        <div className="col">
          <div className="part-header">Part B: Contract-Holder(s)</div>
          <div className="part-body">
            <div className="field-row"><strong>Name(s):</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.contractHolderName}</span></div>
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
        <div className="part-header">Part D: Notice of Change in Landlord's Identity and Notice of New Landlord's Address</div>
        <div className="part-d-body">
          <div style={{ marginBottom: '10pt' }}>There has been a change in the identity of the landlord of the above dwelling. The new landlord's details are:</div>
          <div className="field-row"><strong>Name:</strong> <span className="field-input-val">{data.newLandlordName}</span></div>
          <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.newLandlordAddress}</span></div>
          <div className="part-d-note">
            This is the address to which you, the contract-holder(s), may send documents that are intended for the new landlord.
          </div>
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
