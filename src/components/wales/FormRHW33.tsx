"use client";

import React from 'react';

interface FormRHW33Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    jointContractHolderName?: string;
    otherContractHolderNames?: string;
    dwellingAddress?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW33({ data }: FormRHW33Props) {
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
          font-weight: bold;
          font-size: 11pt;
          margin-bottom: 10px;
        }

        .main-title {
          text-align: center;
          font-weight: bold;
          font-size: 11pt;
          text-transform: uppercase;
          margin: 0 0 15px 0;
          line-height: 1.4;
        }

        .intro {
          font-style: italic;
          font-size: 10.5pt;
          margin-bottom: 15px;
          line-height: 1.4;
          text-align: justify;
        }

        table.layout {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-bottom: 0;
        }

        table.layout td {
          width: 50%;
          vertical-align: top;
          border: 1px solid #000;
          padding: 0;
        }

        .part-header {
          font-weight: bold;
          text-align: center;
          border-bottom: 1px solid #000;
          padding: 4px 6px;
          font-size: 11pt;
          background: #f8fafc;
        }

        .sub-header {
          font-style: italic;
          padding: 4px 6px;
          font-size: 10pt;
          border-bottom: 1px solid #000;
          min-height: 38px;
        }

        .field-cell {
          padding: 6px 6px;
          min-height: 80px;
        }

        .field-label {
          margin-bottom: 4px;
        }

        .field-label-block {
          margin-bottom: 18px;
        }

        .line-val {
          display: block;
          width: 100%;
          padding: 2px 0;
          min-height: 22px;
          line-height: 1.4;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .full-box {
          border: 1px solid #000;
          margin-top: -1px;
          padding: 0;
        }

        .full-box .part-header {
          border-bottom: 1px solid #000;
        }

        .full-box .body {
          padding: 8px 10px;
          line-height: 1.5;
          text-align: justify;
        }

        .full-box .body p {
          margin: 0 0 10px 0;
        }

        .full-box .body p:last-child {
          margin-bottom: 0;
        }

        .signature-row {
          display: flex;
          align-items: flex-end;
          margin: 10px 0 4px 0;
        }

        .signature-label {
          white-space: nowrap;
          padding-right: 8px;
        }

        .signature-val {
          flex: 1;
          border-bottom: 1px dotted #000;
          padding: 2px 0;
          min-height: 20px;
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
        <div className="form-id">FORM RHW33</div>

        <div className="main-title">
          NOTICE TO OTHER JOINT CONTRACT-HOLDERS OF LANDLORD'S INTENTION TO APPLY FOR AN ORDER ENDING A JOINT
          CONTRACT-HOLDER'S RIGHTS AND OBLIGATIONS DUE TO PROHIBITED CONDUCT
        </div>

        <div className="intro">
          This form is for use by a landlord to give notice to other joint contract-holders under section 230(3) of
          the Renting Homes (Wales) Act 2016 that the landlord believes that another joint contract-holder is in
          breach of section 55 of that Act and will apply to the court for an order ending that joint
          contract-holder's rights and obligations under the occupation contract.
        </div>

        {/* Parts A and B */}
        <table className="layout">
          <tbody>
            <tr>
              <td>
                <div className="part-header">Part A: Landlord</div>
                <div className="sub-header">&nbsp;</div>
                <div className="field-cell">
                  <div className="field-label-block">
                    Name:
                    <div className="line-val">{data.landlordName}</div>
                  </div>
                  <div className="field-label">
                    Address:
                    <div className="line-val">{data.landlordAddress}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="part-header">Part B: Joint Contract-Holder</div>
                <div className="sub-header">Who the landlord believes is in breach of section 55 of the Renting Homes
                  (Wales) Act 2016</div>
                <div className="field-cell">
                  <div className="field-label-block">
                    Name:
                    <div className="line-val">{data.jointContractHolderName}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Parts C and D */}
        <table className="layout">
          <tbody>
            <tr>
              <td>
                <div className="part-header">Part C: Other Joint Contract-Holder(s)</div>
                <div className="field-cell">
                  <div className="field-label">
                    Name(s):
                    <div className="line-val">{data.otherContractHolderNames}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="part-header">Part D: Dwelling</div>
                <div className="field-cell">
                  <div className="field-label">
                    Address:
                    <div className="line-val">{data.dwellingAddress}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Part D: Notice */}
        <div className="full-box">
          <div className="part-header">Part D: Notice of Intention to Apply for an Order Ending Another Joint
            Contract-Holder's Rights and Obligations Under the Occupation Contract</div>
          <div className="body">
            <p>The landlord believes that the joint contract-holder named at Part B is in breach of section 55 of
              the Renting Homes (Wales) Act 2016 (anti-social behaviour and other prohibited conduct).</p>
            <p>The landlord gives notice of their intention to apply to the court for an order ending the rights and
              obligations of the joint contract-holder named at Part B under the occupation contract.</p>
          </div>
        </div>

        {/* Part E: Signature */}
        <div className="full-box">
          <div className="part-header">Part E: Signature</div>
          <div className="body">
            <div className="signature-row">
              <span className="signature-label">Signed by, or on behalf of, the landlord:</span>
              <div className="signature-val">
                {data.signedBy?.startsWith('data:image') ? (
                  <img src={data.signedBy} alt="Signature" style={{ maxHeight: '40px', maxWidth: '100%' }} />
                ) : (
                  <span>{data.signedBy}</span>
                )}
              </div>
            </div>
            <div className="signature-row">
              <span className="signature-label">Date:</span>
              <div className="signature-val">{data.signatureDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
