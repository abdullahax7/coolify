"use client";

import React from 'react';

interface FormTenancyAgreementProps {
  data: {
    agreementDate?: string;
    landlordName?: string;
    landlordAddress?: string;
    tenantName?: string;
    dwellingAddress?: string;
    rentAmount?: string;
    rentPaymentDetails?: string;
    termDuration?: string;
    startDate?: string;
    permittedOccupiers?: string;
    sharedFacilities?: string;
    parkingDetails?: string;
    waterPayer?: string;
    gasPayer?: string;
    tvPayer?: string;
    broadbandPayer?: string;
    councilTaxPayer?: string;
    electricityPayer?: string;
    phonePayer?: string;
    otherPayer?: string;
    securityDeposit?: string;
    depositScheme?: string;
    tenantEmail?: string;
    rswRegistration?: string;
    rswLicence?: string;
    signatureDate?: string;
    signedBy?: string;
    [key: string]: any;
  };
}

export default function FormTenancyAgreement({ data }: FormTenancyAgreementProps) {
  const styles = {
    container: {
      background: '#525659',
      padding: '40px 0',
      fontFamily: 'Arial, Helvetica, sans-serif',
      color: '#000',
      lineHeight: '1.5',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    page: {
      width: '210mm',
      minHeight: '297mm',
      margin: '0 auto 40px auto',
      background: '#fff',
      padding: '0',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      boxSizing: 'border-box' as const,
      flexShrink: 0,
      visibility: 'visible' as any,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      position: 'relative' as const,
      minHeight: '80px',
      width: '100%',
    },
    headerLeft: {
      background: '#1f3864',
      color: '#fff',
      padding: '18px 25px 18px 35px',
      flex: 1,
      position: 'relative' as const,
      clipPath: 'polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%)',
    },
    headerLeftBar: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: '8px',
      background: '#c00000',
    },
    headerTitle: {
      fontSize: '18pt',
      fontWeight: 'bold',
      margin: '0 0 5px 0',
      color: '#fff',
      lineHeight: '1.2',
    },
    headerSub: {
      fontSize: '10pt',
      fontWeight: 'normal',
      margin: 0,
      color: '#fff',
    },
    headerRight: {
      background: '#fff',
      padding: '15px 30px 15px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minWidth: '250px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    logoIcon: {
      width: '35px',
      height: '35px',
    },
    logoText: {
      fontSize: '16pt',
      fontWeight: 'bold',
      color: '#1f3864',
      letterSpacing: '1px',
    },
    logoDivider: {
      color: '#c00000',
      margin: '0 4px',
    },
    content: {
      padding: '20px 40px',
      flex: 1,
      width: '100%',
      boxSizing: 'border-box' as const,
    },
    p: {
      marginBottom: '8px',
      textAlign: 'justify' as const,
      fontSize: '10pt',
      color: '#000',
      lineHeight: '1.4',
    },
    h2: {
      fontSize: '13pt',
      fontWeight: 'bold',
      margin: '15px 0 10px 0',
      color: '#1f3864',
      borderBottom: '2px solid #f0f0f0',
      paddingBottom: '5px',
    },
    h3: {
      fontSize: '11pt',
      fontWeight: 'bold',
      margin: '12px 0 8px 0',
      color: '#1f3864',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#fff',
      marginTop: 'auto',
      position: 'relative' as const,
      height: '40px',
      width: '100%',
    },
    footerPage: {
      background: '#1f3864',
      color: '#fff',
      padding: '10px 30px 10px 35px',
      fontWeight: 'bold',
      fontSize: '10pt',
      position: 'relative' as const,
      clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
      minWidth: '130px',
    },
    footerPageBar: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: '6px',
      background: '#c00000',
    },
    footerUrl: {
      background: '#c00000',
      color: '#fff',
      padding: '10px 25px',
      fontWeight: 'bold',
      fontSize: '10pt',
      position: 'relative' as const,
      marginLeft: '-10px',
      clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
      flex: 1,
      textAlign: 'center' as const,
      maxWidth: '280px',
    },
    footerVersion: {
      padding: '10px 30px',
      fontWeight: 'bold',
      fontSize: '10pt',
      color: '#1f3864',
    },
    fieldVal: {
      borderBottom: '1px solid #000',
      minWidth: '100px',
      display: 'inline-block',
      padding: '0 5px',
      color: '#1f3864',
      fontWeight: 'bold',
    },
    fieldValBlock: {
      borderBottom: '1px solid #000',
      width: '100%',
      minHeight: '1.5em',
      margin: '5px 0',
      padding: '2px 5px',
      color: '#1f3864',
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      margin: '10px 0',
    },
    td: {
      border: '1px solid #000',
      padding: '8px',
      fontSize: '10pt',
      verticalAlign: 'top',
      color: '#000',
    },
    th: {
      border: '1px solid #000',
      padding: '8px',
      fontSize: '10pt',
      verticalAlign: 'top',
      background: '#f0f0f0',
      fontWeight: 'bold',
      textAlign: 'left' as const,
    },
    indent: {
      marginLeft: '25px',
    },
    indent2: {
      marginLeft: '50px',
    },
    strike: {
      textDecoration: 'line-through',
    },
    italic: {
      fontStyle: 'italic',
    },
  };

  const PageHeader = () => (
    <div className="tf-header" style={styles.header}>
      <div style={styles.headerLeft}>
        <div style={styles.headerLeftBar} />
        <h1 style={styles.headerTitle}>Fixed Term Standard Contract</h1>
        <p style={styles.headerSub}>Provided under the Renting Homes (Wales) Act 2016</p>
      </div>
      <div style={styles.headerRight}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
              <polygon points="5,25 25,5 45,25 40,25 40,45 10,45 10,25" fill="none" stroke="#1f3864" strokeWidth="2.5" />
              <polygon points="35,15 35,8 42,8 42,22" fill="#c00000" />
            </svg>
          </div>
          <div style={styles.logoText}>PROPERTY<span style={styles.logoDivider}>|</span>TRADER</div>
        </div>
      </div>
    </div>
  );

  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <div className="tf-footer" style={styles.footer}>
      <div style={styles.footerPage}>
        <div style={styles.footerPageBar} />
        Page {pageNum}
      </div>
      <div style={styles.footerUrl}>propertytrader1.co.uk</div>
      <div style={styles.footerVersion}>Version 3.0FSOC</div>
    </div>
  );

  return (
    <div className="wales-form-container" style={styles.container}>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .wales-form-container {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .content {
            padding: 15px 30px !important;
          }
          .page {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            min-height: auto !important;
            padding: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}</style>
      {/* PAGE 1 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}><strong>This agreement is dated</strong> <span style={{ ...styles.fieldVal, minWidth: '200px' }}>{data.agreementDate || '[Date of Agreement]'}</span></p>
          <p style={styles.p}>(Insert this date only when all parties have signed the agreement and want it to start.)</p>
          <h2 style={styles.h2}>Explanatory Information</h2>
          <p style={styles.p}><strong>Your landlord is legally required to give you this information.</strong></p>
          <p style={styles.p}>This is your written statement of the occupation contract you have made under the Renting Homes (Wales) Act 2016 ("the RHWA"). The contract is between you, as the "contract-holder", and the "landlord".</p>
          <p style={styles.p}>Your landlord may give you a written statement, before the "occupation date" (the day on which you were entitled to move in) and, if it is not, it must be given to you within 14 days of the occupation date. This written statement must be provided free of charge. If you did not receive a copy of this written statement (including electronically if you have agreed to receive the written statement in an electronic form) within 14 days of the occupation date, for each day (starting with the occupation date) that the written statement has not been provided, the landlord may be liable to pay you compensation, equivalent to a day's rent, up to a maximum of two months' rent (unless the failure was intentional in which case you can apply to the court to increase this amount).</p>
          <p style={styles.p}>The written statement must contain the terms of your contract and the explanatory information that the landlord is required to give you. The terms set out your rights and responsibilities and those of the landlord (that is, the things that you and your landlord must do or are permitted to do under the occupation contract). You should read the terms to ensure you fully understand and are content with them and then sign where indicated to confirm that you are content. The written statement should be kept safe as you may need to refer to it in the future.</p>
          <p style={styles.p}>The terms of your contract consist of:</p>
          <p style={styles.p}><strong>key matters</strong> – that is, the address of the dwelling, the occupation date, the amount of rent (or other consideration) and the rental period (i.e. the period in respect of which the rent is payable (e.g. weekly or monthly)), the fact that this is a fixed term contract and if there are periods during which the contract holder is not entitled to occupy the dwelling as home, details of those periods.</p>
          <p style={styles.p}><strong>fundamental terms</strong> – these are provisions of the RHWA that are automatically included as terms of an occupation contract. Some cannot be changed and must reflect the wording in the RHWA. However, others can be left out or changed, but only if you and the landlord agree to do that and it benefits you as the contract-holder.</p>
          <p style={styles.p}><strong>supplementary terms</strong> – these are provisions, set out in regulations made by the Welsh Ministers, which are also automatically included as terms of an occupation contract. However, providing you and the landlord agree to it, these can be left out or changed, either to benefit you or the landlord. Supplementary terms cannot be omitted or modified in a way that would make those terms incompatible with a fundamental term.</p>
          <p style={styles.p}>Where a fundamental or supplementary term has been left out or changed, this must be identified in this written statement. In this statement this will be done by showing the deleted text struck through and any additional text in italics.</p>
          <p style={styles.p}>The terms of your contract may also include:</p>
          <p style={styles.p}><strong>additional terms</strong> – these are provisions agreed by you and the landlord, which can cover any other matter, provided they do not conflict with a key matter, a fundamental term or a supplementary term.</p>
          <p style={styles.p}>Under section 62 of the Consumer Rights Act 2015, an additional term, or any change to a supplementary term, which is unfair (within the meaning of that Act), is not binding on you.</p>
          <p style={styles.p}>An incorrect or incomplete written statement may mean the landlord is liable to pay you compensation.</p>
          <p style={styles.p}>Where any changes to this contract are agreed after the start of this contract, the landlord must provide you with a written copy of the new term or terms or a new written statement of this contract, within 14 days of the change being agreed.</p>
        </div>
        <PageFooter pageNum={1} />
      </div>

      {/* PAGE 2 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>Your contract is a fixed term standard contract, which means that it initially lasts for a specified period of time agreed between you and the landlord. It also means that you cannot be evicted without a court order, unless you abandon the dwelling. Before a court makes such an order your landlord must demonstrate that the correct procedures have been followed and at least one of the following is satisfied—</p>
          <p style={styles.p}>(a) you have broken one or more terms of the contract (which includes any arrears of rent, engaging in anti- social behaviour and other prohibited conduct, and failing to take proper care of the dwelling) and it is reasonable to evict you,</p>
          <p style={styles.p}>(b) you are seriously in arrears with your rent (e.g. if the rental period is a month, at least two months' rent is unpaid), or</p>
          <p style={styles.p}>(c) your landlord needs to move you, and one of the estate management grounds under section 160 (estate management grounds) of the RHWA applies, suitable alternative accommodation is available (or will be, available when the order takes effect), and it is reasonable to evict you.</p>
          <p style={styles.p}>If you remain in occupation of the dwelling after the end of the fixed term, you and the landlord are to be treated as having made a new periodic standard contract in relation to the dwelling.</p>
          <p style={styles.p}>You have important rights as to how you can use the dwelling, although some of these require the consent of your landlord. Someone who lives with you at the dwelling may have a right to succeed to this contract if you die.</p>
          <p style={styles.p}>You must not allow the dwelling to become overcrowded by permitting more people to live in it than the maximum number allowed. Part 10 of the Housing Act 1985 provides the basis for determining the maximum number of people permitted to live in the dwelling.</p>
          <p style={styles.p}>You can be held responsible for the behaviour of everyone who lives in and visits the dwelling. Anti-social behaviour and other prohibited conduct can include excessive noise, verbal abuse and physical assault. It may also include domestic abuse (including physical, emotional and sexual, psychological, emotional or financial abuse).</p>
          <p style={styles.p}>If you have a problem with your home, you should first contact your landlord. Many problems can be resolved quickly by raising them when they first arise. If you are unable to reach an agreement with your landlord, you may wish to contact an advice agency (such as Citizens Advice Cymru or Shelter Cymru) or independent legal advisors. Disputes regarding your contract may ultimately be settled through the county courts.</p>
          <p style={styles.p}>If you have any questions about this contract you may find the answer on the Welsh Government's website along with relevant information, such as information on the resolution of disputes. Alternatively, you may wish to contact an advice agency (such as Citizens Advice Cymru or Shelter Cymru) or independent legal advisors.</p>
        </div>
        <PageFooter pageNum={2} />
      </div>

      {/* PAGE 3 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <h2 style={styles.h2}>Section A – Key terms of the occupation contract</h2>
          <p style={styles.p}>This occupation contract is between us, the landlord</p>
          <p style={{ ...styles.p, fontWeight: 'bold' }}>{data.landlordName || 'Property Trader NTS Lettings and Sales'}</p>
          <p style={styles.p}>and you, the contract-holder (if there is more than one, they are jointly and separately liable)</p>
          <p style={{ ...styles.p, fontWeight: 'bold' }}>{data.tenantName}</p>
          <p style={styles.p}>We will let out the property at <span style={{ ...styles.fieldVal, minWidth: '300px' }}>{data.dwellingAddress}</span></p>
          <p style={styles.p}>to you as well as any furniture, fixtures and fittings and other items referred to in the Inventory and Schedule of Condition.</p>

          <h3 style={styles.h3}>Contract type</h3>
          <p style={styles.p}>The agreement is for a fixed term standard contract.</p>

          <h3 style={styles.h3}>Rent</h3>
          <p style={styles.p}>The rent is <span style={{ ...styles.fieldVal, minWidth: '150px' }}>{data.rentAmount}</span></p>
          <p style={styles.p}>Payment must be made in cleared funds to:</p>
          <div style={{ ...styles.fieldValBlock, whiteSpace: 'pre-wrap' }}>{data.rentPaymentDetails}</div>

          <h3 style={styles.h3}>Term</h3>
          <p style={styles.p}>The agreement is for an initial fixed term of <span style={styles.fieldVal}>{data.termDuration}</span> starting on <span style={styles.fieldVal}>{data.startDate}</span></p>

          <h3 style={styles.h3}>Permitted occupiers</h3>
          <p style={styles.p}>In addition to you, only the following permitted occupiers are allowed to live in the property</p>
          <div style={{ ...styles.fieldValBlock, whiteSpace: 'pre-wrap' }}>{data.permittedOccupiers || 'None'}</div>
          <p style={styles.p}>Nobody else is allowed to live in the property without our written permission.</p>

          <h3 style={styles.h3}>Shared facilities</h3>
          <p style={styles.p}>We let the property to you along with any contents listed in the Inventory and Schedule of Condition given to you. You are also entitled to use the following shared facilities while you let the property:</p>
          <div style={{ ...styles.fieldValBlock, whiteSpace: 'pre-wrap' }}>{data.sharedFacilities || 'None'}</div>
          <p style={{ ...styles.p, marginTop: '10px' }}>If you are allocated parking it is <span style={styles.fieldVal}>{data.parkingDetails || 'None'}</span></p>
        </div>
        <PageFooter pageNum={3} />
      </div>

      {/* PAGE 4 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <h3 style={styles.h3}>Utilities</h3>
          <p style={styles.p}>You and we agree:</p>
          <p style={styles.p}>Water charges: <span style={styles.fieldVal}>{data.waterPayer}</span> are responsible for paying.</p>
          <p style={styles.p}>Gas: <span style={styles.fieldVal}>{data.gasPayer}</span> are responsible for paying.</p>
          <p style={styles.p}>Television licence: <span style={styles.fieldVal}>{data.tvPayer}</span> are responsible for paying.</p>
          <p style={styles.p}>Broadband: <span style={styles.fieldVal}>{data.broadbandPayer}</span> are responsible for paying.</p>
          <p style={styles.p}>Council Tax (or similar charge which replaces it): <span style={styles.fieldVal}>{data.councilTaxPayer}</span> are responsible for paying.</p>
          <p style={styles.p}>Electricity: <span style={styles.fieldVal}>{data.electricityPayer}</span> are responsible for paying.</p>
          <p style={styles.p}>Telephone: <span style={styles.fieldVal}>{data.phonePayer}</span> are responsible for paying.</p>
          <p style={styles.p}>Other: <span style={styles.fieldVal}>{data.otherPayer}</span> are responsible for paying.</p>
          <p style={styles.p}>If you are responsible for paying a bill, this includes contacting the local billing authority or the service provider to ensure they know you are liable to pay it.</p>

          <h3 style={styles.h3}>Security deposit</h3>
          <p style={styles.p}>You must pay the deposit of <span style={styles.fieldVal}>{data.securityDeposit}</span> to us. It will be moved to a Government-approved deposit scheme within 30 days of the agreement.</p>
          <p style={styles.p}>Deposit Scheme: <span style={styles.fieldVal}>{data.depositScheme}</span></p>

          <h3 style={styles.h3}>Contact details</h3>
          <p style={styles.p}>If we need to contact you via email, we will do so at:</p>
          <table style={styles.table}>
            <thead>
              <tr><th style={styles.th}>Name</th><th style={styles.th}>Email address</th></tr>
            </thead>
            <tbody>
              <tr><td style={styles.td}>{data.tenantName}</td><td style={styles.td}>{data.tenantEmail}</td></tr>
            </tbody>
          </table>
          <p style={styles.p}>Note that by giving an email address here you are indicating that you are willing to have us serve notices and other documents relating to the occupation contract by email.</p>
          
          <p style={styles.p}>Rent Smart Wales registration number: <span style={styles.fieldVal}>{data.rswRegistration}</span></p>
          <p style={styles.p}>Rent Smart Wales licence number: <span style={styles.fieldVal}>{data.rswLicence}</span></p>
        </div>
        <PageFooter pageNum={4} />
      </div>

      {/* PAGE 5 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <h2 style={styles.h2}>Section B – Definitions and Interpretation</h2>
          <p style={styles.p}>"agent" means a company or person we have engaged to manage the property on our behalf, or anyone who later takes over our agent's rights and obligations.</p>
          <p style={styles.p}>"contents" means anything we provide as stated in the Inventory. This includes white goods, furniture, cutlery, utensils, implements, tools, equipment, and the fixtures and fittings.</p>
          <p style={styles.p}>"dealing" includes —</p>
          <p style={{ ...styles.p, ...styles.indent }}>creating a tenancy, or creating a licence which confers the right to occupy the property;</p>
          <p style={{ ...styles.p, ...styles.indent }}>transferring;</p>
          <p style={{ ...styles.p, ...styles.indent }}>mortgaging or otherwise charging the contract or the property.</p>
          <p style={styles.p}>"emergency" means</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) something which requires urgent work to prevent the property or other dwellings in the vicinity from being severely damaged, further damaged or destroyed, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) something which if not dealt with by the landlord immediately, would put at imminent risk the health and safety of you, any permitted occupier of the property or other persons in the vicinity of the property.</p>
          <p style={styles.p}>"fixtures and fittings" includes references to any fixtures, fittings, furnishings, and floor, ceiling and wall coverings.</p>
          <p style={styles.p}>"house in multiple occupation/HMO" means that the property is let to a group of three or more people where at least two of them are unrelated.</p>
          <p style={styles.p}>"Inventory" is a document prepared by us, our agent, or an inventory clerk, which will be given to you on or soon after the start of the contract, describing the contents we have provided. It may include a Schedule of Condition, written report, or photos or videos to record the contents, their condition and the property's condition. It may include meter readings.</p>
          <p style={styles.p}>"jointly and separately liable" means that if there are two or more contract-holders, you are each responsible for complying with the agreement's obligations together and individually. We are free to seek to enforce these obligations or claim damages of any amount against one or more of you.</p>
          <p style={styles.p}>"lack of care" means a failure to take proper care —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) of the property, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) if the property forms part only of a building, of the common parts that you are entitled to use under this contract.</p>
          <p style={styles.p}>"landlord" includes anyone entitled to possession of the property when the agreement ends, as well as their successors in title or assignees.</p>
          <p style={styles.p}>"permitted occupier" means a person who is neither a contract-holder nor any other party to the contract. They have no rights to the property but we have granted them permission to occupy it as a guest for a time during this contract.</p>
          <p style={styles.p}>"property" includes any part or parts of the building's boundaries, fences, garden and outbuildings that we own unless we have specifically excluded them from the agreement. If the property is part of a larger building, you have a right to use the common access ways and shared facilities to access and enjoy the property only.</p>
          <p style={styles.p}>"relevant cause" means fire, storm, flood or other inevitable accident.</p>
          <p style={styles.p}>"rental period" means the time between rent due dates. For example, if the contract is weekly and rent is due on a Wednesday, the rental period will be from Wednesday to Tuesday. If the contract is monthly and rent is due on the 10th of each month, the rental period will be from the 10th to the 9th of the following month.</p>
          <p style={styles.p}>"RHWA" means the Renting Homes (Wales) Act 2016.</p>
        </div>
        <PageFooter pageNum={5} />
      </div>

      {/* PAGE 6 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>"Schedule of Condition" is a summary of the condition of the property or contents and usually includes a description of any faults, damage or missing items.</p>
          <p style={styles.p}>"service installation" means an installation for the supply of water, gas or electricity, for sanitation, for space heating or for heating water.</p>
          <p style={styles.p}>"specified service installations" means an installation for the supply of water, gas or electricity or other fuel (if applicable) for sanitation, for space heating or for heating water.</p>
          <p style={styles.p}>"superior lease" sets out the promises we have made to our superior landlord. You are also bound by these promises if you have prior knowledge of them. The superior landlord is the person who owns the interest in the property or some larger building that the property sits within, giving them the right to possession of the property at the end of our lease.</p>
          <p style={styles.p}>"contract" or "occupation contract" means the right to occupy the property under the RHWA granted by this agreement and any extension or periodic contract that arises from it.</p>
          <p style={styles.p}>"us", "our" and "we" mean the landlord.</p>
          <p style={styles.p}>"working day" does not include Saturdays, Sundays and bank holidays. "you" and "your" mean the contractholder.</p>
          <p style={styles.p}>Any text which has been struck through does not form part of this agreement and the wording is included in this agreement solely to satisfy the requirements of the RHWA.</p>

          <h2 style={styles.h2}>Section C – Terms and conditions</h2>
          <p style={styles.p}>This section sets out the obligations that you and we have to one another during the term of the occupation contract. This consists of a range of Fundamental, Supplementary and Additional terms. Some Fundamental terms may have been changed. Where this has happened those parts of any fundamental or supplementary term that have been added are in italics. We let the property with the contents to you for the occupation on the terms in this agreement plus any addendum to it.</p>
          <p style={styles.p}>1.1 If there is more than one contract-holder, you are all jointly and separately liable for the obligations in the agreement.</p>
          <p style={styles.p}>1.2 You must make reasonable efforts to ensure that no-one in your household or any visitor to the property breaches the terms of the agreement.</p>
          <p style={styles.p}>1.3 If we have given you a copy of a superior lease setting out our promises to our superior landlord, you agree that you will also be bound by these promises, except for any payments we are responsible for making under the superior lease.</p>
          <p style={styles.p}>2.0 It is agreed that:</p>

          <h3 style={styles.h3}>Rent and other payments</h3>
          <p style={styles.p}>2.1 You will pay the rent on the days and in the way we have agreed.</p>
          <p style={styles.p}>2.2 You will pay the charges for Council Tax (or any similar charge that replaces it) and utilities and other relevant suppliers that you are responsible for under this agreement.</p>
          <p style={styles.p}>2.3 You will pay us all reasonable losses, fees, damage costs and expenses we incur:</p>
          <p style={{ ...styles.p, ...styles.indent }}>in recovering from you any rent and any other money that is in arrears;</p>
          <p style={{ ...styles.p, ...styles.indent }}>for the service of any notice regarding your breach of any of your obligations under the agreement whether or not the notice results in court proceedings;</p>
          <p style={{ ...styles.p, ...styles.indent }}>for the cost of any bank or other charges if any cheque you have written is dishonoured or if any standing order or any other payment method is withdrawn by your bank;</p>
          <p style={{ ...styles.p, ...styles.indent }}>as a result of any of your breaches of the agreement or in enforcing any provision of the agreement, including those about seeking possession of the property.</p>
        </div>
        <PageFooter pageNum={6} />
      </div>

      {/* PAGE 7 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>2.4 You will pay interest at 3% above the Bank of England base rate on any rent or other money due under the agreement that is more than 14 days in arrears from the due date to the payment date.</p>
          <p style={styles.p}>2.5 We will provide you with a receipt for rent or any other payment made within 14 days of being asked for it.</p>
          <p style={styles.p}>2.6 You are not obliged to pay the rent for any period where the property is unfit for human habitation as defined in s94 of the RHWA.</p>
          <p style={styles.p}>2.6 You may set off against the rent any compensation payment due from us to you under s87 of the RHWA.</p>

          <h3 style={styles.h3}>Use of the property</h3>
          <p style={styles.p}>2.7 You must occupy the property as your only or main home.</p>
          <p style={styles.p}>2.8 You must not carry on or permit any trade or business at the property without the landlord's consent.</p>
          <p style={styles.p}>2.9 You must take reasonable care of the property and any common parts.</p>
          <p style={styles.p}>2.10 You must take all reasonable steps not to block or cause a blockage to the drains and pipes, gutters and channels in or on the property.</p>
          <p style={styles.p}>2.11 You must take all reasonable precautions to prevent condensation and mould growth by keeping the property adequately ventilated and heated.</p>
          <p style={styles.p}>2.12 You must take all reasonable precautions to prevent frost damage to any pipes or other installations in the property.</p>
          <p style={styles.p}><span style={styles.strike}>You may permit persons who are not lodgers or sub-holders to live in the property as a home.</span></p>
          <p style={styles.p}>2.13 You must not allow persons to live in the property as lodgers without the landlord's consent.</p>
          <p style={styles.p}>2.14 You are not liable for fair wear and tear to the property or to fixtures and fittings within the property, but you must —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) take proper care of the property, its fixtures and fittings, and any items listed in the inventory,</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) not remove any fixtures and fittings or any items listed in the inventory from the property without the consent of the landlord,</p>
          <p style={{ ...styles.p, ...styles.indent }}>c) keep the property in a state of reasonable decorative order, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>d) not keep anything in the property that would be a health and safety risk to you, any permitted occupier , any persons visiting the property or any persons residing in the vicinity of the property.</p>
          <p style={styles.p}>2.15 You must notify us as soon as reasonably practicable of any fault, defect, damage or disrepair which you reasonably believe is our responsibility.</p>
          <p style={styles.p}>2.16 Where you reasonably believe that any fault, defect, damage or disrepair to the fixtures and fittings or items listed in the inventory is not our responsibility, you must, within a reasonable period of time, carry out repairs to such fixtures and fittings or other items listed in the inventory, or replace them. This includes in circumstances where the fault, defect, damage or disrepair has occurred wholly or mainly because of an act or omission amounting to a lack of care by you, any permitted occupier, or any person visiting the property.</p>
          <p style={styles.p}>2.17 In circumstances where you have not carried out any repairs that are your responsibility under this contract, we may enter the property at any reasonable time for the purpose of carrying out repairs to the fixtures and fittings or other items listed in the inventory, or replacing them but we must give you at least 24 hours' notice before entering the property.</p>
          <p style={styles.p}>2.18 You may only park in the space allocated to you in this agreement.</p>
          <p style={styles.p}>2.19 You must not use your allocated parking space for any purpose except storing a private motor car or motor bike without our written permission.</p>
        </div>
        <PageFooter pageNum={7} />
      </div>

      {/* PAGE 8 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>2.20 You may not deal with this contract, the property or any part of it except —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) in a way permitted by this agreement, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) in accordance with a family property order (see section 251 of the Act).</p>
          <p style={styles.p}>2.21 A joint contract-holder may not deal with his or her rights and obligations under the contract (or with the contract, the property or any part of it), except —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) in a way permitted by this agreement, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) in accordance with a family property order.</p>
          <p style={styles.p}>2.22 If you deal with the contract or property in a manner prohibited by paragraph 2.20 above, or a joint contract-holder deals with the contract or property in a manner prohibited by paragraph 2.21 above —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the transaction is not binding on the landlord, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) you or the joint contract-holder are in breach of this agreement (despite the transaction not being binding on the landlord).</p>
          <p style={styles.p}>2.23 You must not smoke tobacco or any other substance in the property without our written permission. To avoid doubt, nicotine staining is not considered to be fair wear and tear.</p>
          <p style={styles.p}>2.24 You must not bring any animals or birds into the property without our written permission. If we grant permission, we can withdraw it at any time if we have a good reason.</p>
          <p style={styles.p}>2.25 You must not damage any of the property's common parts.</p>
          <p style={styles.p}>2.26 You must not obstruct the fire escape or any of the property's common parts. We or our agent may remove any obstructions.</p>
          <p style={styles.p}>2.27 You must not allow children to play on the fire escapes or in any of the property's common parts.</p>
          <p style={styles.p}>2.28 You must not do anything that would lead the property to require licensing by a local authority if it is not already so licensed, or that would lead to the breach of a condition of such a licence or a statutory obligation associated with it.</p>

          <h3 style={styles.h3}>Your conduct</h3>
          <p style={styles.p}>2.29 You must not engage or threaten to engage in conduct capable of causing nuisance or annoyance to a person with a right (of whatever description) —</p>
          <p style={{ ...styles.p, ...styles.indent }}>• to live in the property, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>• to live in a dwelling or other accommodation in the locality of the property.</p>
          <p style={styles.p}>2.30 You must not engage or threaten to engage in conduct capable of causing nuisance or annoyance to a person engaged in lawful activity in the property or its locality</p>
          <p style={styles.p}>2.31 You must not engage or threaten to engage in conduct —</p>
          <p style={{ ...styles.p, ...styles.indent }}>• capable of causing nuisance or annoyance to —</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>o the landlord, or</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>o a person (whether or not employed by the landlord) acting in connection with the exercise of the landlord's housing management functions, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>• that is directly or indirectly related to or affects the landlord's housing management functions.</p>
          <p style={styles.p}>2.32 You may not use or threaten to use the property, including any common parts and any other part of a building comprising the property, for criminal purposes. 2.33 You must not, by any act or omission —</p>
          <p style={{ ...styles.p, ...styles.indent }}>allow, incite or encourage any person who is living in or visiting the property to act as mentioned in paragraphs 2.29 to 2.31 above, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>allow, incite or encourage any person to act as mentioned in paragraph 2.32 above.</p>
        </div>
        <PageFooter pageNum={8} />
      </div>

      {/* PAGE 9 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <h3 style={styles.h3}>Leaving the property empty</h3>
          <p style={styles.p}>2.34 You must lock all the doors and windows and switch on any burglar alarm whenever you leave the property unattended.</p>
          <p style={styles.p}>2.35 You must take reasonable steps to ensure the dwelling is secure.</p>
          <p style={styles.p}>2.36 You may change any lock on the external or internal doors of the dwelling provided that any such changes provide no less security than that previously in place.</p>
          <p style={styles.p}>2.37 If any change made under clause 2.34 results in a new key being needed to access the dwelling or any part of the dwelling, you must notify the landlord as soon as reasonably practicable of any change and make available to the landlord a working copy of the new key.</p>
          <p style={styles.p}>2.36 You must not change the locks without informing us and provide us with a working copy of a new key promptly. Any lock you change must be no less secure than the existing lock.</p>
          <p style={styles.p}>2.37 You must tell us if the property is going to be unoccupied for more than seven days in a row.</p>
          <p style={styles.p}>2.38 You must flush through any water systems after any period when you leave the property unoccupied by running all taps and showers.</p>
          <p style={styles.p}>2.39 If you become aware that the dwelling has been or will be unoccupied for 28 or more consecutive days, you must notify the landlord as soon as reasonably practicable.</p>
          <p style={styles.p}>2.39 You must not leave the property unoccupied for more than 28 days in any circumstances.</p>

          <h3 style={styles.h3}>Condition of the property</h3>
          <p style={styles.p}>2.40 You must replace any light bulbs, fluorescent tubes and batteries promptly and when necessary.</p>
          <p style={styles.p}>2.41 You must keep the exterior free from rubbish and recycling and place all rubbish and recycling containers in the allocated space for collection on the collection day. Rubbish and recycling containers should be returned to their normal storage places as soon as possible after the collection.</p>
          <p style={styles.p}>2.42 You must take proper care of any shared facilities, and clean them as appropriate after use.</p>
          <p style={styles.p}>2.43 You must keep the garden tidy and cut any grass regularly, but you do not have to improve the garden.</p>
          <p style={styles.p}>2.44 You must inspect any smoke or carbon-monoxide alarms in the property regularly, replacing any batteries if necessary.</p>
          <p style={styles.p}>2.45 You must tell us as soon as possible if a fault arises in the smoke or carbon-monoxide alarms.</p>
          <p style={styles.p}>2.46 You must not make any alteration or addition to the property; any of its sheds, garages or outbuildings; or the electric, gas or plumbing system or decorate or change the style or colour of the internal or external decoration, or erect or install any aerial, satellite dish or cable television without our written permission</p>
          <p style={styles.p}>2.47 Where you are responsible for paying that supplier, you may change any of the supplier to the property of that -</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) electricity, gas, or other fuel or water (including sewerage) services;</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) telephone, internet, cable television or satellite television services.</p>
          <p style={styles.p}>But you must inform the landlord as soon as reasonably practicable of any changes made to any supplier.</p>
          <p style={styles.p}>2.48 Unless the landlord consents in writing, you must not —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) leave the property, at the end of the contract, without a supplier of electricity, gas or other fuel (if applicable) or water (including sewerage) services, unless these utilities were not present at the dwelling on the occupation date;</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) install or remove, or arrange to have installed or removed, any specified service installations at the dwelling.</p>
        </div>
        <PageFooter pageNum={9} />
      </div>

      {/* PAGE 10 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <h3 style={styles.h3}>Joint Contract-Holders</h3>
          <p style={styles.p}>2.49 You, as the contract-holder under this contract, and another person may, with the consent of the landlord make that person a joint contract-holder under the contract.</p>
          <p style={styles.p}>2.50 If a person is made a joint contract-holder under this term, he or she becomes entitled to all the rights and subject to all the obligations of a contract-holder under this contract from the day on which he or she becomes a joint contract-holder.</p>
          <p style={styles.p}>2.51 If a joint contract-holder under this contract dies, or ceases to be a party to this contract for some other reason, from the time he or she ceases to be a party the remaining joint contract-holders are —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) fully entitled to all the rights under this contract, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) liable to perform fully every obligation owed to the landlord under this contract.</p>
          <p style={styles.p}>2.52 The joint contract-holder is not entitled to any right or liable to any obligation in respect of the period after he or she ceases to be a party to the contract.</p>
          <p style={styles.p}>2.53 Nothing in paragraphs 2.51 and 2.52 above removes any right or waives any liability of the joint contract- holder accruing before he or she ceases to be a party to the contract.</p>
          <p style={styles.p}>2.54 The provisions of paragraph 2.51 to 2.53 do not apply where a joint contract-holder ceases to be a party to this contract because his or her rights and obligations under the contract are transferred in accordance with the contract.</p>

          <h3 style={styles.h3}>Letters and notices</h3>
          <p style={styles.p}>2.55 You must forward any notice, order, proposal or legal proceedings affecting the property or its boundaries to us promptly on receiving them.</p>
          <p style={styles.p}>2.56 You must forward to us all correspondence addressed to the landlord at the property within a reasonable time.</p>

          <h3 style={styles.h3}>Access to the property</h3>
          <p style={styles.p}>2.57 We may enter the property at any reasonable hour of the day to inspect its condition and state of repair or to carry out any repair required by this agreement or any improvements we reasonably deem necessary. We must give you at least 24 hours written notice before exercising any right to enter the property.</p>
          <p style={styles.p}>2.58 If we need to enter the property in an emergency without notice then you must allow us access to do so. If you do not provide access when requested then we may enter the property without your consent but we must use our reasonable endeavours to give you notice that we have entered the property as soon as reasonably possible after entering.</p>
          <p style={styles.p}>2.59 You must allow possible new contract-holders, valuers and buyers access to the property (on at least 24 hours' written notice) during the contract.</p>

          <h3 style={styles.h3}>Key and alarm codes</h3>
          <p style={styles.p}>2.60 You must permit us and our agent to hold a set of keys or any other security devices necessary to enter the property in an emergency.</p>
          <p style={styles.p}>2.61 You must not change the alarm codes or door locks or have any duplicate keys cut without our written permission. If you lose your keys or other security devices needed to access the property, you are liable to meet our actual costs for replacement. This includes the cost of fitting any new locks that are needed.</p>

          <h3 style={styles.h3}>Occupier's liability</h3>
          <p style={styles.p}>2.62 You must verify the suitability of the property for you and members of your household including any gardens, fences, ponds or outbuildings, especially regarding the safety of pets and young children.</p>
          <p style={styles.p}>2.63 You must take reasonable steps to protect guests and other visitors (especially children) from any hazards at the property, for example ponds, swimming pools, fences and electric gates.</p>
        </div>
        <PageFooter pageNum={10} />
      </div>

      {/* PAGE 11 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>2.64 We must not interfere with your right to occupy the property whether by taking an action or by notcdoing something. However, we do not interfere with your rights by taking any reasonable action to exercise our rights under this contract or if we fail to comply with our repairing obligations as defined in s100(2) of the RHWA.</p>
          <p style={styles.p}>2.65 If any person acting on our behalf or who has an interest in the property, or part of it, that is superior to our own interferes with your rights by doing or not doing anything then it will be assumed that we have interfered with your rights.</p>
          <p style={styles.p}>2.66 We must pay all assessments and outgoings regarding the property that are our responsibility.</p>
          <p style={styles.p}>2.67 Ensure that any furniture and equipment we supply comply with the Furniture and Furnishings (Fire) (Safety) Regulations 1988 (as amended).</p>
          <p style={styles.p}>2.68 We must ensure that the property is fit for human habitation on the occupation date of the contract and for the term. If the property forms part of a larger building the obligation in this clause includes the structure and exterior of the building and the common parts.</p>
          <p style={styles.p}>2.69 We must —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) keep in repair the structure and exterior of the property (including drains, gutters and external pipes), and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) keep in repair and proper working order the service installations in the property.</p>
          <p style={styles.p}>2.70 If the property forms part of a larger building, we must —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) keep in repair the structure and exterior of any other part of the building (including drains, gutters and external pipes) in which we have an estate or interest, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) keep in repair and proper working order a service installation which directly or indirectly serves the property, and which either —</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>i) forms part of any part of the building in which we have an estate or interest, or</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>ii) is owned by us or is under the landlord's control.</p>
          <p style={styles.p}>2.71 The standard of repair required by us is that which is reasonable having regard to the age and character of the property, and the period during which the property is likely to be available for occupation as a home.</p>
          <p style={styles.p}>2.72 We must make good any damage caused by works and repairs carried out in order to comply with our repairing obligations set out in paragraphs 2.68 to 2.71 above.</p>
          <p style={styles.p}>2.73 We may not impose any obligation on you as a result of you enforcing or relying on our repairing obligations set out in paragraphs 2.68 to 2.71 above.</p>
          <p style={styles.p}>2.74 Our repairing obligations set out in paragraphs 2.68 above do not impose any liability on us in respect of a property which we cannot make fit for human habitation at reasonable expense.</p>
          <p style={styles.p}>2.75 Our repairing obligations set out in paragraphs 2.68 to 2.71 above do not require us—</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) to keep in repair anything which you are entitled to remove from the property, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) to rebuild or reinstate the property or any part of it, in the case of destruction or damage by a relevant cause.</p>
          <p style={styles.p}>2.76 If the property forms part only of a building, our repairing obligations set out in paragraphs 2.71 and 2.73 above do not require us to rebuild or reinstate any other part of the building in which we have an estate or interest, in the case of destruction or damage by a relevant cause.</p>
          <p style={styles.p}>2.77 Nothing in this contract requires us to carry out works or repairs unless the disrepair or failure to keep in proper working order affects your enjoyment of —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the property, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) the common parts that you are entitled to use under this contract.</p>
        </div>
        <PageFooter pageNum={11} />
      </div>

      {/* PAGE 12 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>2.78 Section 91(1) of the RHW does not imposes any liability on us if the property is unfit for human habitation wholly or mainly because of an act or omission (including an act or omission amounting to lack of care) by you or a permitted occupier of the property.</p>
          <p style={styles.p}>2.79 Nothing else in this contract imposes any liability or obligation on us if the property is unfit for human habitation wholly or mainly because of an act or omission (including an act or omission amounting to lack of care) by you or a permitted occupier of the property.</p>
          <p style={styles.p}>2.80 We are not obliged to carry out works or repairs if the disrepair, or the failure of a service installation to be in working order, is wholly or mainly attributable to lack of care by you or a permitted occupier of the property.</p>
          <p style={styles.p}>2.81 Our repairing obligations under this contract do not arise until we (or in the case of joint landlords, any one of us) becomes aware that works or repairs are necessary.</p>
          <p style={styles.p}>2.82 We have complied with our repairing obligations if we carry out the necessary works or repairs within a reasonable time after the day on which we become aware that they are necessary.</p>
          <p style={styles.p}>2.83 Where the property is part of a larger building then our repairing obligations under clauses 2.68 to 2.71 do not apply where those repairs require works in another part of the building which we do not have sufficient rights over to be able to carry out those works and are unable to obtain such rights after making a reasonable effort to do so.</p>
          <p style={styles.p}>2.84 If —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the landlord (the "old landlord") transfers the old landlord's interest in the property to another person (the "new landlord"), and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) the old landlord (or where two or more persons jointly constitute the old landlord, any one of them) is aware before the date of the transfer that works or repairs are necessary in order to comply a repairing obligation under this contract, the new landlord is to be treated as becoming aware of the need for those works or repairs on the date of the transfer, but not before.</p>
          <p style={styles.p}>2.85 A permitted occupier who suffers personal injury, or loss of or damage to personal property, as a result of the landlord failing to comply with a repairing obligation in this contract, may enforce the term in question in his or her own right by bringing proceedings in respect of the injury, loss or damage but a permitted occupier who is a lodger or sub-holder may do so only if the lodger is allowed to live in the property, or the sub-occupation contract is made, in accordance with this contract.</p>

          <h3 style={styles.h3}>3.0 At the end of the contract</h3>
          <p style={styles.p}>3.1 At the end of the contract you agree to:</p>
          <p style={{ ...styles.p, ...styles.indent }}>give up the property with full vacant possession;</p>
          <p style={{ ...styles.p, ...styles.indent }}>give up the property, the contents and our fixtures and fittings in as good a condition as at the start of the contract (apart from fair wear and tear) and free from rubbish;</p>
          <p style={{ ...styles.p, ...styles.indent }}>allow us or our agent to enter the property with a surveyor to perform an inspection;</p>
          <p style={{ ...styles.p, ...styles.indent }}>leave the contents in the same position they were in at the start of the contract;</p>
          <p style={{ ...styles.p, ...styles.indent }}>return to us all sets of keys and other security devices and pay the actual costs of having replacement locks or other security devices fitted if not;</p>
          <p style={{ ...styles.p, ...styles.indent }}>remove all personal belongings including food and other perishable items; and</p>
          <p style={{ ...styles.p, ...styles.indent }}>give us or our agent a forwarding address at the end of the contract for easy administration and communication between the parties, including easy return of the deposit.</p>
          <p style={styles.p}>3.2 You agree to allow us to erect a 'to let' or 'for sale' sign at the building during the contract's last two months.</p>
          <p style={styles.p}>3.3 At the end of the contract, you will be invited to a check-out inspection at a mutually agreed time to assess the property's condition compared to the original Inventory and Schedule of Condition. If you do not keep to this appointment, then you agree to pay us or our agent any costs incurred in arranging a second check-out appointment.</p>
        </div>
        <PageFooter pageNum={12} />
      </div>

      {/* PAGE 13 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>If you do not keep the second appointment, any assessment of the property's condition by us or our agent will be final and binding.</p>
          <p style={styles.p}>3.4 Termination of this agreement ends the contract but does not release you from any outstanding obligations or from any obligation that you breached before termination.</p>
          <p style={styles.p}>3.5 The landlord must repay, within a reasonable time at the end of this contract, to you any pre-paid rent or other consideration which relates to any period falling after the date on which this contract ends.</p>

          <h3 style={styles.h3}>4.0 Inventory & deposit</h3>
          <p style={styles.p}>4.1 The landlord must provide you with an inventory in relation to the dwelling no later than the date by which the landlord must provide you with the written statement of this contract.</p>
          <p style={styles.p}>4.2 The inventory must set out the dwelling's contents, including all fixtures and fittings and must describe their condition as at the occupation date.</p>
          <p style={styles.p}>4.3 If you disagree with the information within the inventory, you may provide comments to the landlord.</p>
          <p style={styles.p}>4.4 Where no comments are received by the landlord within 14 days, the inventory is deemed accurate.</p>
          <p style={styles.p}>4.5 Where comments are received by the landlord within 14 days, the landlord must either:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) amend the inventory in accordance with those comments and send the amended inventory to you, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) inform you that the comments are not agreed, and re-send the original inventory to you, with the comments attached to a copy of the inventory, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>c) amend the inventory in accordance with some of the comments and send the amended inventory to you, together with a record of the comments which have not been agreed.</p>
          <p style={styles.p}>4.6 We may not ask you for any form of security or deposit which is to be given in any form other than as money or a guarantee.</p>
          <p style={styles.p}>4.7 The deposit will be held by <span style={styles.fieldVal}>{data.landlordName || 'Property Trader NTS Lettings and Sales'}</span></p>
          <p style={styles.p}>4.8 Any deposit paid by you must be dealt with in accordance with the rules of an authorised deposit protection scheme.</p>
          <p style={styles.p}>__________________________________________________________________________________</p>
          <p style={styles.p}>4.9 We can transfer the deposit to another authorised deposit protection scheme or change the person who holds the deposit (unless it has been paid into an authorised custodial deposit protection scheme). If we do this, we will inform you in writing.</p>
          <p style={styles.p}>4.10 Within 30 days of receiving your deposit we must comply with the initial requirements of an authorised deposit protection scheme and give you and any other person who has paid the deposit on your behalf the information set out within the relevant regulations made by the Welsh Ministers in accordance with section 44 of the RHWA, setting out—</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the authorised deposit scheme which applies,</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) our compliance with the initial requirements of the scheme, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>c) the operation of Chapter 4 of Part 3 of the RHWA, including your rights (and the rights of any person who has paid the deposit on your behalf) in relation to the deposit.</p>
          <p style={styles.p}>You will only receive interest on the deposit if it is paid into a custodial deposit scheme. If that happens, you will receive any interest that may be due under the scheme's terms and conditions.</p>
        </div>
        <PageFooter pageNum={13} />
      </div>

      {/* PAGE 14 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>4.11 You will get back the deposit when this contract ends and you leave the property, as long as you have kept to all the conditions of the agreement. If you do not do so, we may take from your deposit:</p>
          <p style={{ ...styles.p, ...styles.indent }}>any rent or other money due or payable by you under the agreement of which you have been made aware and which remains unpaid after the contract ends;</p>
          <p style={{ ...styles.p, ...styles.indent }}>the reasonable costs of compensating us for, or for rectifying or remedying, any breach by you of your obligations under the agreement, including those on the cleaning of the property or its fixtures and fittings and the removal or storage of any goods that you leave behind when the contract ends;</p>
          <p style={{ ...styles.p, ...styles.indent }}>any unpaid bills or charges for electricity, gas, phone, water, communication services and Council Tax incurred at the property that you are responsible for under the agreement if we have incurred a loss because you have not paid;</p>
          <p style={{ ...styles.p, ...styles.indent }}>any damage or compensation for damage to the property or its fixtures and fittings or for missing items for which you may be liable, subject to an allowance for fair wear and tear, the age and condition of any such item at the start of the contract, and any insured risks and repairs that are our responsibility.</p>
          <p style={styles.p}>4.12 If the deposit is not enough, you must pay us the extra amount needed to cover all costs, charges and expenses incurred and properly due.</p>
          <p style={styles.p}>4.13 If you are all content to appoint a lead contract-holder to manage the deposit, then <span style={{ ...styles.fieldVal, minWidth: '300px' }}>{data.tenantName}</span> is chosen to deal with the deposit on your behalf (jointly and separately) and on behalf of anyone who is not a contract-holder who paid towards the deposit. As soon as is practicable after the contract, we will return any deposit (less any agreed deductions or money still in dispute) directly to the lead contract-holder to be allocated as they see fit.</p>
          <p style={styles.p}>If no lead contract-holder is agreed, then as soon as is practicable after the end of the contract, we will return the deposit minus any agreed deductions or money still in dispute. A share of the deposit will go to each contract- holder or person paying towards the deposit individually. This share will be based on the amount of the deposit each of them paid at the start of the contract, less a share of any agreed deductions or money still in dispute.</p>
          <p style={styles.p}>4.14 If someone who is not a contract-holder has paid towards the deposit, you must provide their name and address below. Otherwise, you confirm that the only people who have paid towards the deposit are contract-holders.</p>
          <table style={styles.table}>
            <thead>
              <tr><th style={styles.th}>Name</th><th style={styles.th}>Address</th></tr>
            </thead>
            <tbody>
              <tr><td style={styles.td}>&nbsp;</td><td style={styles.td}>&nbsp;</td></tr>
            </tbody>
          </table>

          <h3 style={styles.h3}>5.0 Ending the contract</h3>
          <p style={styles.p}>5.1 This contract may be ended only in accordance with —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the fundamental terms of this contract which incorporate fundamental provisions set out in Part 9 of the Act or other terms included in this contract in accordance with Part 9, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) any enactment such as an Act of Senedd Cymru or an Act of Parliament or regulations made by the Welsh Ministers.</p>
        </div>
        <PageFooter pageNum={14} />
      </div>

      {/* PAGE 15 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>5.2 Nothing in this paragraph affects —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) any right of the landlord or contract-holder to rescind the contract, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) the operation of the law of frustration.</p>
          <p style={styles.p}>5.3 If the landlord and you agree to end this contract, this contract ends —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) when you give up possession of the property in accordance with an agreement you make with the landlord, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) if you do not give up possession and a substitute occupation contract is made, immediately before the occupation date of the substitute occupation contract.</p>
          <p style={styles.p}>5.4 An occupation contract is a substitute contract if —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) it is made in respect of the same (or substantially the same) dwelling as the original contract, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) you were also the contract-holder under the original contract.</p>
          <p style={styles.p}>5.5 If the landlord commits a repudiatory breach of contract and you give up possession of the dwelling because of that breach, this contract ends when you give up possession of the dwelling.</p>
          <p style={styles.p}>5.6 If you are sole contract-holder, this contract ends —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) one month after your death, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) if earlier, when the landlord is given notice of your death by the authorised persons.</p>
          <p style={styles.p}>5.7 The authorised persons are —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) your personal representatives, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) the permitted occupiers of the dwelling aged 18 and over (if any) acting together.</p>
          <p style={styles.p}>The contract does not end if under section 74 (persons qualified to succeed) of the RHWA one or more persons are qualified to succeed you.</p>
          <p style={styles.p}>The contract does not end if, at your death, a family property order has effect which requires the contract to be transferred to another person.</p>
          <p style={styles.p}>5.10 If, after your death, the family property order ceases to have effect and there is no person qualified to succeed you, the contract ends —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) when the order ceases to have effect, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) if later, at the time the contract would end under paragraph 5.6 above.</p>

          <h3 style={styles.h3}>Possession claims</h3>
          <p style={styles.p}>5.11 The landlord may make a claim to the court for recovery of possession of the dwelling from you ("a possession claim") only in the circumstances set out in Chapters 3 to 5 and 7 of Part 9 of the RHWA.</p>

          <h3 style={styles.h3}>Possession notices</h3>
          <p style={styles.p}>5.12 This paragraph applies in relation to a possession notice which a landlord is required to give to a contract- holder under any of the following terms before making a possession claim:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) paragraph 5.14 (in relation to a breach of contract by you);</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) paragraph 5.20 (in relation to estate management grounds);</p>
          <p style={{ ...styles.p, ...styles.indent }}>c) paragraph 5.29 (in relation to serious rent arrears).</p>
          <p style={styles.p}>5.13 Any such notice must set out the ground on which the possession claim will be made and must also:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) state the landlord's intention to make a possession claim,</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) give particulars of the ground for seeking possession, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>c) state the date after which the landlord is able to make a possession claim.</p>
        </div>
        <PageFooter pageNum={15} />
      </div>

      {/* PAGE 16 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <h3 style={styles.h3}>Termination by the landlord: grounds for making a possession claim Breach of contract</h3>
          <p style={styles.p}>5.14 If you breach this contract, the landlord may on that ground make a possession claim.</p>
          <p style={styles.p}>5.15 Section 209 of the RHWA provides that the court may not make an order for possession on that ground unless it considers it reasonable to do so (and reasonableness is to be determined in accordance with Schedule 10 to the RHWA).</p>

          <h3 style={styles.h3}>Restrictions on making a possession claim in relation to a breach of contract</h3>
          <p style={styles.p}>5.16 Before making a possession claim on the ground in paragraph 5.14, the landlord must give you a possession notice specifying that ground.</p>
          <p style={styles.p}>5.17 The landlord may make a possession claim in reliance on a anti-social behaviour and other prohibited conduct on or after the day on which the landlord gives you a possession notice specifying a breach of that term.</p>
          <p style={styles.p}>5.18 The landlord may not make a possession claim in reliance on a breach of any other term of this contract before the end of the period of one month starting with the day on which the landlord gives you a possession notice specifying a breach of that term.</p>
          <p style={styles.p}>5.19 In either case, the landlord may not make a possession claim after the end of the period of six months starting with the day on which the landlord gives you the possession notice.</p>

          <h3 style={styles.h3}>Estate management grounds</h3>
          <p style={styles.p}>5.20 The landlord may make a possession claim on one or more of the estate management grounds.</p>
          <p style={styles.p}>5.21 The estate management grounds (which are set out in Part 1 of Schedule 8 to the RHWA) are included in the Annex to this contract.</p>
          <p style={styles.p}>5.22 Section 210 of the RHWA provides that the court may not make an order for possession on an estate management ground unless:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) it considers it reasonable to do so (and reasonableness is to be determined in accordance with Schedule 10 to the RHWA), and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) it is satisfied that suitable alternative accommodation (what is suitable is to be determined in accordance with Schedule 11 to the RHWA) is available to you (or will be available to you when the order takes effect).</p>
          <p style={styles.p}>5.23 If the court makes an order for possession on an estate management ground (and on no other ground), the landlord must pay to you a sum equal to the reasonable expenses likely to be incurred by you in moving from the dwelling unless the court makes an order for possession on Ground A or B (the redevelopment grounds) of the estate management grounds (and on no other ground).</p>

          <h3 style={styles.h3}>Restrictions on making a possession claim under the estate management grounds</h3>
          <p style={styles.p}>5.24 Before making a possession claim on an estate management ground, the landlord must give you a possession notice specifying that ground.</p>
          <p style={styles.p}>5.25 The landlord may not make the claim —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) before the end of the period of one month starting with the day on which the landlord gives you the possession notice, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) after the end of the period of six months starting with that day.</p>
          <p style={styles.p}>5.26 If a redevelopment scheme is approved under Part 2 of Schedule 8 to the RHWA subject to conditions, the landlord may give you a possession notice specifying estate management Ground B before the conditions are met.</p>
          <p style={styles.p}>5.27 The landlord may not give you a possession notice specifying estate management Ground G (accommodation not required by successor) —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) before the end of the period of six months starting with the day on which the landlord (or in the case of joint landlords, any one of them) became aware of the previous contract-holder's death, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) after the end of the period of twelve months starting with that day.</p>
        </div>
        <PageFooter pageNum={16} />
      </div>

      {/* PAGE 17 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>5.28 The landlord may not give you a possession notice specifying estate management Ground H (departing joint contract-holder) after the end of the period of six months starting with the day on which the joint contract- holder's rights and obligations under this contract ended.</p>

          <h3 style={styles.h3}>Serious rent arrears</h3>
          <p style={styles.p}>5.29 If you are seriously in arrears with your rent, the landlord may on that ground make a possession claim. You are seriously in arrears with your rent:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) where the rental period is a week, a fortnight or four weeks, if at least eight weeks' rent is unpaid;</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) where the rental period is a month, if at least two months' rent is unpaid;</p>
          <p style={{ ...styles.p, ...styles.indent }}>c) where the rental period is a quarter, if at least one quarter's rent is more than three months in arrears;</p>
          <p style={{ ...styles.p, ...styles.indent }}>d) where the rental period is a year, if at least 25% of the rent is more than three months in arrears.</p>
          <p style={styles.p}>5.30 Section 216 of the RHWA provides that the court must (subject to any available defence based on your Convention rights) make an order for possession of the dwelling if it is satisfied that you —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) were seriously in arrears with your rent on the day on which the landlord gave you the possession notice, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) are seriously in arrears with your rent on the day on which the court hears the possession claim.</p>

          <h3 style={styles.h3}>Restrictions on making a possession claim for serious rent arrears</h3>
          <p style={styles.p}>5.31 Before making a possession claim on the ground of serious rent arrears, the landlord must give you a possession notice specifying that ground.</p>
          <p style={styles.p}>5.32 The landlord may not make the claim:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) before the end of the period of 14 days starting with the day on which the landlord gives you the possession notice, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) after the end of the period of six months starting with that day.</p>

          <h3 style={styles.h3}>Effect of order for possession</h3>
          <p style={styles.p}>5.33 If the court makes an order requiring you to give up possession of the dwelling on a date specified in the order, this contract ends:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) if you give up possession of the dwelling on or before that date, on that date,</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) if you give up possession of the dwelling after that date but before the order for possession is executed, on the day on which you give up possession of the dwelling, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>c) if you do not give up possession of the dwelling before the order for possession is executed, when the order for possession is executed.</p>
          <p style={styles.p}>5.34 If:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) it is a condition of the court order that the landlord must offer a new contract in respect of the same dwelling to one or more joint contract-holders (but not all of them), and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) that joint contract-holder (or those joint contract-holders) continues to occupy the dwelling on and after the occupation date of the new contract;</p>
          <p style={styles.p}>then this contract ends immediately before the occupation date of the new contract.</p>

          <h3 style={styles.h3}>Ending the Contract Early</h3>
          <p style={styles.p}>5.35 You may end this contract at any time before the earlier of:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the landlord giving you a written statement of this contract, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) the date the contract first allows you to occupy the property.</p>
        </div>
        <PageFooter pageNum={17} />
      </div>

      {/* PAGE 18 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>5.36 To end this contract under paragraph 5.35 of this term, you must give a notice to the landlord stating that you are ending this contract.</p>
          <p style={styles.p}>5.37 On giving the notice to the landlord, you:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) cease to have any liability under this contract, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) become entitled to the return of any deposit, rent or other consideration given to the landlord in accordance with this contract.</p>
          <p style={styles.p}>5.38 If there are joint contract-holders under this contract, this contract cannot be ended by the act of one or more of the joint contract-holders acting without the other joint contract-holder or joint contract holders.</p>

          <h3 style={styles.h3}>6.0 Conditions specific to a house in multiple occupation (HMO)</h3>
          <p style={styles.p}>6.1 You, permitted occupiers, and any guests you bring to the property must not impede us, our contractors or our agent in performing the duties imposed on us by legislation or a licence condition (if one applies). To avoid doubt, this includes refusing us, our contractors or our agent access at reasonable times to perform management duties.</p>
          <p style={styles.p}>6.2 You must ensure that any rubbish and recyclable waste is stored and disposed of in the appropriate container as instructed by the local authority.</p>
          <p style={styles.p}>6.3 You must inform us if the containers that we or the local authority have provided for waste disposal are insufficient to store all the waste from the property.</p>
          <p style={styles.p}>6.4 You must give us any reasonable information that we, our agent or the local authority require to perform HMO management duties.</p>
          <p style={styles.p}>6.5 You must comply with any reasonable requests or instructions that we, our agent or the local authority make to you in performing HMO management duties.</p>

          <h3 style={styles.h3}>7.0 Variation</h3>
          <p style={styles.p}>7.1 This contract may not be varied except —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) by agreement between you and the landlord, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) by or as a result of an enactment such as an Act of Senedd Cymru or an Act of Parliament or regulations made by the Welsh Ministers.</p>
          <p style={styles.p}>7.2 The fundamental terms of this contract set out in paragraph 7.3 below, may not be varied (except by or as a result of an enactment such as an Act of Senedd Cymru or an Act of Parliament or regulations made by the Welsh Ministers).</p>
          <p style={styles.p}>7.3 The fundamental terms to which paragraph 7.2 applies are:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) requirement to use deposit scheme,</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) anti-social behaviour and other prohibited conduct,</p>
          <p style={{ ...styles.p, ...styles.indent }}>c) joint contract-holder ceasing to be a party to the occupation contract,</p>
          <p style={{ ...styles.p, ...styles.indent }}>d) permissible termination,</p>
          <p style={{ ...styles.p, ...styles.indent }}>e) death of sole contract-holder,</p>
          <p style={{ ...styles.p, ...styles.indent }}>f) possession claims,</p>
          <p style={{ ...styles.p, ...styles.indent }}>g) paragraph 7.1(b) and term 7.2,</p>
          <p style={{ ...styles.p, ...styles.indent }}>h) this term</p>
          <p style={{ ...styles.p, ...styles.indent }}>i) paragraph 9, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>j) Part 1 of Schedule 9A.</p>
        </div>
        <PageFooter pageNum={18} />
      </div>

      {/* PAGE 19 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>7.4 A variation of any other fundamental term (other than by or as a result of an enactment such as an Act of Senedd Cymru or an Act of Parliament or regulations made by the Welsh Ministers) is of no effect -</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) unless as a result of the variation —</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(i) the fundamental provision which the term incorporates is incorporated without modification, or</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(ii) the fundamental provision which the term incorporates is not incorporated or is incorporated with modification, the effect of this is that your position is improved;</p>
          <p style={styles.p}>7.5 A variation of a term of this contract is of no effect if it would render a term of this contract fundamental term incompatible with a fundamental term set out in paragraph 7.3.</p>
          <p style={styles.p}>7.6 Paragraph 7.5 of this term does not apply to a variation made by or as a result of an enactment.</p>

          <h3 style={styles.h3}>8.0 Written statements</h3>
          <p style={styles.p}>8.1 The landlord must give you a written statement of this contract before the end of the period of 14 days starting with the occupation date.</p>
          <p style={styles.p}>8.2 If there is a change in the identity of the contract-holder under this contract, the landlord must give the new contract-holder a written statement of this contract before the end of the period of 14 days starting with —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the day on which the identity of the contract-holder changes, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) if later, the day on which the landlord (or in the case of joint landlords, any one of them) becomes aware that the identity of the contract-holder has changed.</p>
          <p style={styles.p}>8.3 The landlord may not charge a fee for providing a written statement under paragraphs 8.1 or 8.2.</p>
          <p style={styles.p}>8.4 You may request a further written statement of this contract at any time but the landlord may charge a reasonable fee for providing a further written statement.</p>
          <p style={styles.p}>8.5 The landlord must give you the further written statement before the end of the period of 14 days starting with:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the day of the request, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) if the landlord charges a fee, the day on which you pay the fee.</p>

          <h3 style={styles.h3}>8.0 Written statement of variation</h3>
          <p style={styles.p}>8.6 If this contract is varied the landlord must, before the end of the relevant period, give you:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) a written statement of the term or terms varied, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) a written statement of this contract as varied.</p>
          <p style={styles.p}>8.7 The relevant period is the period of 14 days starting with the day on which this contract is varied.</p>
          <p style={styles.p}>8.8 The landlord may not charge a fee for providing a written statement for a variation of the contract.</p>

          <h3 style={styles.h3}>Provision of information by landlord about the landlord</h3>
          <p style={styles.p}>8.9 The landlord must, before the end of the period of 14 days starting with the occupation date, give you notice of an address to which you may send documents that are intended for the landlord.</p>
          <p style={styles.p}>8.10 If there is a change in the identity of the landlord, the new landlord must, before the end of the period of 14 days starting with the day on which the new landlord becomes the landlord, give you notice of the change in identity and of an address to which you may send documents that are intended for the new landlord.</p>
          <p style={styles.p}>8.11 If the address to which you may send documents that are intended for the landlord changes, the landlord must, before the end of the period of 14 days starting with the day on which the address changes, give you notice of the new address.</p>
        </div>
        <PageFooter pageNum={19} />
      </div>

      {/* PAGE 20 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <h3 style={styles.h3}>Compensation for failure to give information</h3>
          <p style={styles.p}>8.12 If the landlord fails to comply with an obligation under paragraph 8.9, the landlord is liable to pay you compensation under section 87 of the Act.</p>
          <p style={styles.p}>8.13 The compensation is payable in respect of the relevant date and every day after the relevant date until —</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) the day on which the landlord gives the notice in question, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) if earlier, the last day of the period of two months starting with the relevant date.</p>
          <p style={styles.p}>8.14 Interest on the compensation is payable if the landlord fails to give you the notice on or before the day referred to in paragraph 8.13(b).</p>
          <p style={styles.p}>8.15 The interest starts to run on the day referred to in paragraph 8.13(b) at the rate prevailing under section 6 of the Late Payment of Commercial Debts (Interest) Act 1998 at the end of that day.</p>
          <p style={styles.p}>8.16 The relevant date is the first day of the period before the end of which the landlord was required to give the notice.</p>

          <h3 style={styles.h3}>9.0 False statement inducing landlord to make contract to be treated as breach of conduct</h3>
          <p style={styles.p}>9.1 If the landlord is induced to make this contract by means of a false statement made knowingly or recklessly by you or by someone acting at your instigation:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) you are to be treated as being in breach of this contract, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) the landlord may accordingly make a possession claim on the basis of breach of contract.</p>

          <h3 style={styles.h3}>10.0 Forms of notices etc.</h3>
          <p style={styles.p}>10.1 Any notice, statement or other document required or authorised to be given or made by this occupation contract must be in writing.</p>
          <p style={styles.p}>10.2 Sections 236 and 237 of the RHWA make further provision about form of notices and other documents, and about how to deliver or otherwise give a document required or authorised to be given to a person by or because of that Act.</p>
          <p style={styles.p}>10.3 Any notice required by this agreement or the RHWA to be served on the contract-holder will be sufficiently served if it is sent by first-class post or delivered by hand to the property addressed to the contract-holder and will be deemed served the next working day after posting or leaving at the property.</p>

          <h3 style={styles.h3}>11.0 Passing notices etc. to the landlord</h3>
          <p style={styles.p}>11.1 You must:</p>
          <p style={{ ...styles.p, ...styles.indent }}>a) keep safe any notices, orders or other documents delivered to the dwelling addressed to the landlord specifically or the owner generally, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>b) as soon as is reasonably practicable, give the landlord the original copies of any such notices, orders or other documents to the landlord.</p>

          <h3 style={styles.h3}>12.0 Periodic Contract</h3>
          <p style={styles.p}>12.1 At the end of the fixed term set out in this contract if you continue to occupy the property the contract will become a periodic standard contract on the same terms and conditions as set out in this agreement save for the term which will progress from rental period to rental period and the rent which may be increased in line with section 123 of the RHWA. The following paragraphs will also apply but only during a periodic contract.</p>
          <p style={styles.p}>12.2 If you are a joint contract holder, you may withdraw from this contract by giving us a notice (a "withdrawal notice"). That notice must specify the date on which you intend to cease to be a party to this contract (the "withdrawal date").</p>
          <p style={styles.p}>12.3 You must give a written warning to the other joint contract holders when you give a withdrawal notice to the landlord; and a copy of the withdrawal notice must be attached to the warning.</p>
        </div>
        <PageFooter pageNum={20} />
      </div>

      {/* PAGE 21 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>12.4 We must give a written warning to the other joint contract-holders as soon as reasonably practicable after we receive the withdrawal notice; and a copy of the withdrawal notice must be attached to the warning.</p>
          <p style={styles.p}>12.5 You will cease to be a party to this contract on the withdrawal date.</p>
          <p style={styles.p}>12.6 A notice given to us by one or more (but not all) of the joint contract-holders that purports to be a notice under clause 12.2 is to be treated as a withdrawal notice, and the date specified in the notice is to be treated as the withdrawal date. Clause 12.3 does not apply to a notice which is treated as a withdrawal notice.</p>
          <p style={styles.p}>12.7 The minimum time period between the date on which a notice under clause 12.2 is given to us, and the date specified in the notice, is <span style={styles.strike}>one</span>two months.</p>
          <p style={styles.p}>12.8 All the contract holders acting jointly may end this contract by giving us not less than four week's notice that you will give up possession of the property on a date specified in the notice.</p>
          <p style={styles.p}>12.9 If you give up possession of the dwelling on or before the date specified in a notice under clause 12.8, this contract ends on the date specified in the notice. If you give up possession of the dwelling after that date but in connection with the notice, this contract ends on the day on which you give up possession of the dwelling, or if an order for possession is made, on the date determined in accordance with clause 5.33.</p>
          <p style={styles.p}>12.10 A notice under clause 12.8 ceases to have effect if, before this contract ends you withdraw the notice by further notice to us, and we do not object to the withdrawal in writing before the end of a reasonable period.</p>
          <p style={styles.p}>12.11 We may end this contract by giving you not less than six months' notice that you must give up possession of the property on a date specified in the notice.</p>
          <p style={styles.p}>12.12 If we have given you notice under clause 12.11 and then withdrawn that notice then we may not give a further such notice to you before the end of the period of six months starting with the day on which the first notice was withdrawn, save that we may give one further notice under clause 12.11 to you during the period of 28 days starting with the day on which the first notice was given.</p>
          <p style={styles.p}>12.13 If we have given you notice under clause 12.11 and the period for making a possession claim on the basis of that notice has ended without us having made such a claim then we may not give another notice under clause 12.11 to you before the end of the period of six months starting with the last day of the period before the end of which we could have made the claim.</p>
          <p style={styles.p}>12.14 If we give you a notice under clause 12.11, we may on that ground make a possession claim. Section 215 of the RHWA provides that if the court is satisfied that the ground is made out, it must make an order for possession of the dwelling, unless section 217 of the Act (retaliatory possession claims to avoid obligations to repair etc.) applies and subject to any available defence based on your Convention rights.</p>
          <p style={styles.p}>12.15 We may not make a possession claim on the basis of clause 12.14 before the date specified in the notice given by us in clause 12.11 or after the end of the period of two months starting with the date specified in a notice under clause 12.11.</p>
          <p style={styles.p}>12.16 If you give up possession of the property on or before the date specified in a notice under clause 12.11, this contract ends on the date specified in the notice. If you give up possession of the dwelling after that date but in connection with the notice, this contract ends on the day on which you give up possession of the dwelling, or, if an order for possession is made, on the date determined in accordance with clause 5.33.</p>
          <p style={styles.p}>12.17 A notice under clause 12.11 ceases to have effect if before the contract ends, and during the period of 28 days starting with the day on which the notice was given, we withdraw the notice by giving further notice to you, or before this contract ends, and after the end of the period of 28 days starting with day on which the notice was given we withdraw the notice by giving further notice to you, and you do not object to the withdrawal in writing before the end of a reasonable period.</p>
        </div>
        <PageFooter pageNum={21} />
      </div>

      {/* PAGE 22 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>12.18 We may not give notice under clause 12.11 before the end of the period of six months starting with the occupation date of this contract. However, if this contract is a substitute occupation contract, the landlord may not give notice under clause 12.11 before the end of the period of six months starting with the occupation date of the original contract.</p>
          <p style={styles.p}>12.19 For the purposes of clause 12.17</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) an occupation contract is a substitute occupation contract if</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(i) the occupation date of this contract falls immediately after the end of a preceding occupation contract,</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(ii) immediately before the occupation date of this contract you were a contract-holder under the preceding contract and we were a landlord under the preceding contract, and</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(iii) this contract relates to the same (or substantially the same) dwelling as the preceding contract, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) "original contract" means —</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(i) where the substitute occupation contract has an occupation date falling immediately after the end of a contract which is not a substitute occupation contract, the occupation contract which precedes the substitute occupation contract;</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(ii) where there have been successive substitute occupation contracts, the occupation contract which preceded the first of the substitute occupation contracts.</p>
          <p style={styles.p}>12.20 If we have previously made a claim for possession under clause 12.14 and the court has refused to make an order for possession because it considered the claim to be a retaliatory claim (see section 217 of the RHWA) then we may not give another notice under clause 12.11 to you before the end of the period of six months starting with the day on which the court refused to make an order for possession.</p>
          <p style={styles.p}>12.21 We may not give notice under clause 12.11 at a time when —</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) you have not been given a written statement of the contract under clause 8, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) the landlord is aware that the identity of the contract-holder has changed, and the new contractholder has not been given a written statement of the contract under clause 8.</p>
          <p style={styles.p}>12.22 If we have failed to comply with clause 8 then we may not give notice under clause 12.11 during the period of six months starting with the day on which we gave a written statement of this contract to you.</p>
          <p style={styles.p}>12.23 We may not give notice under clause 12.11 at a time when we has not provided a notice in accordance with the landlord's duty to provide information under clause 8.9.</p>
          <p style={styles.p}>12.24 We may not give notice under clause 12.11 at a time when we have not complied with regulation 6(5) of the Energy Performance of Buildings (England and Wales) Regulations 2012. For the purposes of this term, it does not matter when the valid energy performance certificate was given (and nothing in this paragraph requires that a new energy performance certificate be given to you when a certificate given to you in compliance with that regulation ceases to be valid under the EPB Regulations).</p>
          <p style={styles.p}>12.25 We may not give notice under clause 12.11 at a time when security required by us in connection with the contract in a form not permitted by clause 4.6 has not been returned to the person by whom it was given.</p>
          <p style={styles.p}>12.26 We may not give notice under clause 12.11 if:</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) a deposit has been paid in connection with this contract but the initial requirements of an authorised deposit scheme have not been complied with;</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) a deposit has been paid in connection with this contract but we have not provided the information required by clause 4.10; or</p>
          <p style={{ ...styles.p, ...styles.indent }}>(c) a deposit paid in connection with this contract is not being held in accordance with an authorised deposit scheme.</p>
        </div>
        <PageFooter pageNum={22} />
      </div>

      {/* PAGE 23 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>Unless —</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) a deposit paid in connection with this contract has been returned to you (or any person who paid the deposit on your behalf) either in full or with such deduction as may have been agreed, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) an application to the county court has been made under paragraph 2 of Schedule 5 to the RHWA and has been determined by the county court, withdrawn, or settled by agreement between the parties.</p>
          <p style={styles.p}>12.27 We may not give a notice under clause 12.11 at a time when —</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) a prohibited payment (within the meaning of the Renting Homes (Fees etc.) (Wales) Act 2019) has been made in relation to this contract as described in section 2 or 3 of that Act, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) that prohibited payment has not been repaid.</p>
          <p style={styles.p}>12.28 We may not give a notice at a time when —</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) a holding deposit (within the meaning of the Renting Homes (Fees etc.) (Wales) Act 2019) paid in relation to this contract has not been repaid, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) the circumstances are such that the failure to repay the deposit amounts to a breach of the requirements of Schedule 2 to that Act.</p>
          <p style={styles.p}>12.29 In determining for the purposes of clauses 12.27 and 12.28 whether a prohibited payment or a holding deposit has been repaid, the payment or deposit is to be treated as having been repaid to the extent (if any) that it has been applied towards either or both of the following —</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) a payment of rent under this contract;</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) a payment required as security in respect of this contract.</p>
          <p style={styles.p}>12.30 We may not give notice under clause 12.11 at a time when —</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) the property is treated as unfit for human habitation by virtue of regulation 5(3) of the Renting Homes (Fitness for Human Habitation) (Wales) Regulations 2022 (failure to ensure that working smoke alarms and, in certain circumstances, carbon monoxide alarms are installed in a dwelling) and as a result, we are required under Part 4 of the Act to take steps to stop the property from being treated as unfit for human habitation by virtue of that regulation;</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) the property is treated as unfit for human habitation by virtue of regulation 6(6) of the Renting Homes (Fitness for Human Habitation) (Wales) Regulations 2022 (failure to obtain an electrical condition report, or to give the contract-holder such a report or written confirmation of certain other electrical work) and as a result, we are required under Part 4 of the Act to take steps to stop the property from being treated as unfit for human habitation by virtue of that regulation.</p>
          <p style={styles.p}>12.31 We may not give notice under clause 12.11 at a time when we have not complied with regulation 36(6) or (as the case may be) (7) of the Gas Safety (Installation and Use) Regulations 1998. For the purposes of this clause we are to be treated as in compliance with the provision in question at any time when—</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) we have ensured that you have been given, or (as the case may be) there is displayed in a prominent position in the property, a copy of the applicable gas safety record, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) that record is valid.</p>
          <p style={styles.p}>12.32 For the purposes of clause 12.31, a gas safety record is valid until the end of the period within which the appliance or flue to which the record relates is required, under the Gas Safety Regulations, to again be subjected to a check for safety.</p>
        </div>
        <PageFooter pageNum={23} />
      </div>

      {/* PAGE 24 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>12.33 We may vary the rent payable under this contract by giving you a notice setting out a new rent to take effect on the date specified in the notice. The period between the day on which the notice is given to you and the specified date may not be less than two months. The first notice to increase the rent may specify any date but any subsequent notices must specify a date which is not less than one year after the last date on which a new rent took effect.</p>
          <p style={styles.p}>12.34 Where consideration other than rent is payable under this contract, the amount of consideration may be varied —</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) by agreement between us and you, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) by us in accordance with clause 12.35.</p>
          <p style={styles.p}>12.35 We may give you a notice setting out a new amount of consideration to take effect on the date specified in the notice. The period between the day on which the notice is given to you and the specified date may not be less than two months. The first such notice may specify any date but subsequent notices must specify a date which is not less than one year after the last date on which a new amount of consideration took effect.</p>

          <h3 style={styles.h3}>Signed as an agreement</h3>
          <p style={{ ...styles.p, marginTop: '20px' }}><strong>Between us, the landlord</strong></p>
          <table style={{ ...styles.table, marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={styles.th}>Signature</th>
                <th style={styles.th}>Name of signatory</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...styles.td, height: '65px', verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.signedBy?.startsWith('data:image') ? (
                    <img src={data.signedBy} alt="Landlord Signature" style={{ maxHeight: '60px', maxWidth: '100%', display: 'block', margin: '0 auto' }} />
                  ) : (
                    <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '9pt' }}>{data.signedBy || '____________________'}</div>
                  )}
                </td>
                <td style={styles.td}>{data.landlordName}</td>
                <td style={styles.td}>{data.signatureDate}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ ...styles.p, marginTop: '20px' }}><strong>And you, the contract-holder</strong></p>
          <table style={{ ...styles.table, marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Signature</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>{data.tenantName}</td>
                <td style={{ ...styles.td, height: '65px', verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.tenantSignature?.startsWith('data:image') ? (
                    <img src={data.tenantSignature} alt="Tenant Signature" style={{ maxHeight: '60px', maxWidth: '100%', display: 'block', margin: '0 auto' }} />
                  ) : (
                    <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '9pt' }}>{data.tenantSignature || '____________________'}</div>
                  )}
                </td>
                <td style={styles.td}>{data.signatureDate}</td>
              </tr>
              <tr>
                <td style={styles.td}>&nbsp;</td>
                <td style={{ ...styles.td, height: '50px' }}>&nbsp;</td>
                <td style={styles.td}>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PageFooter pageNum={24} />
      </div>

      {/* PAGE 25 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <h2 style={{ ...styles.h2, textAlign: 'center' }}>ANNEX</h2>
          <h2 style={{ ...styles.h2, textAlign: 'center' }}>ESTATE MANAGEMENT GROUNDS</h2>
          <h3 style={styles.h3}>REDEVELOPMENT GROUNDS</h3>
          <p style={styles.p}><strong>Ground A (building works)</strong></p>
          <p style={styles.p}>1 The landlord intends, within a reasonable time of obtaining possession of the dwelling—</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) to demolish or reconstruct the building or part of the building comprising the dwelling, or</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) to carry out work on that building or on land treated as part of the dwelling, and cannot reasonably do so without obtaining possession of the dwelling.</p>

          <p style={styles.p}><strong>Ground B (redevelopment schemes)</strong></p>
          <p style={styles.p}>2 (1) This ground arises if the dwelling satisfies the first condition or the second condition.</p>
          <p style={{ ...styles.p, ...styles.indent }}>(2) The first condition is that the dwelling is in an area which is the subject of a redevelopment scheme approved in accordance with Part 2 of this Schedule, and the landlord intends within a reasonable time of obtaining possession to dispose of the dwelling in accordance with the scheme.</p>
          <p style={{ ...styles.p, ...styles.indent }}>(3) The second condition is that part of the dwelling is in such an area and the landlord intends within a reasonable time of obtaining possession to dispose of that part in accordance with the scheme, and for that purpose reasonably requires possession of the dwelling.</p>

          <h3 style={styles.h3}>SPECIAL ACCOMMODATION GROUNDS</h3>
          <p style={styles.p}><strong>Ground C (charities)</strong></p>
          <p style={styles.p}>3 (1) The landlord is a charity and the contract-holder's continued occupation of the dwelling would conflict with the objects of the charity.</p>
          <p style={{ ...styles.p, ...styles.indent }}>(2) But this ground is not available to the landlord ("L") unless, at the time the contract was made and at all times after that, the person in the position of landlord (whether L or another person) has been a charity.</p>
          <p style={{ ...styles.p, ...styles.indent }}>(3) In this paragraph "charity" has the same meaning as in the Charities Act 2011 (c. 25) (see section 1 of that Act).</p>

          <p style={styles.p}><strong>Ground D (dwelling suitable for disabled people)</strong></p>
          <p style={styles.p}>4 The dwelling has features which are substantially different from those of ordinary dwellings and which are designed to make it suitable for occupation by a physically disabled person who requires accommodation of a kind provided by the dwelling and—</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) there is no longer such a person living in the dwelling, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) the landlord requires the dwelling for occupation by such a person (whether alone or with members of that person's family).</p>

          <p style={styles.p}><strong>Ground E (housing associations and housing trusts: people difficult to house)</strong></p>
          <p style={styles.p}>5 (1) The landlord is a housing association or housing trust which makes dwellings available only for occupation (whether alone or with others) by people who are difficult to house, and—</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) either there is no longer such a person living in the dwelling or a local housing authority has offered the contract-holder a right to occupy another dwelling under a secure contract, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) the landlord requires the dwelling for occupation by such a person (whether alone or with members of that person's family).</p>
        </div>
        <PageFooter pageNum={25} />
      </div>

      {/* PAGE 26 */}
      <div className="page" style={styles.page}>
        <PageHeader />
        <div className="content" style={styles.content}>
          <p style={styles.p}>(2) A person is difficult to house if that person's circumstances (other than financial circumstances) make it especially difficult for him or her to satisfy his or her need for housing.</p>

          <p style={styles.p}><strong>Ground F (groups of dwellings for people with special needs)</strong></p>
          <p style={styles.p}>6 The dwelling constitutes part of a group of dwellings which it is the practice of the landlord to make available for occupation by persons with persons with special needs and—</p>
          <p style={{ ...styles.p, ...styles.indent }}>(a) a social service or special facility is provided in close proximity to the group of dwellings in order to assist persons with those special needs,</p>
          <p style={{ ...styles.p, ...styles.indent }}>(b) there is no longer a person with those special needs living in the dwelling, and</p>
          <p style={{ ...styles.p, ...styles.indent }}>(c) the landlord requires the dwelling for occupation by a person who has those special needs (whether alone or with members of his or her family).</p>

          <h3 style={styles.h3}>UNDER-OCCUPATION GROUNDS</h3>
          <p style={styles.p}><strong>Ground G (reserve successors)</strong></p>
          <p style={styles.p}>7 The contract-holder succeeded to the occupation contract under section 73 as a reserve successor (see sections 76 and 77), and the accommodation comprised in the dwelling is more extensive than is reasonably required by the contract-holder.</p>

          <p style={styles.p}><strong>Ground H (joint contract-holders)</strong></p>
          <p style={styles.p}>8 (1) This ground arises if the first condition and the second condition are met.</p>
          <p style={{ ...styles.p, ...styles.indent }}>(2) The first condition is that a joint contract-holder's rights and obligations under the contract have been ended in accordance with—</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(a) section 111, 130 or 138 (withdrawal), or</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(b) section 225, 227 or 230 (exclusion).</p>
          <p style={{ ...styles.p, ...styles.indent }}>(3) The second condition is that—</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(a) the accommodation comprised in the dwelling is more extensive than is reasonably required by the remaining contract-holder (or contract-holders), or</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(b) where the landlord is a community landlord, the remaining contract-holder does not (or the remaining contract-holders do not) meet the landlord's criteria for the allocation of housing accommodation.</p>

          <h3 style={styles.h3}>OTHER ESTATE MANAGEMENT REASONS</h3>
          <p style={styles.p}><strong>Ground I (other estate management reasons)</strong></p>
          <p style={styles.p}>9 (1) This ground arises where it is desirable for some other substantial estate management reason that the landlord should obtain possession of the dwelling.</p>
          <p style={{ ...styles.p, ...styles.indent }}>(2) An estate management reason may, in particular, relate to—</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(a) all or part of the dwelling, or</p>
          <p style={{ ...styles.p, ...styles.indent2 }}>(b) any other premises of the landlord to which the dwelling is connected, whether by reason of proximity or the purposes for which they are used, or in any other manner.</p>
        </div>
        <PageFooter pageNum={26} />
      </div>
    </div>
  );
}
