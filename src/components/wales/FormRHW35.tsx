"use client";

import React from 'react';

interface FormRHW35Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    conductParticulars?: string;
    proceedingsNotBefore?: string;
    proceedingsNotAfter?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW35({ data }: FormRHW35Props) {
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

        .field-cell {
          padding: 6px 6px;
          min-height: 90px;
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

        .inline-val {
          border-bottom: 1px dotted #000;
          padding: 1px 4px;
          min-width: 140px;
          display: inline-block;
        }

        .particulars-val {
          width: 100%;
          min-height: 80px;
          line-height: 1.5;
          margin-top: 4px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .note-italic {
          font-style: italic;
          font-size: 10.5pt;
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
        <div className="form-id">FORM RHW35</div>

        <div className="main-title">
          NOTICE OF INTENTION TO APPLY FOR AN ORDER IMPOSING A PROHIBITED CONDUCT STANDARD CONTRACT
        </div>

        <div className="intro">
          This form is for use by a landlord to give notice to a contract-holder under paragraph 1(1) of Schedule 7 to
          the Renting Homes (Wales) Act 2016 that the landlord intends to apply to the court (under section 116 of
          that Act) for an order imposing a periodic standard contract ("a prohibited conduct standard contract") due
          to prohibited conduct (as described by section 55 of that Act).
        </div>

        {/* Parts A and B */}
        <table className="layout">
          <tbody>
            <tr>
              <td>
                <div className="part-header">Part A: Landlord</div>
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
                <div className="part-header">Part B: Contract-Holder(s)</div>
                <div className="field-cell">
                  <div className="field-label">
                    Name(s):
                    <div className="line-val">{data.tenantName}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Part C: Dwelling */}
        <div className="full-box">
          <div className="part-header">Part C: Dwelling</div>
          <div className="body">
            <div className="field-label">
              Address:
              <div className="line-val">{data.dwellingAddress}</div>
            </div>
          </div>
        </div>

        {/* Part D: Notice of Intention */}
        <div className="full-box">
          <div className="part-header">Part D: Notice of Intention to Apply for an Order Imposing a Periodic Standard
            Contract ("Prohibited Conduct Standard Contract")</div>
          <div className="body">
            <p>The landlord gives notice that he or she intends to apply to the court for an order imposing a
              periodic standard contract ("a prohibited conduct standard contract") under section 116 of the
              Renting Homes (Wales) Act 2016, on the ground that you, the contract-holder, are in breach of
              section 55 of that Act (anti-social behaviour and other prohibited conduct).</p>
            <p>The particulars of the conduct in respect of which an order is sought are as follows:</p>
            <p className="note-italic">Clearly specify the particulars.</p>
            <div className="particulars-val">{data.conductParticulars}</div>
            <p>Proceedings may not be brought before [date] <span className="inline-val">{data.proceedingsNotBefore}</span></p>
            <p className="note-italic">Note: The specified date may be the date on which this notice is given to the
              contract-holder.</p>
            <p>Proceedings may not be brought after [date] <span className="inline-val">{data.proceedingsNotAfter}</span></p>
            <p className="note-italic">Note: The specified date must be the end of the period of six months starting
              with the day on which the notice is given to the contract-holder.</p>
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
