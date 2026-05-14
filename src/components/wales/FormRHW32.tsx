"use client";

import React from 'react';

interface FormRHW32Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    jointContractHolderName?: string;
    dwellingAddress?: string;
    breachParticulars?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW32({ data }: FormRHW32Props) {
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

        .italic-instruction {
          font-style: italic;
        }

        .particulars-val {
          width: 100%;
          font-size: 11pt;
          padding: 4pt 0;
          line-height: 1.5;
          min-height: 60pt;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .part-e-body {
          padding: 6pt 8pt 12pt;
          font-size: 11pt;
        }

        .part-e-row1 {
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

        .sig-val {
          border-bottom: 1px dotted #000;
          min-height: 20px;
          flex: 1;
        }

        .prose-section {
          margin-bottom: 12pt;
        }

        .section-title-bold {
          font-weight: bold;
          font-size: 11pt;
          margin-bottom: 6pt;
        }

        .prose-section p {
          font-size: 11pt;
          line-height: 1.5;
          margin-bottom: 8pt;
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
            page-break-after: always;
          }

          .page:last-child {
            page-break-after: auto;
          }
        }
      `}</style>

      {/* PAGE 1 */}
      <div className="page">
        <div className="form-id">FORM RHW32</div>
        <div className="form-title">
          NOTICE OF LANDLORD'S INTENTION TO APPLY FOR AN ORDER ENDING A<br/>
          JOINT CONTRACT-HOLDER'S RIGHTS AND OBLIGATIONS DUE TO<br/>
          PROHIBITED CONDUCT
        </div>
        <div className="form-subtitle">
          This form is for use by a landlord to give notice to a joint contract-holder under section 230(2) of the<br/>
          Renting Homes (Wales) Act 2016 that the landlord believes that the joint contract-holder is in breach of<br/>
          section 55 of that Act and will apply to the court for an order ending that joint contract-holder's rights<br/>
          and obligations under the occupation contract.
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
            <div className="part-subheader-italic"><em>Who the landlord believes is in breach of section 55 of the
                Renting Homes (Wales) Act 2016</em></div>
            <div className="part-body">
              <div className="field-row"><label>Name:</label><div className="field-val">{data.jointContractHolderName}</div></div>
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
          <div className="part-header">Part D: Notice of Intention to Apply for an Order Ending the Joint
            Contract-Holder's Rights and Obligations Under the Occupation Contract</div>
          <div className="part-d-body">
            <p>The landlord believes that you, the joint contract-holder named at Part B, are in breach of section
              55 of the Renting Homes (Wales) Act 2016 (anti-social behaviour and other prohibited conduct).</p>
            <p>The particulars of the breach are as follows:</p>
            <p className="italic-instruction"><em>Clearly specify the particulars.</em></p>
            <div className="particulars-val">{data.breachParticulars}</div>
            <p>The landlord gives notice of their intention to apply to the court for an order ending your rights
              and obligations under the occupation contract.</p>
          </div>
        </div>

        {/* Part E: Signature */}
        <div className="part-single">
          <div className="part-header">Part E: Signature</div>
          <div className="part-e-body">
            <div className="part-e-row1">
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

      {/* PAGE 2 */}
      <div className="page">
        <div className="prose-section">
          <div className="section-title-bold">Guidance notes for landlords</div>
          <p>The landlord must also provide the other joint contract-holders with a notice under section 230(3) of the
            Renting Homes (Wales) Act 2016 (<strong>Form RHW33</strong>) stating that the landlord believes that the
            joint contract-holder is in breach of section 55 of that Act and that the landlord will apply to the
            court for an order ending that joint contract-holder's rights and obligations under the contract.</p>
        </div>

        <div className="prose-section">
          <div className="section-title-bold">Restrictions on proceedings following this notice</div>
          <p>The landlord may make an application to the court at any time before the end of the period of six months
            starting with the day on which the landlord gives this notice to the joint contract-holder named at Part
            B.</p>
        </div>

        <div className="prose-section">
          <div className="section-title-bold">Guidance notes for contract-holders</div>
          <p>This notice tells you that your landlord intends to begin proceedings to end your occupation of the
            dwelling identified at Part C. You should read it carefully and seek advice about your circumstances as
            quickly as possible.</p>
          <p>Court proceedings may begin immediately following the landlord providing you with this notice.</p>
          <p>If you are in any doubt or need advice about any aspect of this notice, you should first contact your
            landlord. Many problems can be resolved quickly by raising them when they first arise. If you are unable
            to reach an agreement with your landlord, you may wish to contact an advice agency (such as Citizens
            Advice Cymru or Shelter Cymru) or independent legal advisors. If you believe you are at risk of
            homelessness as a result of receiving this notice, you should contact your local authority for support.
          </p>
        </div>
      </div>
    </div>
  );
}
