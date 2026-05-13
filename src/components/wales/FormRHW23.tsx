"use client";

import React from 'react';

interface FormRHW23Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    possessionGround?: string[];
    breachParticulars?: string;
    estateManagementGround?: string[];
    groundIReasons?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW23({ data }: FormRHW23Props) {
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
        .chk-row { display: flex; align-items: flex-start; gap: 10pt; padding: 6pt 8pt; border-top: 1px solid #000; }
        .chkbox { display: inline-block; width: 12pt; height: 12pt; border: 1px solid #000; text-align: center; line-height: 12pt; font-weight: bold; margin-top: 2pt; flex-shrink: 0; }
        .sig-row { display: flex; justify-content: space-between; margin-top: 10pt; }
        .sig-col { flex: 0 0 60%; }
        .date-col { flex: 0 0 35%; }
        .sig-line { border-bottom: 1px solid #000; width: 100%; min-height: 25pt; display: flex; alignItems: flex-end; margin-top: 5pt; }
        .sub-row { padding-left: 30pt; }
      `}</style>

      <div className="form-id">FORM RHW23</div>
      <div className="form-title">NOTICE BEFORE MAKING A POSSESSION CLAIM</div>
      <div className="form-subtitle">
        This form is for use by a landlord to give notice to a contract-holder under section 159(1), 161(1),<br/>
        166(1), 171(1) or 192(1) of the Renting Homes (Wales) Act 2016 that the landlord intends to make a<br/>
        possession claim to the court.
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
        <div style={{ padding: '8pt', fontSize: '10.5pt' }}>
          The landlord gives notice to the you, the contract-holder(s) of the above dwelling that the landlord intends to make a possession claim to the court on the following ground of the Renting Homes (Wales) Act 2016:
        </div>
        
        <div className="chk-row">
          <span className="chkbox">{data.possessionGround?.includes('Breach of contract (section 157)') ? '✓' : ''}</span>
          <div>
            <strong>Breach of contract</strong> (section 157)<br/>
            <span className="field-input-val" style={{ display: 'block', fontStyle: 'italic', marginTop: '4pt' }}>{data.breachParticulars}</span>
          </div>
        </div>

        <div className="chk-row">
          <span className="chkbox">{data.possessionGround?.includes('Estate management grounds (section 160 and Schedule 8)') ? '✓' : ''}</span>
          <strong>Estate management grounds</strong> (section 160 and Schedule 8)
        </div>
        
        {[
          { key: 'A', label: 'Ground A – Building works / redevelopment' },
          { key: 'B', label: 'Ground B – Redevelopment schemes (community landlord)' },
          { key: 'C', label: 'Ground C – Charities: dwelling required for charitable purposes' },
          { key: 'D', label: 'Ground D – Dwelling adapted for disabled person (required for another disabled person)' },
          { key: 'E', label: 'Ground E – Housing associations: individual difficult to house' },
          { key: 'F', label: 'Ground F – Groups of dwellings for people with special needs' },
          { key: 'G', label: 'Ground G – Reserve successors (over-accommodation)' },
          { key: 'H', label: 'Ground H – Joint contract-holders: one has left' },
          { key: 'I', label: 'Ground I – Other estate management reasons' },
        ].map(ground => (
          <div className="chk-row sub-row" key={ground.key} style={{ borderTop: 'none', padding: '2pt 8pt 2pt 40pt' }}>
            <span className="chkbox">{data.estateManagementGround?.includes(ground.label) ? '✓' : ''}</span>
            <span>{ground.label}</span>
          </div>
        ))}
        
        {data.estateManagementGround?.includes('Ground I – Other estate management reasons') && (
          <div style={{ padding: '8pt 8pt 8pt 40pt', fontStyle: 'italic', borderTop: '1px dotted #ccc' }}>
            <strong>Reasons for Ground I:</strong><br/>
            {data.groundIReasons}
          </div>
        )}

        <div className="chk-row">
          <span className="chkbox">{data.possessionGround?.includes("Contract-holder's failure to give up possession (section 165/170/191)") ? '✓' : ''}</span>
          <span><strong>Contract-holder's failure to give up possession of the dwelling</strong> following the contract-holder providing notice to end the contract (section 165, 170 or 191)</span>
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
