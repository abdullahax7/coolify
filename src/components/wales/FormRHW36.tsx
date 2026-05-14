"use client";

import React from 'react';

interface FormRHW36Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    probationEndDate?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW36({ data }: FormRHW36Props) {
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
        <div className="form-id">FORM RHW36</div>

        <div className="main-title">
          NOTICE OF END OF PROBATION PERIOD: PROHIBITED CONDUCT STANDARD CONTRACT
        </div>

        <div className="intro">
          This form is for use by a landlord to give notice to a contract-holder under paragraph 3(2) of Schedule 7 to
          the Renting Homes (Wales) Act 2016 that the probation period of a prohibited conduct standard contract is to
          end.
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

        {/* Part D: Notice of End of Probation Period */}
        <div className="full-box">
          <div className="part-header">Part D: Notice of End of Probation Period</div>
          <div className="body">
            <p>The landlord gives notice that the probation period, in relation to the occupation contract of the
              above dwelling, will end on [date] <span className="inline-val">{data.probationEndDate}</span>, at which time the
              occupation contract will be replaced by a secure contract.</p>
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
