"use client";

import React from 'react';

interface FormRHW30Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    jointContractHolderName?: string;
    jointContractHolderAddress?: string;
    otherContractHolderNames?: string;
    dwellingAddress?: string;
    previousNoticeDate?: string;
    contractEndDate?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW30({ data }: FormRHW30Props) {
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

        .part-subheader-italic {
          font-style: italic;
          font-size: 11pt;
          text-align: center;
          padding: 2pt 6pt 3pt;
          border-bottom: 1px solid #000;
          background: #fff;
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
        <div className="form-id">FORM RHW30</div>
        <div className="form-title">
          NOTICE OF END OF RIGHTS AND OBLIGATIONS OF A JOINT CONTRACT-<br/>
          HOLDER DUE TO NON-OCCUPATION
        </div>
        <div className="form-subtitle">
          This form is for use by a landlord to give notice to a joint contract-holder under section 225(6) of the<br/>
          Renting Homes (Wales) Act 2016 that their rights and obligations under the occupation contract are at<br/>
          an end due to non-occupation of the dwelling. This notice must have been preceded by a notice under<br/>
          section 225(3) of the Renting Homes (Wales) Act 2016 (<strong>Form RHW29</strong>).
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
            <div className="part-header">Part B: Joint Contract-Holder</div>
            <div className="part-subheader-italic"><em>Who is to cease to be a party to the occupation contract</em>
            </div>
            <div className="part-body">
              <div className="field-row"><label>Name:</label><div className="field-val">{data.jointContractHolderName}</div></div>
              <div className="field-row" style={{ alignItems: 'flex-start', marginTop: '4pt' }}><label>Address (if known):</label><div className="field-val">{data.jointContractHolderAddress}</div></div>
            </div>
          </div>
        </div>

        {/* Parts C & D */}
        <div className="parts-row second-row">
          <div className="col">
            <div className="part-header">Part C: Other Joint Contract-Holder(s)</div>
            <div className="part-c-body">
              <div className="field-row" style={{ alignItems: 'flex-start' }}>
                <label>Name(s) <em>(if applicable)</em>:</label>
                <div className="field-val">{data.otherContractHolderNames}</div>
              </div>
              <div className="part-c-note"><em>The landlord must give a copy of this notice to each of the other joint
                  contract-holders.</em></div>
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
          <div className="part-header">Part E: Notice of End of Rights and Obligations of the Person Named at Part B</div>
          <div className="part-e-body">
            <p>Following the notice given on [<em>date of previous notice</em>] <span className="inline-val">{data.previousNoticeDate}</span>, the warning period has ended and the landlord is
              satisfied that the joint contract-holder named at Part B does not occupy and does not intend to
              occupy the above dwelling.</p>
            <p>The landlord gives notice that the rights and obligations of the joint contract-holder named at Part
              B under the occupation contract are to end. The joint contract-holder named at Part B will cease to
              be a party to the occupation contract on [<em>date</em>] <span className="inline-val">{data.contractEndDate}</span></p>
            <p className="italic-note"><em>Note: The specified date must be eight weeks from the day on which this
                notice is given to the joint contract-holder named at Part B. This notice must not be given
                before the end of the warning period specified in the previous notice.</em></p>
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
