"use client";

import React from 'react';

interface FormRHW8Props {
  data: {
    headLandlordName?: string;
    headLandlordAddress?: string;
    subHolderName?: string;
    contractHolderName?: string;
    contractHolderAddress?: string;
    dwellingAddress?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW8({ data }: FormRHW8Props) {
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
        .guidance-notes { margin-top: 14pt; font-size: 10.5pt; line-height: 1.5; border-top: 1px solid #ccc; padding-top: 10pt; }
        .guidance-title { font-weight: bold; margin-bottom: 6pt; }
      `}</style>

      <div className="form-id">FORM RHW8</div>
      <div className="form-title">NOTICE OF EXTENDED POSSESSION CLAIM AGAINST THE SUB-HOLDER</div>
      <div className="form-subtitle">
        This form is for use by a head landlord to give notice to the sub-holder under section 65(3)(b) of the<br/>
        Renting Homes (Wales) Act 2016 of the landlord's intention to apply for an extended possession claim<br/>
        against the sub-holder in possession claim proceedings against the contract-holder.
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
          <div className="part-header">Part B: Sub-Holder(s)</div>
          <div className="part-body">
            <div className="field-row"><strong>Name(s):</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.subHolderName}</span></div>
          </div>
        </div>
      </div>

      <div className="parts-row second-row">
        <div className="col">
          <div className="part-header">Part C: Contract-Holder(s)</div>
          <div className="part-subheader">Landlord(s) to the sub-holder</div>
          <div className="part-body">
            <div className="field-row"><strong>Name(s):</strong> <span className="field-input-val">{data.contractHolderName}</span></div>
            <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.contractHolderAddress}</span></div>
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
        <div className="part-header">Part E: Notice of Extended Possession Claim Against the Sub-Holder</div>
        <div className="part-e-body">
          <p>The head landlord gives notice to you, the sub-holder, in accordance with section 65(3)(b) of the Renting Homes (Wales) Act 2016, that the head landlord intends to apply to the court for an extended possession order against you, the sub-holder, in the proceedings on the claim against your current landlord(s), the contract-holder(s) of the above dwelling.</p>
          <p>You, the sub-holder, have a right to be party to the proceedings on the possession claim against the contract-holder(s).</p>
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

      <div className="guidance-notes">
        <div className="guidance-title">Guidance notes for sub-holder(s)</div>
        <p>The head landlord is applying to the court for a possession order against your landlord. This notice advises that the head landlord intends to extend the possession claim to you. You could be required by court order to give up possession of the dwelling listed at Part D.</p>
        <p>If you are in any doubt or need advice about any aspect of this notice, you should first contact your landlord. Many problems can be resolved quickly by raising them when they first arise. If you are unable to reach an agreement with your landlord, you may wish to contact an advice agency (such as Citizens Advice Cymru or Shelter Cymru) or independent legal advisors. If you believe you are at risk of homelessness as a result of receiving this notice, you should contact your local authority for support.</p>
      </div>
    </div>
  );
}
