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

/* ─── FORM SCHEMAS ─── */
export const FORM_SCHEMAS: Record<string, FormSchema> = {

  /* RHW1 – Notice of Standard Contract (community landlord, no signature) */
  'Form RHW1': {
    id: 'RHW1', title: 'Notice of Standard Contract',
    fields: ltd([], false),
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
      { key: 'subHolderAddress',       label: 'Sub-Holder Address',            type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW7 – Head Landlord Notice to Sub-Holder */
  'Form RHW7': {
    id: 'RHW7', title: "Head Landlord's Notice to Sub-Holder",
    fields: [
      { key: 'headLandlordName',    label: 'Head Landlord Name',      type: 'text' },
      { key: 'headLandlordAddress', label: 'Head Landlord Address',   type: 'textarea' },
      { key: 'contractHolderName',  label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'subHolderName',       label: 'Sub-Holder Name(s)',      type: 'text' },
      { key: 'subHolderAddress',    label: 'Sub-Holder Address',      type: 'textarea' },
      { key: 'dwellingAddress',     label: 'Dwelling Address',        type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW8 – Head Landlord Consent for New Sub-Holder */
  'Form RHW8': {
    id: 'RHW8', title: "Head Landlord's Notice: New Sub-Holder",
    fields: [
      { key: 'headLandlordName',     label: 'Head Landlord Name',       type: 'text' },
      { key: 'headLandlordAddress',  label: 'Head Landlord Address',    type: 'textarea' },
      { key: 'contractHolderName',   label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'subHolderName',        label: 'Sub-Holder Name(s)',       type: 'text' },
      { key: 'subHolderAddress',     label: 'Sub-Holder Address',       type: 'textarea' },
      { key: 'newSubHolderAddress',  label: 'New Sub-Holder Address',   type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW12 – Notice of Variation of Rent */
  'Form RHW12': {
    id: 'RHW12', title: 'Notice of Variation of Rent',
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress', label: 'Dwelling Address',        type: 'textarea' },
      { key: 'effectiveDate',   label: 'Date New Rent Starts',    type: 'date', placeholder: 'DD/MM/YYYY' },
      { key: 'newRent',         label: 'New Rent Amount',         type: 'text', placeholder: 'e.g. £850.00' },
      { key: 'currentRent',     label: 'Current Rent Amount',     type: 'text', placeholder: 'e.g. £800.00' },
      ...SIG,
    ],
  },

  /* RHW15 – Information about a New Contract-Holder (no signature on page 1) */
  'Form RHW15': {
    id: 'RHW15', title: 'Information About a New Contract-Holder',
    fields: ltd([], false),
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
      { key: 'noticeDate', label: 'Notice Date', type: 'date' },
    ]),
  },

  /* RHW19 – Notice of Withdrawal of Section 173 Notice */
  'Form RHW19': {
    id: 'RHW19', title: 'Notice of Withdrawal of Section 173 Notice',
    fields: ltd(),
  },

  /* RHW20 – Notice of Possession Claim: Serious Rent Arrears */
  'Form RHW20': {
    id: 'RHW20', title: 'Notice of Possession Claim: Serious Rent Arrears',
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress', label: 'Dwelling Address',        type: 'textarea' },
      { key: 'arrearsType', label: 'Arrears Type', type: 'select', options: [
        "At least eight weeks' rent is unpaid (Weekly/Fortnightly)",
        "At least two months' rent is unpaid (Monthly)",
        "At least one quarter's rent is more than three months in arrears (Quarterly)",
        "At least 25% of the rent is more than three months in arrears (Annually)",
      ]},
      ...SIG,
    ],
  },

  /* RHW21 – Notice of Withdrawal of Possession Claim Notice */
  'Form RHW21': {
    id: 'RHW21', title: 'Notice of Withdrawal of Possession Claim Notice',
    fields: ltd(),
  },

  /* RHW22 – Landlord's Notice to End a Fixed-Term Standard Contract */
  'Form RHW22': {
    id: 'RHW22', title: "Landlord's Notice to End a Fixed-Term Standard Contract",
    fields: ltd([
      { key: 'noticeDate', label: 'Notice Date', type: 'date' },
    ]),
  },

  /* RHW23 – Notice Before Making a Possession Claim */
  'Form RHW23': {
    id: 'RHW23', title: 'Notice Before Making a Possession Claim',
    fields: ltd([], false),
  },

  /* RHW24 – Landlord's Notice: Serious Rent Arrears (Fixed Term) */
  'Form RHW24': {
    id: 'RHW24', title: "Landlord's Notice: Serious Rent Arrears (Fixed Term)",
    fields: ltd([
      { key: 'noticeDate', label: 'Notice Date', type: 'date' },
    ]),
  },

  /* RHW25 – Landlord's Notice: Serious Rent Arrears (Standard) */
  'Form RHW25': {
    id: 'RHW25', title: "Landlord's Notice: Serious Rent Arrears",
    fields: ltd([
      { key: 'noticeDate', label: 'Notice Date', type: 'date' },
    ]),
  },

  /* RHW26 – Head Landlord's Decision on Sub-Occupation */
  'Form RHW26': {
    id: 'RHW26', title: "Head Landlord's Decision on Sub-Occupation",
    fields: [
      { key: 'headLandlordName',    label: 'Head Landlord Name',      type: 'text' },
      { key: 'headLandlordAddress', label: 'Head Landlord Address',   type: 'textarea' },
      { key: 'contractHolderName',  label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'dwellingAddress',     label: 'Dwelling Address',        type: 'textarea' },
      { key: 'breakNoticeDate',     label: 'Break Clause Notice Date',type: 'date' },
      ...SIG,
    ],
  },

  /* RHW27 – Landlord's Notice: Serious Rent Arrears (Periodic) */
  'Form RHW27': {
    id: 'RHW27', title: "Landlord's Notice: Serious Rent Arrears (Periodic)",
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'tenantAddress',   label: 'Contract-Holder Address', type: 'textarea' },
      { key: 'noticeDate',      label: 'Notice Date',             type: 'date' },
      ...SIG,
    ],
  },

  /* RHW28 – Landlord's Notice: Serious Rent Arrears (Fixed Term) */
  'Form RHW28': {
    id: 'RHW28', title: "Landlord's Notice: Serious Rent Arrears (Fixed Term)",
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name(s)', type: 'text' },
      { key: 'tenantAddress',   label: 'Contract-Holder Address', type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW29 – Notice of Intention to End Rights of Joint Contract-Holder */
  'Form RHW29': {
    id: 'RHW29', title: "Notice of Landlord's Intention to End Rights of Joint Contract-Holder",
    fields: [
      { key: 'landlordName',                label: 'Landlord Name',                  type: 'text' },
      { key: 'landlordAddress',             label: 'Landlord Address',               type: 'textarea' },
      { key: 'jointContractHolderName',     label: 'Joint Contract-Holder Name',     type: 'text' },
      { key: 'jointContractHolderAddress',  label: 'Joint Contract-Holder Address',  type: 'textarea' },
      { key: 'otherContractHolderNames',    label: 'Other Joint Contract-Holder(s)', type: 'text' },
      { key: 'dwellingAddress',             label: 'Dwelling Address',               type: 'textarea' },
    ],
  },

  /* RHW30 – Notice of Landlord's Intention (Warning Period Ended) */
  'Form RHW30': {
    id: 'RHW30', title: "Landlord's Notice: Warning Period Ended",
    fields: [
      { key: 'landlordName',    label: 'Landlord Name',           type: 'text' },
      { key: 'landlordAddress', label: 'Landlord Address',        type: 'textarea' },
      { key: 'tenantName',      label: 'Contract-Holder Name',    type: 'text' },
      { key: 'tenantAddress',   label: 'Contract-Holder Address', type: 'textarea' },
      { key: 'warningDate',     label: 'Warning Period End Date', type: 'date' },
      ...SIG,
    ],
  },

  /* RHW32 – Notice of Variation of Fixed-Term Standard Contract */
  'Form RHW32': {
    id: 'RHW32', title: 'Notice of Variation of Fixed-Term Standard Contract',
    fields: ltd(),
  },

  /* RHW33 – Notice of Variation of Periodic Standard Contract */
  'Form RHW33': {
    id: 'RHW33', title: 'Notice of Variation of Periodic Standard Contract',
    fields: [
      { key: 'landlordName',        label: 'Landlord Name',             type: 'text' },
      { key: 'landlordAddress',     label: 'Landlord Address',          type: 'textarea' },
      { key: 'tenantName',          label: 'Contract-Holder Name',      type: 'text' },
      { key: 'jointHolderName',     label: 'Joint Contract-Holder(s)',  type: 'text' },
      { key: 'jointHolderAddress',  label: 'Joint Holder Address',      type: 'textarea' },
      ...SIG,
    ],
  },

  /* RHW34 – Landlord's Notice: Extension of Introductory Period */
  'Form RHW34': {
    id: 'RHW34', title: "Landlord's Notice: Extension of Introductory Period",
    fields: ltd([
      { key: 'noticeDate', label: 'Notice Date', type: 'date' },
    ]),
  },

  /* RHW35 – Notice of Change of Landlord */
  'Form RHW35': {
    id: 'RHW35', title: 'Notice of Change of Landlord',
    fields: ltd([
      { key: 'changeDate',    label: 'Date of Change',     type: 'date' },
      { key: 'effectiveDate', label: 'Effective From Date', type: 'date' },
    ]),
  },

  /* RHW36 – Notice of Change of Contract-Holder */
  'Form RHW36': {
    id: 'RHW36', title: 'Notice of Change of Contract-Holder',
    fields: ltd([
      { key: 'occupationEndDate', label: 'Occupation End Date', type: 'date' },
    ]),
  },

  /* RHW37 – Landlord's Notice: Extension of Probation Period */
  'Form RHW37': {
    id: 'RHW37', title: "Landlord's Notice: Extension of Probation Period",
    fields: ltd([
      { key: 'noticeDate',   label: 'Notice Date',    type: 'date' },
      { key: 'decisionDate', label: 'Decision Date',  type: 'date' },
    ]),
  },

  /* RHW38 – Termination of Converted Contract */
  'Form RHW38': {
    id: 'RHW38', title: 'Termination of Converted Contract',
    fields: ltd([
      { key: 'endDate', label: 'Contract End Date', type: 'date' },
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
