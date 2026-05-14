"use client";

import React from 'react';

interface FormRHW15Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    exclusionReason?: string[];
    exclusionSpecifics?: string;
    exclusionDateTime?: string;
    exclusionPeriod?: string;
    returnDateTime?: string;
    firstExclusionDate?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW15({ data }: FormRHW15Props) {
  const reasons = data.exclusionReason || [];

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
        .form-subtitle { text-align: center; font-style: italic; font-size: 11pt; line-height: 1.45; margin-bottom: 8pt; }
        .parts-row { display: flex; width: 100%; border: 1px solid #000; }
        .parts-row .col { flex: 1; border-right: 1px solid #000; }
        .parts-row .col:last-child { border-right: none; }
        .part-header { font-weight: bold; font-size: 11.5pt; text-align: center; padding: 3pt 6pt; border-bottom: 1px solid #000; }
        .part-body { padding: 6pt 8pt 10pt; font-size: 11pt; line-height: 1.8; }
        .field-row { display: flex; align-items: baseline; margin-bottom: 6pt; gap: 4pt; }
        .field-input-val { border-bottom: 1px dotted #000; flex: 1; min-height: 1.2em; }
        .part-single { border: 1px solid #000; border-top: none; }
        .chk-row { display: flex; align-items: flex-start; gap: 10pt; padding: 5pt 8pt; border-top: 1px solid #000; }
        .chkbox { display: inline-block; width: 12pt; height: 12pt; border: 1px solid #000; text-align: center; line-height: 12pt; font-weight: bold; margin-top: 2pt; flex-shrink: 0; }
        .part-d-body { padding: 6pt 8pt 0; font-size: 11pt; }
        .specifics-section { border-top: 1px solid #000; padding: 8pt; }
        .cont-body { padding: 8pt; font-size: 11pt; line-height: 1.6; border: 1px solid #000; border-top: none; }
        .inline-val { border-bottom: 1px dotted #000; padding: 0 4pt; font-style: italic; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; padding: 10pt 8pt 12pt; border: 1px solid #000; border-top: none; }
        .sig-col { flex: 0 0 55%; }
        .date-col { flex: 0 0 40%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 30pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
      `}</style>

      <div className="form-id">FORM RHW15</div>
      <div className="form-title">NOTICE OF TEMPORARY EXCLUSION: SUPPORTED STANDARD CONTRACT</div>
      <div className="form-subtitle">
        This form is for use by a community landlord or a registered charity to give notice to a supported standard contract-holder to temporarily leave the dwelling under section 145(4) of the Renting Homes (Wales) Act 2016.
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
          <div className="part-header">Part B: Contract-Holder</div>
          <div className="part-body">
            <div className="field-row"><strong>Name:</strong> <span className="field-input-val">{data.tenantName}</span></div>
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
        <div className="part-header">Part D: Notice of Temporary Exclusion</div>
        <div className="part-d-body">
          <p style={{ marginBottom: '4pt' }}>The landlord reasonably believes that you, the contract-holder, have done one or more of the following acts:</p>
          <p style={{ fontStyle: 'italic', marginBottom: '8pt' }}>Tick as applicable.</p>
        </div>
        <div className="chk-row">
          <span className="chkbox">{reasons.includes('Used violence against any person in the dwelling') ? '✓' : ''}</span>
          <span>Used violence against any person in the dwelling</span>
        </div>
        <div className="chk-row">
          <span className="chkbox">{reasons.includes('Done something creating a risk of significant harm to any person') ? '✓' : ''}</span>
          <span>Done something in the dwelling which creates a risk of significant harm to any person</span>
        </div>
        <div className="chk-row">
          <span className="chkbox">{reasons.includes('Behaviour seriously impeding another resident from benefiting from support') ? '✓' : ''}</span>
          <span>Behaved in the dwelling in a way which seriously impedes the ability of another resident of supported accommodation provided by the landlord to benefit from the support provided in connection with that accommodation</span>
        </div>
        <div className="specifics-section">
          <div style={{ marginBottom: '2pt' }}>The specifics of the act(s) are as follows:</div>
          <div style={{ fontStyle: 'italic', marginBottom: '4pt', fontSize: '10pt' }}>Clearly set out the specifics.</div>
          <div className="field-input-val" style={{ minHeight: '60pt', whiteSpace: 'pre-wrap' }}>{data.exclusionSpecifics}</div>
        </div>
      </div>

      <div className="cont-body">
        <p>The landlord requires you, the contract-holder, to temporarily leave the dwelling on [<em>time and date of exclusion</em>] <span className="inline-val">{data.exclusionDateTime}</span> for the period specified below.</p>
        <p>Period of exclusion: [<em>number of hours and minutes up to a maximum of 48 hours</em>] <span className="inline-val">{data.exclusionPeriod}</span></p>
        <p>You may return to the dwelling on [<em>time and date of return</em>] <span className="inline-val">{data.returnDateTime}</span></p>
        <p>The landlord may use the power to exclude you no more than three times in any six month period.</p>
        <p>This exclusion is the period running from [<em>date of first exclusion</em>] <span className="inline-val">{data.firstExclusionDate}</span></p>
        <p style={{ fontStyle: 'italic', marginTop: '10pt', fontSize: '10.5pt' }}>
          Note: The landlord should provide the contract-holder with information which will assist the contract-holder in accessing the Homelessness Advice Services and local hostels/shelters.
        </p>
      </div>

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
          <strong>Date and time of signature:</strong>
          <div style={{ borderBottom: '1px solid #000', width: '100%', marginTop: '15pt', minHeight: '20pt' }}>
            {data.signatureDate}
          </div>
        </div>
      </div>
    </div>
  );
}
