"use client";

import React from 'react';

interface FormRHW12Props {
  data: {
    contractType?: string;
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    effectiveDate?: string;
    newRent?: string;
    rentPeriod?: string;
    currentRent?: string;
    currentRentPeriod?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW12({ data }: FormRHW12Props) {
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
        .checkbox-item { display: flex; align-items: center; justify-content: space-between; padding: 4pt 8pt; font-size: 10.5pt; }
        .chkbox { display: inline-block; width: 12pt; height: 12pt; border: 1px solid #000; text-align: center; line-height: 12pt; font-weight: bold; }
        .part-single { border: 1px solid #000; border-top: none; }
        .part-e-body { padding: 10pt 8pt 12pt; font-size: 11pt; line-height: 1.5; }
        .rent-line { margin-bottom: 4pt; line-height: 1.8; display: flex; align-items: baseline; flex-wrap: wrap; }
        .hint-text { font-style: italic; font-size: 9.5pt; color: #444; margin-bottom: 10pt; }
        .part-f-body { padding: 6pt 8pt 12pt; font-size: 11pt; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; }
        .sig-col { flex: 0 0 60%; }
        .date-col { flex: 0 0 35%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 30pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
        .guidance-notes { margin-top: 14pt; font-size: 10pt; line-height: 1.5; border-top: 1px solid #ccc; padding-top: 10pt; }
        .guidance-title { font-weight: bold; margin-bottom: 6pt; }
      `}</style>

      <div className="form-id">FORM RHW12</div>
      <div className="form-title">NOTICE OF VARIATION OF RENT</div>
      <div className="form-subtitle">
        This form is for use by a landlord to give notice to a contract-holder under section 104(1) or 123(1) of<br/>
        the Renting Homes (Wales) Act 2016 of a new rent to take effect on a specified date.
      </div>

      <div className="parts-row">
        <div className="col">
          <div className="part-header">Part A: Type of Occupation Contract</div>
          <div className="part-subheader">Tick as applicable.</div>
          <div style={{ padding: '4pt 0' }}>
            <div className="checkbox-item">
              <span>Secure contract</span>
              <span className="chkbox">{data.contractType === 'Secure contract' ? '✓' : ''}</span>
            </div>
            <div className="checkbox-item">
              <span>Periodic standard contract</span>
              <span className="chkbox">{data.contractType === 'Periodic standard contract' ? '✓' : ''}</span>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="part-header">Part B: Landlord</div>
          <div className="part-body">
            <div className="field-row"><strong>Name:</strong> <span className="field-input-val">{data.landlordName}</span></div>
            <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.landlordAddress}</span></div>
          </div>
        </div>
      </div>

      <div className="parts-row second-row">
        <div className="col">
          <div className="part-header">Part C: Contract-Holder(s)</div>
          <div className="part-body">
            <div className="field-row"><strong>Name(s):</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.tenantName}</span></div>
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
        <div className="part-header">Part E: Notice of Variation of Rent</div>
        <div className="part-e-body">
          <div style={{ marginBottom: '10pt' }}>The rent payable under the occupation contract of the above dwelling is to be varied.</div>
          
          <div className="rent-line">
            The rent payable from <span className="field-input-val" style={{ margin: '0 5pt', minWidth: '100pt', textAlign: 'center' }}>{data.effectiveDate}</span> will be <span className="field-input-val" style={{ margin: '0 5pt', minWidth: '70pt', textAlign: 'center' }}>{data.newRent}</span> per <span className="field-input-val" style={{ margin: '0 5pt', minWidth: '80pt', textAlign: 'center' }}>{data.rentPeriod}</span>.
          </div>
          <div className="hint-text" style={{ display: 'flex', gap: '50pt', paddingLeft: '80pt' }}>
            <span>[date]</span>
            <span>[amount]</span>
            <span>[e.g. week/month/year]</span>
          </div>

          <div className="rent-line">
            This is in place of the existing rent of <span className="field-input-val" style={{ margin: '0 5pt', minWidth: '70pt', textAlign: 'center' }}>{data.currentRent}</span> per <span className="field-input-val" style={{ margin: '0 5pt', minWidth: '80pt', textAlign: 'center' }}>{data.currentRentPeriod}</span>.
          </div>
          <div className="hint-text" style={{ display: 'flex', gap: '50pt', paddingLeft: '170pt' }}>
            <span>[amount]</span>
            <span>[e.g. week/month/year]</span>
          </div>

          <div style={{ marginTop: '15pt', fontSize: '10.5pt', fontStyle: 'italic' }}>
            Note: The specified date from which the new rent is payable must not be less than two months from the date that this notice is given. This notice must not specify a date from which a new rent is payable within one year of a previous rent variation taking effect.
          </div>
        </div>
      </div>

      <div className="part-single">
        <div className="part-header">Part F: Signature</div>
        <div className="part-f-body">
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

      <div className="guidance-notes">
        <div className="guidance-title">Guidance notes for contract-holders</div>
        <p>This notice informs you that a new rent is payable from the date listed in Part E. If you need advice about any aspect of this notice or are worried that you may not be able to pay your rent, you should first contact your landlord. Many problems can be resolved quickly by raising them when they first arise. If you are unable to reach an agreement with your landlord, you may wish to contact an advice agency (such as Citizens Advice Cymru or Shelter Cymru) or independent legal advisors.</p>
        <p>You should make arrangements to pay the new rent. If you pay by standing order through your bank, you should inform them that the amount has changed. You should also notify your Housing Benefit office in your local authority if you are claiming a benefit, or the Department for Work and Pensions if you are claiming Universal Credit.</p>
      </div>
    </div>
  );
}
