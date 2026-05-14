"use client";

import React from 'react';

interface FormRHW1Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    schedule3Para?: string[];
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW1({ data }: FormRHW1Props) {
  const paras = data.schedule3Para || [];

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
        .form-title { text-align: center; font-size: 12pt; font-weight: bold; margin-bottom: 10pt; }
        .form-subtitle { text-align: center; font-style: italic; font-size: 11pt; line-height: 1.45; margin-bottom: 14pt; }
        .parts-ab { display: flex; width: 100%; border: 1px solid #000; break-inside: avoid; }
        .parts-ab .col { flex: 1; border-right: 1px solid #000; }
        .parts-ab .col:last-child { border-right: none; }
        .part-header { font-weight: bold; font-size: 11.5pt; text-align: center; padding: 3pt 6pt; border-bottom: 1px solid #000; }
        .part-body { padding: 6pt 8pt 10pt; font-size: 11pt; line-height: 1.8; }
        .field-row { display: flex; align-items: baseline; margin-bottom: 6pt; gap: 4pt; }
        .field-input-val { border-bottom: 1px dotted #000; flex: 1; min-height: 1.2em; }
        .part-c { border: 1px solid #000; border-top: none; break-inside: avoid; }
        .part-d { border: 1px solid #000; border-top: none; break-inside: avoid; }
        .part-d-body { padding: 6pt 8pt 6pt; font-size: 11pt; line-height: 1.45; }
        .checkbox-rows { width: 100%; border-collapse: collapse; border-top: 1px solid #000; margin-top: 4pt; }
        .checkbox-rows td { font-size: 10pt; padding: 4pt 2pt; vertical-align: middle; }
        .chkbox { display: inline-block; width: 12pt; height: 12pt; border: 1px solid #000; text-align: center; line-height: 12pt; font-weight: bold; }
        .part-e { border: 1px solid #000; border-top: none; padding: 10pt; font-size: 11pt; break-inside: avoid; }
        .part-f { border: 1px solid #000; border-top: none; padding: 10pt; font-size: 11pt; break-inside: avoid; }

      `}</style>

      <div className="form-id">FORM RHW1</div>
      <div className="form-title">NOTICE OF STANDARD CONTRACT</div>
      <div className="form-subtitle">
        This form is for use by a community landlord to give notice to a contract-holder under section 13 of the<br/>
        Renting Homes (Wales) Act 2016 that the occupation contract is a standard contract.
      </div>

      <div className="parts-ab">
        <div className="col">
          <div className="part-header">Part A: Community Landlord</div>
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

      <div className="part-c">
        <div className="part-header">Part C: Dwelling</div>
        <div className="part-body">
          <div className="field-row"><strong>Address:</strong> <span className="field-input-val" style={{ whiteSpace: 'pre-wrap' }}>{data.dwellingAddress}</span></div>
        </div>
      </div>

      <div className="part-d">
        <div className="part-header">Part D: Notice of Standard Contract</div>
        <div className="part-d-body">
          <p>The community landlord, in reliance of the following paragraph of Schedule 3 to the Renting Homes (Wales) Act 2016, gives notice under section 13 of that Act that the occupation contract is a standard contract.</p>
          
          <table className="checkbox-rows">
            <tbody>
              <tr>
                <td>1. Occupation contracts by notice</td>
                <td><span className="chkbox">{paras.includes('Paragraph 1: Occupation contracts by notice') ? '✓' : ''}</span></td>
                <td>9. Service occupancy: fire and rescue services</td>
                <td><span className="chkbox">{paras.includes('Paragraph 9: Service occupancy: fire and rescue services') ? '✓' : ''}</span></td>
              </tr>
              <tr>
                <td>2. Supported accommodation</td>
                <td><span className="chkbox">{paras.includes('Paragraph 2: Supported accommodation') ? '✓' : ''}</span></td>
                <td>10. Student accommodation</td>
                <td><span className="chkbox">{paras.includes('Paragraph 10: Student accommodation') ? '✓' : ''}</span></td>
              </tr>
              <tr>
                <td>3. Introductory occupation</td>
                <td><span className="chkbox">{paras.includes('Paragraph 3: Introductory occupation') ? '✓' : ''}</span></td>
                <td>11. Temporary accommodation: land acquired for development</td>
                <td><span className="chkbox">{paras.includes('Paragraph 11: Temporary accommodation: land acquired for development') ? '✓' : ''}</span></td>
              </tr>
              <tr>
                <td>4. Accommodation for asylum seekers</td>
                <td><span className="chkbox">{paras.includes('Paragraph 4: Accommodation for asylum seekers') ? '✓' : ''}</span></td>
                <td>12. Temporary accommodation: persons taking up employment</td>
                <td><span className="chkbox">{paras.includes('Paragraph 12: Temporary accommodation: persons taking up employment') ? '✓' : ''}</span></td>
              </tr>
              <tr>
                <td>5. Repealed - not applicable</td>
                <td><span className="chkbox">{paras.includes('Paragraph 5: Repealed - not applicable') ? '✓' : ''}</span></td>
                <td>13. Temporary accommodation: short-term arrangements</td>
                <td><span className="chkbox">{paras.includes('Paragraph 13: Temporary accommodation: short-term arrangements') ? '✓' : ''}</span></td>
              </tr>
              <tr>
                <td>6. Accommodation for homeless persons</td>
                <td><span className="chkbox">{paras.includes('Paragraph 6: Accommodation for homeless persons') ? '✓' : ''}</span></td>
                <td>14. Temporary accommodation: accommodation during works</td>
                <td><span className="chkbox">{paras.includes('Paragraph 14: Temporary accommodation: accommodation during works') ? '✓' : ''}</span></td>
              </tr>
              <tr>
                <td>7. Service occupancy: general</td>
                <td><span className="chkbox">{paras.includes('Paragraph 7: Service occupancy: general') ? '✓' : ''}</span></td>
                <td>15. Accommodation which is not social accommodation</td>
                <td><span className="chkbox">{paras.includes('Paragraph 15: Accommodation which is not social accommodation') ? '✓' : ''}</span></td>
              </tr>
              <tr>
                <td>8. Service occupancy: police</td>
                <td><span className="chkbox">{paras.includes('Paragraph 8: Service occupancy: police') ? '✓' : ''}</span></td>
                <td>16. Dwellings intended for transfer</td>
                <td><span className="chkbox">{paras.includes('Paragraph 16: Dwellings intended for transfer') ? '✓' : ''}</span></td>
              </tr>
              {/* Add more as needed based on the 16 paragraphs in FORM_SCHEMAS */}
            </tbody>
          </table>
        </div>
      </div>

      <div className="part-e">
        <strong>Part E: Right of Review</strong>
        <p style={{ marginTop: '8pt' }}>You, the contract-holder, may apply to the county court for a review of the community landlord's decision to give this notice stating that the occupation contract is a standard contract.</p>
        <p>The application must be made within 14 days of the landlord giving this notice to you.</p>
      </div>

      <div className="part-f">
        <strong>Part F: Signature</strong>
        <div style={{ marginTop: '10pt', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>Signed by/on behalf of landlord:</strong>
            <div style={{ borderBottom: '1px solid #000', width: '250px', marginTop: '5pt', minHeight: '30pt', display: 'flex', alignItems: 'flex-end' }}>
              {data.signedBy?.startsWith('data:image') ? (
                <img src={data.signedBy} alt="Signature" style={{ maxHeight: '40pt', maxWidth: '100%' }} />
              ) : (
                <span style={{ fontSize: '11pt' }}>{data.signedBy}</span>
              )}
            </div>
          </div>
          <div>
            <strong>Date:</strong>
            <div style={{ borderBottom: '1px solid #000', width: '120px', marginTop: '15pt', minHeight: '20pt' }}>
              {data.signatureDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
