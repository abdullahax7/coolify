"use client";

import React from 'react';

interface FormRHW38Props {
  data: {
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    noticeDate?: string;
    signatureDate?: string;
    signedBy?: string;
  };
}

export default function FormRHW38({ data }: FormRHW38Props) {
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

        .dash-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .dash-list li {
          padding-left: 14px;
          text-indent: -10px;
          margin-bottom: 4px;
        }

        .dash-list li::before {
          content: "- ";
        }

        .guidance-title {
          font-weight: bold;
          font-size: 12pt;
          margin: 0 0 10px 0;
        }

        .guidance-section h3 {
          font-weight: bold;
          font-size: 11pt;
          margin: 14px 0 6px 0;
        }

        .guidance-section h4 {
          font-style: italic;
          font-weight: normal;
          font-size: 11pt;
          margin: 10px 0 6px 0;
        }

        .guidance-section p {
          margin: 0 0 10px 0;
          line-height: 1.5;
          text-align: justify;
        }

        .guidance-section ol {
          margin: 0 0 10px 24px;
          padding: 0;
        }

        .guidance-section ol li {
          margin-bottom: 4px;
          line-height: 1.5;
        }

        .num-list {
          margin: 0 0 10px 0;
          padding: 0;
          list-style: none;
        }

        .num-list li {
          padding-left: 30px;
          text-indent: -30px;
          margin-bottom: 4px;
          line-height: 1.5;
        }

        .num-list li .num {
          display: inline-block;
          width: 26px;
          text-indent: 0;
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
        <div className="form-id">FORM RHW38</div>

        <div className="main-title">
          LANDLORD'S NOTICE OF TERMINATION: FIXED TERM STANDARD CONTRACT (CONVERTED CONTRACT)
        </div>

        <div className="intro">
          This form is for use by a landlord to give notice to a contract-holder of a fixed term standard contract
          (which is not within Schedule 9B to the Renting Homes (Wales) Act 2016 and immediately before the coming
          into force of that Act was a tenancy or licence for a fixed term) under paragraph 25B(2) of Schedule 12 to
          that Act, that he or she must give up possession of the dwelling on a specified date.
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

        {/* Part D: Notice to Give Up Possession */}
        <div className="full-box">
          <div className="part-header">Part D: Notice to Give Up Possession</div>
          <div className="body">
            <p>In accordance with paragraph 25B(2) of Schedule 12 to the Renting Homes (Wales) Act 2016, the
              landlord gives notice to you, the contract-holder(s), that you must give up possession of the
              dwelling above on [date] <span className="inline-val">{data.noticeDate}</span></p>
            <p>If you, the contract-holder(s), do not give up possession of the dwelling on the date specified
              above, the landlord may make a possession claim to the court.</p>
            <p>This notice must be given before or on the last day of the term for which the occupation contract was
              made.</p>
            <p className="note-italic">Note: The specified date may not be:</p>
            <ul className="dash-list note-italic">
              <li>Less than six months after the occupation date (including the occupation date of a substitute
                tenancy or licence),</li>
              <li>Before the last day of the term for which the converted contract was made, or</li>
              <li>Less than two months after the day on which this notice is given to the contract-holder(s).</li>
            </ul>
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

      {/* PAGE 2: Guidance Notes */}
      <div className="page guidance-section">
        <div className="guidance-title">Guidance notes for contract-holders</div>

        <p>This notice is the first step requiring you to give up possession of the dwelling identified at Part C. You
          should read it very carefully. If you do not give up possession by the date given in Part D, your landlord
          may apply to the court for an order requiring you to give up possession.</p>

        <p>If you are in any doubt or need advice about any aspect of this notice, you should first contact your
          landlord. Many problems can be resolved quickly by raising them when they first arise. If you are unable to
          reach an agreement with your landlord, you may wish to contact an advice agency (such as Citizens Advice
          Cymru or Shelter Cymru) or independent legal advisors. If you believe you are at risk of homelessness as a
          result of receiving this notice, you should contact your local authority for support.</p>

        <h3>Restrictions on giving this notice</h3>

        <h4>Breaches of statutory obligations</h4>

        <p>In accordance with section 186A of the Renting Homes (Wales) Act 2016, this notice may not be given at a time
          when there is a breach of any statutory obligations listed in Schedule 9A to that Act:</p>

        <ul className="num-list">
          <li><span className="num">1.</span>Failure to provide written statement;</li>
          <li><span className="num">2.</span>Six month restriction following failure to provide written statement within
            the period specified in section 31 (of that Act);</li>
          <li><span className="num">3.</span>Failure to provide information;</li>
          <li><span className="num">3A.</span>Failure to provide valid energy performance certificate;</li>
          <li><span className="num">4.</span>Breach of security and deposit requirements;</li>
          <li><span className="num">5.</span>Prohibited payments and holding deposits under the Renting Homes (Fees etc.)
            (Wales) Act 2019;</li>
          <li><span className="num">5A.</span>Failure to ensure that working smoke alarms and carbon monoxide alarms are
            installed;</li>
          <li><span className="num">5B.</span>Failure to supply electrical condition report etc.;</li>
          <li><span className="num">5C.</span>Failure to provide gas safety report to contract-holder.</li>
        </ul>

        <p>This notice may not be given unless the requirements of section 44 of the Housing (Wales) Act 2014 have been
          complied with.</p>

        <p>In accordance with section 75 of the Housing Act 2004, this notice may not be given in relation to an HMO
          which is unlicensed in accordance with that Act.</p>
      </div>
    </div>
  );
}
