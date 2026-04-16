export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'select';
  options?: string[];
  placeholder?: string;
}

export interface FormSchema {
  id: string;
  title: string;
  fields: FormField[];
}

/* ─── reusable field blocks ─── */
const SIG: FormField[] = [
  { key: 'signedBy',       label: 'Signed By (Full Name)',  type: 'text',  placeholder: 'e.g. John Smith' },
  { key: 'signatureDate',  label: 'Date of Signature',      type: 'date' },
];

function ltd(extra: FormField[] = [], sig = true): FormField[] {
  return [
    { key: 'landlordName',    label: 'Landlord Name',            type: 'text' },
    { key: 'landlordAddress', label: 'Landlord Address',         type: 'textarea' },
    { key: 'tenantName',      label: 'Contract-Holder Name(s)',  type: 'text' },
    { key: 'dwellingAddress', label: 'Dwelling Address',         type: 'textarea' },
    ...extra,
    ...(sig ? SIG : []),
  ];
}

const ARREARS_OPTIONS = [
  "At least eight weeks' rent is unpaid (Weekly/Fortnightly)",
  "At least two months' rent is unpaid (Monthly)",
  "At least one quarter's rent is more than three months in arrears (Quarterly)",
  "At least 25% of the rent is more than three months in arrears (Annually)",
];

/* ─── FORM SCHEMAS ─── */
export const FORM_SCHEMAS: Record<string, FormSchema> = {

  /* RHW1 – Notice of Standard Contract */
  'Form RHW1': {
    id: 'RHW1', title: 'Notice of Standard Contract',
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress', label: 'Dwelling Address',        type: 'textarea' },
      { key: 'schedule3Para', label: 'Schedule 3 Paragraph (tick applicable)', type: 'select', options: [
        'Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4',
        'Paragraph 5', 'Paragraph 6', 'Paragraph 7', 'Paragraph 8',
        'Paragraph 9', 'Paragraph 10', 'Paragraph 11', 'Paragraph 12',
        'Paragraph 13', 'Paragraph 14', 'Paragraph 15', 'Paragraph 16',
      ]},
      ...SIG,
    ],
  },

  /* RHW2 – Notice of Landlord's Address */
  'Form RHW2': {
    id: 'RHW2', title: "Notice of Landlord's Address",
    fields: ltd([
      { key: 'newAddress', label: 'New Landlord Address', type: 'textarea' },
    ]),
  },

  /* RHW3 – Notice of Change in Landlord's Identity */
  'Form RHW3': {
    id: 'RHW3', title: "Notice of Change in Landlord's Identity and Notice of New Landlord's Address",
    fields: [
      { key: 'formerLandlordName',    label: 'Former Landlord Name',    type: 'text' },
      { key: 'formerLandlordAddress', label: 'Former Landlord Address', type: 'textarea' },
      { key: 'contractHolderName',    label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress',       label: 'Dwelling Address',        type: 'textarea' },
      { key: 'newLandlordName',       label: 'New Landlord Name',       type: 'text' },
      { key: 'newLandlordAddress',    label: 'New Landlord Address',    type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW4 – Notice of Change of Landlord's Address */
  'Form RHW4': {
    id: 'RHW4', title: "Notice of Change of Landlord's Address",
    fields: ltd([
      { key: 'newAddress', label: 'New Address', type: 'textarea' },
    ]),
  },

  /* RHW6 – Head Landlord's Sub-Occupation Notice */
  'Form RHW6': {
    id: 'RHW6', title: "Head Landlord's Sub-Occupation Notice",
    fields: [
      { key: 'headLandlordName',       label: 'Head Landlord Name',            type: 'text' },
      { key: 'headLandlordAddress',    label: 'Head Landlord Address',         type: 'textarea' },
      { key: 'contractHolderName',     label: 'Contract-Holder Name(s)',       type: 'text' },
      { key: 'contractHolderAddress',  label: 'Contract-Holder Address',       type: 'textarea' },
      { key: 'subHolderName',          label: 'Sub-Holder Name(s)',            type: 'text' },
      { key: 'dwellingAddress',        label: 'Dwelling Address',              type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW7 – Head Landlord Notice to Sub-Holder */
  'Form RHW7': {
    id: 'RHW7', title: "Head Landlord's Notice to Sub-Holder",
    fields: [
      { key: 'headLandlordName',    label: 'Head Landlord Name',                    type: 'text' },
      { key: 'headLandlordAddress', label: 'Head Landlord Address',                 type: 'textarea' },
      { key: 'subHolderName',       label: 'Sub-Holder Name(s)',                    type: 'text' },
      { key: 'contractHolderName',  label: 'Contract-Holder Name(s)',               type: 'text' },
      { key: 'contractHolderAddress', label: 'Contract-Holder Address',             type: 'textarea' },
      { key: 'dwellingAddress',     label: 'Dwelling Address',                      type: 'textarea' },
      { key: 'possessionGrounds',   label: 'Grounds for Possession Claim',          type: 'textarea',
        placeholder: 'Clearly specify the grounds for the possession claim' },
      ...SIG,
    ],
  },

  /* RHW8 – Notice of Extended Possession Claim Against Sub-Holder */
  'Form RHW8': {
    id: 'RHW8', title: "Notice of Extended Possession Claim Against the Sub-Holder",
    fields: [
      { key: 'headLandlordName',      label: 'Head Landlord Name',       type: 'text' },
      { key: 'headLandlordAddress',   label: 'Head Landlord Address',    type: 'textarea' },
      { key: 'subHolderName',         label: 'Sub-Holder Name(s)',       type: 'text' },
      { key: 'contractHolderName',    label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'contractHolderAddress', label: 'Contract-Holder Address',  type: 'textarea' },
      { key: 'dwellingAddress',       label: 'Dwelling Address',         type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW12 – Notice of Variation of Rent */
  'Form RHW12': {
    id: 'RHW12', title: 'Notice of Variation of Rent',
    fields: [
      { key: 'contractType', label: 'Type of Occupation Contract', type: 'select', options: [
        'Secure contract',
        'Periodic standard contract',
      ]},
      { key: 'landlordName',      label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress',   label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',        label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress',   label: 'Dwelling Address',        type: 'textarea' },
      { key: 'effectiveDate',     label: 'New Rent Start Date',     type: 'date' },
      { key: 'newRent',           label: 'New Rent Amount',         type: 'text', placeholder: 'e.g. £850.00' },
      { key: 'rentPeriod',        label: 'New Rent Period',         type: 'select', options: ['week', 'fortnight', 'month', 'quarter', 'year'] },
      { key: 'currentRent',       label: 'Current Rent Amount',     type: 'text', placeholder: 'e.g. £800.00' },
      { key: 'currentRentPeriod', label: 'Current Rent Period',     type: 'select', options: ['week', 'fortnight', 'month', 'quarter', 'year'] },
      ...SIG,
    ],
  },

  /* RHW15 – Notice of Temporary Exclusion: Supported Standard Contract */
  'Form RHW15': {
    id: 'RHW15', title: 'Notice of Temporary Exclusion: Supported Standard Contract',
    fields: [
      { key: 'landlordName',        label: 'Landlord Name',            type: 'text' },
      { key: 'landlordAddress',     label: 'Landlord Address',         type: 'textarea' },
      { key: 'tenantName',          label: 'Contract-Holder Name',     type: 'text' },
      { key: 'dwellingAddress',     label: 'Dwelling Address',         type: 'textarea' },
      { key: 'exclusionReason',     label: 'Reason for Exclusion (tick applicable)', type: 'select', options: [
        'Used violence against any person in the dwelling',
        'Done something creating a risk of significant harm to any person',
        'Behaviour seriously impeding another resident from benefiting from support',
        'Multiple reasons apply (see specifics below)',
      ]},
      { key: 'exclusionSpecifics',  label: 'Specifics of the Act(s)',  type: 'textarea',
        placeholder: 'Clearly set out the specifics of what occurred' },
      { key: 'exclusionDateTime',   label: 'Date and Time of Exclusion',   type: 'text', placeholder: 'e.g. 10:00 on 16 April 2026' },
      { key: 'exclusionPeriod',     label: 'Period of Exclusion',          type: 'text', placeholder: 'e.g. 24 hours (max 48 hours)' },
      { key: 'returnDateTime',      label: 'Date and Time Contract-Holder May Return', type: 'text', placeholder: 'e.g. 10:00 on 17 April 2026' },
      { key: 'firstExclusionDate',  label: 'Date of First Exclusion in 6-Month Period (if 2nd or 3rd exclusion)', type: 'date' },
      { key: 'signedBy',            label: 'Signed By (Full Name)',    type: 'text' },
      { key: 'signatureDate',       label: 'Date and Time of Signature', type: 'text', placeholder: 'e.g. 10:00 on 16 April 2026' },
    ],
  },

  /* RHW16 – Landlord's Notice to Terminate (Sec 173) */
  'Form RHW16': {
    id: 'RHW16', title: "Landlord's Notice to Terminate (Section 173)",
    fields: ltd([
      { key: 'expiryDate', label: 'Notice Expiry Date', type: 'date' },
    ]),
  },

  /* RHW17 – Landlord's Notice: Breach of Contract */
  'Form RHW17': {
    id: 'RHW17', title: "Landlord's Notice: Breach of Contract",
    fields: ltd([
      { key: 'noticeDate', label: 'Notice Date', type: 'date' },
    ]),
  },

  /* RHW18 – Landlord's Notice: Estate Management Grounds */
  'Form RHW18': {
    id: 'RHW18', title: "Landlord's Notice: Estate Management Grounds",
    fields: ltd([
      { key: 'noticeDate',  label: 'Notice Date',         type: 'date' },
      { key: 'reviewDate',  label: 'Review Request Deadline (Part E)', type: 'date',
        placeholder: 'Date by which contract-holder must request review' },
    ]),
  },

  /* RHW19 – Notice of Withdrawal of Section 173 Notice */
  'Form RHW19': {
    id: 'RHW19', title: 'Notice of Withdrawal of Section 173 Notice',
    fields: ltd([
      { key: 'originalNoticeDate', label: 'Date of Original Section 173 Notice', type: 'date' },
      { key: 'possessionDate',     label: 'Possession Date in Original Notice',   type: 'date' },
      { key: 'withdrawalTiming',   label: 'Timing of This Withdrawal Notice (Part E)', type: 'select', options: [
        'Within 28 days of the previous notice (contract-holder may NOT object)',
        'After 28 days of the previous notice (contract-holder MAY object)',
      ]},
    ]),
  },

  /* RHW20 – Notice of Possession Claim: Serious Rent Arrears */
  'Form RHW20': {
    id: 'RHW20', title: 'Notice of Possession Claim: Serious Rent Arrears',
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress', label: 'Dwelling Address',        type: 'textarea' },
      { key: 'arrearsType', label: 'Arrears Type', type: 'select', options: ARREARS_OPTIONS },
      ...SIG,
    ],
  },

  /* RHW21 – Notice of Possession Claim: Serious Rent Arrears (Introductory/Prohibited Conduct) */
  'Form RHW21': {
    id: 'RHW21', title: 'Notice of Possession Claim: Serious Rent Arrears (Introductory/Prohibited Conduct)',
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress', label: 'Dwelling Address',        type: 'textarea' },
      { key: 'arrearsType', label: 'Arrears Type', type: 'select', options: ARREARS_OPTIONS },
      { key: 'reviewDate',  label: 'Review Request Deadline (Part E)', type: 'date',
        placeholder: 'At least 14 days after the date of this notice' },
      ...SIG,
    ],
  },

  /* RHW22 – Landlord's Notice: End of Fixed-Term Standard Contract */
  'Form RHW22': {
    id: 'RHW22', title: "Landlord's Notice to End a Fixed-Term Standard Contract",
    fields: ltd([
      { key: 'noticeDate', label: 'Possession Date', type: 'date' },
    ]),
  },

  /* RHW23 – Notice Before Making a Possession Claim */
  'Form RHW23': {
    id: 'RHW23', title: 'Notice Before Making a Possession Claim',
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress', label: 'Dwelling Address',        type: 'textarea' },
      { key: 'possessionGround', label: 'Ground for Possession Claim', type: 'select', options: [
        'Breach of contract (section 157)',
        'Estate management grounds (section 160 and Schedule 8)',
        "Contract-holder's failure to give up possession (section 165/170/191)",
      ]},
      { key: 'breachParticulars', label: 'Particulars of Breach (if breach of contract ground)', type: 'textarea',
        placeholder: 'Clearly state the particulars, including if section 55 (anti-social behaviour) is relied upon' },
      { key: 'estateManagementGround', label: 'Estate Management Ground (if applicable)', type: 'select', options: [
        'Not applicable',
        'Ground A – Building works',
        'Ground B – Redevelopment schemes',
        'Ground C – Charities',
        'Ground D – Dwelling suitable for disabled people',
        'Ground E – Housing associations: people difficult to house',
        'Ground F – Groups of dwellings for people with special needs',
        'Ground G – Reserve successors',
        'Ground H – Joint contract-holders',
        'Ground I – Other estate management reasons',
      ]},
      ...SIG,
    ],
  },

  /* RHW24 – Notice of Termination Under Landlord's Break Clause (6-month) */
  'Form RHW24': {
    id: 'RHW24', title: "Landlord's Break Clause Notice (Six-Month Minimum)",
    fields: ltd([
      { key: 'noticeDate', label: 'Possession Date', type: 'date' },
    ]),
  },

  /* RHW25 – Notice of Termination Under Landlord's Break Clause (2-month) */
  'Form RHW25': {
    id: 'RHW25', title: "Landlord's Break Clause Notice (Two-Month Minimum)",
    fields: ltd([
      { key: 'noticeDate', label: 'Possession Date', type: 'date' },
    ]),
  },

  /* RHW26 – Notice of Withdrawal of Break Clause Notice */
  'Form RHW26': {
    id: 'RHW26', title: "Notice of Withdrawal of Break Clause Termination Notice",
    fields: [
      { key: 'landlordName',       label: 'Landlord Name',                          type: 'text' },
      { key: 'landlordAddress',    label: 'Landlord Address',                       type: 'textarea' },
      { key: 'tenantName',         label: 'Contract-Holder Name(s)',                type: 'text' },
      { key: 'dwellingAddress',    label: 'Dwelling Address',                       type: 'textarea' },
      { key: 'originalNoticeDate', label: 'Date of Original Break Clause Notice',   type: 'date' },
      { key: 'possessionDate',     label: 'Possession Date in Original Notice',     type: 'date' },
      { key: 'withdrawalTiming',   label: 'Timing of This Withdrawal (Part E)',     type: 'select', options: [
        'Within 28 days of the previous notice (contract-holder may NOT object)',
        'After 28 days of the previous notice (contract-holder MAY object)',
      ]},
      ...SIG,
    ],
  },

  /* RHW27 – Notice of Intention to End Contract Due to Abandonment */
  'Form RHW27': {
    id: 'RHW27', title: "Notice of Landlord's Intention to End Occupation Contract Due to Abandonment",
    fields: [
      { key: 'landlordName',          label: 'Landlord Name',                  type: 'text' },
      { key: 'landlordAddress',       label: 'Landlord Address',               type: 'textarea' },
      { key: 'tenantName',            label: 'Contract-Holder Name(s)',        type: 'text' },
      { key: 'subHolderLodgerNames',  label: 'Sub-Holder(s) / Lodger(s) Names (if applicable)', type: 'text' },
      { key: 'dwellingAddress',       label: 'Dwelling Address',               type: 'textarea' },
      { key: 'warningDate',           label: 'Warning Period End Date (4 weeks from notice)', type: 'date' },
      ...SIG,
    ],
  },

  /* RHW28 – Notice of End of Contract Due to Abandonment */
  'Form RHW28': {
    id: 'RHW28', title: "Notice of End of Occupation Contract Due to Abandonment",
    fields: [
      { key: 'landlordName',         label: 'Landlord Name',                  type: 'text' },
      { key: 'landlordAddress',      label: 'Landlord Address',               type: 'textarea' },
      { key: 'tenantName',           label: 'Contract-Holder Name(s)',        type: 'text' },
      { key: 'subHolderLodgerNames', label: 'Sub-Holder(s) / Lodger(s) Names (if applicable)', type: 'text' },
      { key: 'dwellingAddress',      label: 'Dwelling Address',               type: 'textarea' },
      { key: 'previousNoticeDate',   label: 'Date of Previous RHW27 Notice',  type: 'date' },
      { key: 'contractEndDate',      label: 'Date Occupation Contract Ends',  type: 'date' },
      { key: 'possessionDate',       label: 'Date of Possession Recovery',    type: 'date' },
      ...SIG,
    ],
  },

  /* RHW29 – Notice of Intention to End Joint Contract-Holder's Rights (Non-Occupation) */
  'Form RHW29': {
    id: 'RHW29', title: "Notice of Landlord's Intention to End Rights of Joint Contract-Holder Due to Non-Occupation",
    fields: [
      { key: 'landlordName',                label: 'Landlord Name',                  type: 'text' },
      { key: 'landlordAddress',             label: 'Landlord Address',               type: 'textarea' },
      { key: 'jointContractHolderName',     label: 'Joint Contract-Holder Name (Part B)', type: 'text' },
      { key: 'jointContractHolderAddress',  label: 'Joint Contract-Holder Address (if known)', type: 'textarea' },
      { key: 'otherContractHolderNames',    label: 'Other Joint Contract-Holder(s) Names (Part C)', type: 'text' },
      { key: 'dwellingAddress',             label: 'Dwelling Address',               type: 'textarea' },
      { key: 'occupancyTerm',               label: 'Occupation Contract Term Requiring Occupancy (Part E)', type: 'textarea',
        placeholder: 'Insert the term of the contract which requires the joint contract-holder to occupy the dwelling' },
      { key: 'warningDate',                 label: 'Warning Period End Date (Part E)', type: 'date' },
      ...SIG,
    ],
  },

  /* RHW30 – Notice of End of Joint Contract-Holder's Rights (Non-Occupation) */
  'Form RHW30': {
    id: 'RHW30', title: "Notice of End of Rights of Joint Contract-Holder Due to Non-Occupation",
    fields: [
      { key: 'landlordName',               label: 'Landlord Name',                   type: 'text' },
      { key: 'landlordAddress',            label: 'Landlord Address',                type: 'textarea' },
      { key: 'jointContractHolderName',    label: 'Joint Contract-Holder Name (Part B)', type: 'text' },
      { key: 'jointContractHolderAddress', label: 'Joint Contract-Holder Address (if known)', type: 'textarea' },
      { key: 'otherContractHolderNames',   label: 'Other Joint Contract-Holder(s) Names (Part C)', type: 'text' },
      { key: 'dwellingAddress',            label: 'Dwelling Address',                type: 'textarea' },
      { key: 'previousNoticeDate',         label: 'Date of Previous RHW29 Notice',   type: 'date' },
      { key: 'contractEndDate',            label: 'Date Joint Contract-Holder Ceases to Be a Party', type: 'date' },
      ...SIG,
    ],
  },

  /* RHW32 – Notice of Intention to Apply for Order Ending JCH Rights (Prohibited Conduct) */
  'Form RHW32': {
    id: 'RHW32', title: "Notice of Intention to Apply for Order Ending Joint Contract-Holder's Rights (Prohibited Conduct)",
    fields: [
      { key: 'landlordName',              label: 'Landlord Name',                   type: 'text' },
      { key: 'landlordAddress',           label: 'Landlord Address',                type: 'textarea' },
      { key: 'jointContractHolderName',   label: 'Joint Contract-Holder Name (in breach)', type: 'text' },
      { key: 'dwellingAddress',           label: 'Dwelling Address',                type: 'textarea' },
      { key: 'breachParticulars',         label: 'Particulars of Breach (Section 55)', type: 'textarea',
        placeholder: 'Clearly specify the particulars of the anti-social behaviour / prohibited conduct' },
      ...SIG,
    ],
  },

  /* RHW33 – Notice to Other Joint Contract-Holders (Prohibited Conduct) */
  'Form RHW33': {
    id: 'RHW33', title: "Notice to Other Joint Contract-Holders: Intention to Apply for Order (Prohibited Conduct)",
    fields: [
      { key: 'landlordName',             label: 'Landlord Name',                              type: 'text' },
      { key: 'landlordAddress',          label: 'Landlord Address',                           type: 'textarea' },
      { key: 'jointContractHolderName',  label: 'Joint Contract-Holder in Breach (Part B)',   type: 'text' },
      { key: 'otherContractHolderNames', label: 'Other Joint Contract-Holder(s) Names (Part C)', type: 'text' },
      { key: 'dwellingAddress',          label: 'Dwelling Address',                           type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW34 – Notice of Extension of Introductory Period */
  'Form RHW34': {
    id: 'RHW34', title: "Notice of Extension of Introductory Period",
    fields: ltd([
      { key: 'introductionDate',    label: 'Introduction Date',              type: 'date' },
      { key: 'introductoryEndDate', label: 'Introductory Period End Date (18 months)', type: 'date' },
      { key: 'extensionReasons',    label: 'Reasons for Extension',         type: 'textarea',
        placeholder: 'Clearly state the reasons for extending the introductory period' },
      { key: 'reviewDate',          label: 'Review Request Deadline (Part E)', type: 'date',
        placeholder: 'At least 14 days after the date of this notice' },
    ]),
  },

  /* RHW35 – Notice of Intention to Apply for Prohibited Conduct Standard Contract */
  'Form RHW35': {
    id: 'RHW35', title: "Notice of Intention to Apply for a Prohibited Conduct Standard Contract",
    fields: ltd([
      { key: 'conductParticulars',   label: 'Particulars of Prohibited Conduct', type: 'textarea',
        placeholder: 'Clearly specify the particulars of the conduct (section 55 breach)' },
      { key: 'proceedingsNotBefore', label: 'Proceedings May Not Be Brought Before', type: 'date' },
      { key: 'proceedingsNotAfter',  label: 'Proceedings May Not Be Brought After',  type: 'date',
        placeholder: '6 months from date of this notice' },
    ]),
  },

  /* RHW36 – Notice of End of Probation Period */
  'Form RHW36': {
    id: 'RHW36', title: 'Notice of End of Probation Period: Prohibited Conduct Standard Contract',
    fields: ltd([
      { key: 'probationEndDate', label: 'Probation Period End Date', type: 'date' },
    ]),
  },

  /* RHW37 – Notice of Extension of Probation Period */
  'Form RHW37': {
    id: 'RHW37', title: "Notice of Extension of Probation Period: Prohibited Conduct Standard Contract",
    fields: ltd([
      { key: 'probationEndDate',  label: 'Probation Period End Date (18 months)', type: 'date' },
      { key: 'extensionReasons',  label: 'Reasons for Extension',                type: 'textarea',
        placeholder: 'Clearly state the reasons for extending the probation period' },
      { key: 'reviewDate',        label: 'Review Request Deadline (Part E)',      type: 'date',
        placeholder: 'At least 14 days after the date of this notice' },
    ]),
  },

  /* RHW38 – Landlord's Notice of Termination: Converted Contract */
  'Form RHW38': {
    id: 'RHW38', title: "Landlord's Notice of Termination: Fixed Term Standard Contract (Converted)",
    fields: ltd([
      { key: 'noticeDate', label: 'Possession Date', type: 'date' },
    ]),
  },

  /* fallback */
  'default': {
    id: 'GENERIC', title: 'Wales Housing Form',
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress', label: 'Dwelling Address',        type: 'textarea' },
      { key: 'effectiveDate',   label: 'Date of Notice',          type: 'date' },
      ...SIG,
    ],
  },
};
