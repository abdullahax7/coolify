"use client";

import React from 'react';

interface FormRHW28Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    subHolderLodgerNames?: string;
    dwellingAddress?: string;
    previousNoticeDate?: string;
    contractEndDate?: string;
    possessionDate?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW28({ data }: FormRHW28Props) {
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

        .parts-row.second-row .col {
          border-top: none;
        }

        .part-header {
          font-weight: bold;
          font-size: 11.5pt;
          text-align: center;
          padding: 3pt 6pt;
          border-bottom: 1px solid #000;
          background: #f8fafc;
        }

        .part-body {
          padding: 6pt 8pt 10pt;
          font-size: 11pt;
          line-height: 1.8;
        }

        .part-c-body {
          padding: 6pt 8pt 8pt;
          font-size: 11pt;
          line-height: 1.8;
        }

        .part-c-note {
          font-style: italic;
          font-size: 10.5pt;
          line-height: 1.4;
          margin-top: 8pt;
        }

        .part-single {
          border: 1px solid #000;
          border-top: none;
        }

        .part-e-body {
          padding: 6pt 8pt 10pt;
          font-size: 11pt;
          line-height: 1.5;
        }

        .part-e-body p {
          margin-bottom: 8pt;
        }

        .italic-note {
          font-style: italic;
        }

        .inline-val {
          border-bottom: 1px solid #888;
          padding: 0 2pt;
          min-width: 140pt;
          display: inline-block;
          font-style: italic;
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
        <div className="form-id">FORM RHW28</div>
        <div className="form-title">NOTICE OF END OF OCCUPATION CONTRACT DUE TO ABANDONMENT</div>
        <div className="form-subtitle">
          This form is for use by a landlord to give notice to a contract-holder under section 220(5) of the Renting<br/>
          Homes (Wales) Act 2016 that the occupation contract is at an end due to the contract-holder<br/>
          abandoning the dwelling and that the landlord is recovering possession of the dwelling without court<br/>
          proceedings. This notice must have been preceded by a notice under section 220(3) of the Renting<br/>
          Homes (Wales) Act 2016 (<strong>Form RHW27</strong>).
        </div>

        {/* Parts A & B (row 1) */}
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

        {/* Parts C & D (row 2) */}
        <div className="parts-row second-row">
          <div className="col">
            <div className="part-header">Part C: Sub-Holder(s) and Lodger(s)</div>
            <div className="part-c-body">
              <div className="field-row" style={{ alignItems: 'flex-start' }}>
                <label>Name(s) <em>(if applicable)</em>:</label>
                <div className="field-val">{data.subHolderLodgerNames}</div>
              </div>
              <div className="part-c-note"><em>The landlord must give a copy of this notice to any lodger or sub-holder of the contract-holder(s).</em></div>
            </div>
          </div>
          <div className="col">
            <div className="part-header">Part D: Dwelling</div>
            <div className="part-body">
              <div className="field-row" style={{ alignItems: 'flex-start' }}><label>Address:</label><div className="field-val">{data.dwellingAddress}</div></div>
            </div>
          </div>
        </div>

        {/* Part E */}
        <div className="part-single">
          <div className="part-header">Part E: Notice of Intention to End Occupation Contract</div>
          <div className="part-e-body">
            <p>Following the notice under section 220(3) of the Renting Homes (Wales) Act 2016 given on [<em>date of previous notice</em>] <span className="inline-val">{data.previousNoticeDate}</span>, the warning period has ended and the landlord is satisfied that you, the contract-holder(s), have abandoned the above dwelling.</p>
            <p>The landlord gives notice that the occupation contract of the above dwelling ends on [<em>date</em>]<br/>
              <span className="inline-val" style={{ width: '160pt' }}>{data.contractEndDate}</span>
            </p>
            <p>The landlord will recover possession of the above dwelling without court proceedings on [<em>date</em>]<br/>
              <span className="inline-val" style={{ width: '160pt' }}>{data.possessionDate}</span>
            </p>
            <p>Any personal property remaining in the dwelling after any abandonment will be dealt with in accordance with regulations made under section 221 of the Renting Homes (Wales) Act 2016.</p>
            <p className="italic-note"><em>Note: The specified dates must be at least four weeks from the day on which the previous notice is given to the contract-holder. This notice must not be given before the end of the warning period specified in the previous notice.</em></p>
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
