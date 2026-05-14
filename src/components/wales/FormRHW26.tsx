"use client";

import React from 'react';

interface FormRHW26Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    originalNoticeDate?: string;
    possessionDate?: string;
    withdrawalTiming?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW26({ data }: FormRHW26Props) {
  return (
    <div className="wales-form-container">
      <style jsx>{`
        .wales-form-container {
          background: #d0d0d0;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          min-height: 100vh;
          font-family: "Times New Roman", Times, serif;
          font-size: 11pt;
          color: #000;
        }

        .page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto 20px auto;
          background: #fff;
          padding: 25mm 20mm;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
          position: relative;
          box-sizing: border-box;
        }

        .form-id {
          text-align: center;
          font-size: 12pt;
          font-weight: normal;
          margin-bottom: 18pt;
        }

        .form-title {
          text-align: center;
          font-size: 12pt;
          font-weight: bold;
          line-height: 1.4;
          margin-bottom: 10pt;
        }

        .form-subtitle {
          text-align: center;
          font-style: italic;
          font-size: 11pt;
          line-height: 1.45;
          margin-bottom: 14pt;
        }

        .parts-row {
          display: table;
          width: 100%;
          border-collapse: collapse;
        }

        .parts-row .col {
          display: table-cell;
          width: 50%;
          border: 1px solid #000;
          vertical-align: top;
        }

        .parts-row .col+.col {
          border-left: none;
        }

        .part-header {
          font-weight: bold;
          font-size: 11.5pt;
          text-align: center;
          padding: 3pt 6pt;
          border-bottom: 1px solid #000;
          background: #f8fafc;
        }

        .part-subheader {
          font-style: italic;
          font-size: 11pt;
          text-align: center;
          padding: 2pt 6pt;
          border-bottom: 1px solid #000;
        }

        .part-body {
          padding: 6pt 8pt 10pt;
          font-size: 11pt;
          line-height: 1.8;
        }

        .part-single {
          border: 1px solid #000;
          border-top: none;
        }

        .part-d-body {
          padding: 6pt 8pt 10pt;
          font-size: 11pt;
          line-height: 1.5;
        }

        .part-d-body p {
          margin-bottom: 8pt;
        }

        .inline-val {
          border-bottom: 1px solid #888;
          padding: 0 2pt;
          min-width: 130pt;
          display: inline-block;
          font-style: italic;
        }

        .chk-row {
          display: flex;
          align-items: flex-start;
          gap: 10pt;
          padding: 8pt 8pt;
          border-top: 1px solid #000;
          font-size: 11pt;
          line-height: 1.45;
        }

        .chk-row:last-child {
          border-bottom: 1px solid #000;
        }

        .chkbox {
          display: inline-block;
          width: 12pt;
          min-width: 12pt;
          height: 12pt;
          border: 1px solid #000;
          position: relative;
          margin-top: 2pt;
        }

        .chkbox.checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 10pt;
          font-weight: bold;
          line-height: 1;
        }

        .part-f-body {
          padding: 6pt 8pt 12pt;
          font-size: 11pt;
        }

        .part-f-row1 {
          display: flex;
          margin-bottom: 10pt;
        }

        .sig-col {
          flex: 0 0 55%;
        }

        .date-col {
          flex: 0 0 45%;
          display: flex;
          align-items: baseline;
          gap: 6pt;
        }

        .dots-row {
          display: flex;
        }

        .dots-sig {
          flex: 0 0 55%;
        }

        .field-row {
          display: flex;
          align-items: baseline;
          gap: 4pt;
          margin-bottom: 4pt;
        }

        .field-val {
          flex: 1;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .sig-val {
          border-bottom: 1px dotted #000;
          min-height: 20px;
          flex: 1;
        }

        @media print {
          .wales-form-container {
            background: #fff;
            padding: 0;
          }

          .page {
            box-shadow: none;
            margin: 0;
            width: 100%;
            min-height: auto;
            padding: 20mm;
          }
        }
      `}</style>

      <div className="page">
        <div className="form-id">FORM RHW26</div>
        <div className="form-title">
          NOTICE OF WITHDRAWAL OF NOTICE OF TERMINATION UNDER<br/>
          LANDLORD'S BREAK CLAUSE: FIXED TERM STANDARD CONTRACT
        </div>
        <div className="form-subtitle">
          This form is for use by a landlord to give notice to a contract-holder under section 201(3) of the Renting<br/>
          Homes (Wales) Act 2016 that the notice previously given in accordance with the landlord's break clause<br/>
          is withdrawn.
        </div>

        {/* Parts A & B */}
        <div className="parts-row">
          <div className="col">
            <div className="part-header">Part A: Landlord</div>
            <div className="part-body">
              <div className="field-row"><label>Name:</label><div className="field-val">{data.landlordName}</div></div>
              <div className="field-row" style={{ alignItems: 'flex-start', marginTop: '4pt' }}>
                <label>Address:</label><div className="field-val">{data.landlordAddress}</div></div>
            </div>
          </div>
          <div className="col">
            <div className="part-header">Part B: Contract-Holder(s)</div>
            <div className="part-body">
              <div className="field-row" style={{ alignItems: 'flex-start' }}><label>Name(s):</label><div className="field-val">{data.tenantName}</div></div>
            </div>
          </div>
        </div>

        {/* Part C */}
        <div className="part-single">
          <div className="part-header">Part C: Dwelling</div>
          <div className="part-body">
            <div className="field-row" style={{ alignItems: 'flex-start' }}><label>Address:</label><div className="field-val">{data.dwellingAddress}</div></div>
          </div>
        </div>

        {/* Part D */}
        <div className="part-single">
          <div className="part-header">Part D: Withdrawal of Notice to Give Up Possession</div>
          <div className="part-d-body">
            <p>On [<em>date</em>] <span className="inline-val">{data.originalNoticeDate}</span> the landlord gave notice, in accordance with the landlord's break clause in the occupation contract, that you, the contract-holder(s), are required to give up possession of the above dwelling on [<em>date</em>] <span className="inline-val">{data.possessionDate}</span></p>
            <p>The landlord now gives further notice under section 201(3) of the Renting Homes (Wales) Act 2016 that the previous notice referred to above is withdrawn. If this notice is given <strong>after</strong> 28 days from the date of the previous notice, you, the contract-holder(s), may object to the withdrawal.</p>
            <p>This notice must be given before the occupation contract ends.</p>
          </div>
        </div>

        {/* Part E */}
        <div className="part-single">
          <div className="part-header">Part E: Right to Object to the Withdrawal</div>
          <div className="part-subheader"><em>Tick as applicable.</em></div>
          <div className="chk-row">
            <span className={`chkbox ${data.withdrawalTiming === 'Within 28 days of the previous notice (contract-holder may NOT object)' ? 'checked' : ''}`}></span>
            <span>This notice is provided <strong>during</strong> the 28 days from the date of the previous notice under section 194 of the Renting Homes (Wales) Act 2016. You, the contract-holder(s), may <strong>not</strong> object to the withdrawal of that notice.</span>
          </div>
          <div className="chk-row">
            <span className={`chkbox ${data.withdrawalTiming === 'After 28 days of the previous notice (contract-holder MAY object)' ? 'checked' : ''}`}></span>
            <span>This notice is provided <strong>after</strong> 28 days from the date of the previous notice under section 194 of the Renting Homes (Wales) Act 2016. You, the contract-holder(s), may object to the withdrawal of that notice. Any objection must be in writing and must be issued to the landlord before the end of a reasonable period.</span>
          </div>
        </div>

        {/* Part F */}
        <div className="part-single">
          <div className="part-header">Part F: Signature</div>
          <div className="part-f-body">
            <div className="part-f-row1">
              <div className="sig-col">Signed by, or on behalf of, the landlord:</div>
              <div className="date-col"><span>Date:</span><div className="sig-val">{data.signatureDate}</div></div>
            </div>
            <div className="dots-row">
              <div className="dots-sig">
                <div className="sig-val" style={{ width: '90%', borderBottom: '1px dotted #000' }}>
                  {data.signedBy?.startsWith('data:image') ? (
                    <img src={data.signedBy} alt="Signature" style={{ maxHeight: '40px', maxWidth: '100%' }} />
                  ) : (
                    <span>{data.signedBy}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
