"use client";

import React from 'react';

interface FormRHW34Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    introductionDate?: string;
    extendedEndDate?: string;
    extensionReasons?: string;
    reviewRequestDate?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW34({ data }: FormRHW34Props) {
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

        .reasons-val {
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

        .footer-note {
          font-style: italic;
          font-size: 10pt;
          margin-top: 20px;
          line-height: 1.4;
          text-align: justify;
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
        <div className="form-id">FORM RHW34</div>

        <div className="main-title">
          NOTICE OF EXTENSION OF INTRODUCTORY PERIOD
        </div>

        <div className="intro">
          This form is for use by a landlord to give notice to a contract-holder under paragraph 3 of Schedule 4 to
          the Renting Homes (Wales) Act 2016 that the introductory period of an introductory standard contract is
          extended.
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

        {/* Part D: Notice of Extension */}
        <div className="full-box">
          <div className="part-header">Part D: Notice of Extension of Introductory Period</div>
          <div className="body">
            <p>The landlord has decided to extend the introductory period of the introductory standard contract of
              the above dwelling to the period of 18 months, starting on the introduction date.</p>
            <p>The introduction date is [date] <span className="inline-val">{data.introductionDate}</span> and the introductory period
              of 18 months ends on [date] <span className="inline-val">{data.extendedEndDate}</span></p>
            <p>The reasons for the decision to extend the introductory period are as follows:</p>
            <p className="note-italic">Clearly state the reasons.</p>
            <div className="reasons-val">{data.extensionReasons}</div>
          </div>
        </div>

        {/* Part E: Right to Request Review */}
        <div className="full-box">
          <div className="part-header">Part E: Right to Request Review</div>
          <div className="body">
            <p>You, the contract-holder(s), under paragraph 4 of Schedule 4 to the Renting Homes (Wales) Act 2016,
              may request that the landlord reviews the decision to extend the introductory period. A request for
              a review must be made to the landlord by [date] <span className="inline-val">{data.reviewRequestDate}</span></p>
            <p className="note-italic">Note: The specified date must be at least 14 days after the day on which the
              landlord gives the contract-holder(s) this notice.</p>
          </div>
        </div>

        {/* Part F: Signature */}
        <div className="full-box">
          <div className="part-header">Part F: Signature</div>
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

        <div className="footer-note">
          This notice must be given to the contract-holder at least eight weeks before the day on which the
          introductory period would otherwise have ended.
        </div>
      </div>
    </div>
  );
}
