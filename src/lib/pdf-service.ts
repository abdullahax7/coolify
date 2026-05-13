import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont, PDFTextField, LineCapStyle } from 'pdf-lib';

/* ─── Types ─── */
type Coord = {
  x: number;
  y: number;
  maxLines?: number;   // how many lines to allow (default 1)
  isSig?: boolean;     // render as italic "e-signature"
  page?: number;       // 0 = page 1 (default), 1 = page 2, etc.
};

type FormMap = Record<string, Coord>;

/* ──────────────────────────────────────────────────────────────────────
   EXACT COORDINATES – extracted programmatically from each PDF via pdfjs.
   Text is drawn relative to pdf-lib's origin (bottom-left, y upward).
   "inline" positions sit on the same baseline as the label;
   "below" positions (addresses) sit below the label line.
   Signature positions overwrite the dotted-line placeholder.
────────────────────────────────────────────────────────────────────── */
const FORM_COORDS: Record<string, FormMap> = {

  'Form RHW1': {
    landlordName:    { x: 112, y: 615 },
    landlordAddress: { x: 77,  y: 576, maxLines: 3 },
    tenantName:      { x: 367, y: 615 },
    dwellingAddress: { x: 77,  y: 490, maxLines: 2 },
    // schedule3Para handled by FORM_CHECKBOXES
    signedBy:        { x: 105, y: 618, isSig: true, page: 1 },
    signatureDate:   { x: 321, y: 631, page: 1 },
  },

  'Form RHW2': {
    landlordName:    { x: 112, y: 615 },
    landlordAddress: { x: 77,  y: 576, maxLines: 2 },
    tenantName:      { x: 366, y: 615 },
    dwellingAddress: { x: 77,  y: 490, maxLines: 2 },
    newAddress:      { x: 77,  y: 410, maxLines: 2 },
    signedBy:        { x: 77,  y: 293, isSig: true },
    signatureDate:   { x: 304, y: 293 },
  },

  'Form RHW3': {
    formerLandlordName:    { x: 112, y: 589 },
    formerLandlordAddress: { x: 77,  y: 550, maxLines: 2 },
    contractHolderName:    { x: 366, y: 589 },
    dwellingAddress:       { x: 77,  y: 464, maxLines: 2 },
    newLandlordName:       { x: 112, y: 346 },
    newLandlordAddress:    { x: 77,  y: 306, maxLines: 2 },
    signedBy:              { x: 105, y: 172, isSig: true },
    signatureDate:         { x: 304, y: 189 },
  },

  'Form RHW4': {
    landlordName:    { x: 112, y: 603 },
    landlordAddress: { x: 77,  y: 564, maxLines: 2 },
    tenantName:      { x: 366, y: 603 },
    dwellingAddress: { x: 77,  y: 478, maxLines: 2 },
    newAddress:      { x: 77,  y: 372, maxLines: 2 },
    signedBy:        { x: 77,  y: 243, isSig: true },
    signatureDate:   { x: 304, y: 243 },
  },

  'Form RHW5': {
    formerLandlordName:    { x: 112, y: 589 },
    formerLandlordAddress: { x: 77,  y: 550, maxLines: 2 },
    contractHolderName:    { x: 366, y: 589 },
    dwellingAddress:       { x: 77,  y: 464, maxLines: 2 },
    newLandlordName:       { x: 112, y: 346 },
    newLandlordAddress:    { x: 77,  y: 306, maxLines: 2 },
    signedBy:              { x: 105, y: 172, isSig: true },
    signatureDate:         { x: 304, y: 189 },
  },

  'Form RHW6': {
    headLandlordName:      { x: 112, y: 575 },
    headLandlordAddress:   { x: 77,  y: 536, maxLines: 2 },
    contractHolderName:    { x: 366, y: 575 },
    contractHolderAddress: { x: 311, y: 536, maxLines: 2 },
    subHolderName:         { x: 132, y: 463 },
    dwellingAddress:       { x: 311, y: 450, maxLines: 2 },
    signedBy:              { x: 77,  y: 173, isSig: true },
    signatureDate:         { x: 304, y: 173 },
  },

  'Form RHW7': {
    headLandlordName:     { x: 112, y: 589 },
    headLandlordAddress:  { x: 77,  y: 552, maxLines: 2 },
    subHolderName:        { x: 366, y: 589 },
    contractHolderName:   { x: 132, y: 471 },
    contractHolderAddress:{ x: 75,  y: 420, maxLines: 2 },
    dwellingAddress:      { x: 311, y: 443, maxLines: 2 },
    possessionGrounds:    { x: 75,  y: 285, maxLines: 6 },
    signedBy:             { x: 77,  y: 145, isSig: true },
    signatureDate:        { x: 304, y: 145 },
  },

  'Form RHW8': {
    headLandlordName:     { x: 112, y: 603 },
    headLandlordAddress:  { x: 77,  y: 564, maxLines: 2 },
    subHolderName:        { x: 366, y: 603 },
    contractHolderName:   { x: 132, y: 491 },
    contractHolderAddress:{ x: 77,  y: 452, maxLines: 2 },
    dwellingAddress:      { x: 311, y: 468, maxLines: 2 },
    signedBy:             { x: 77,  y: 239, isSig: true },
    signatureDate:        { x: 304, y: 239 },
  },

  'Form RHW9': {
    landlordName:      { x: 112, y: 615 },
    landlordAddress:   { x: 77,  y: 576, maxLines: 2 },
    tenantName:        { x: 366, y: 615 },
    dwellingAddress:   { x: 77,  y: 490, maxLines: 2 },
    statementDeadline: { x: 77,  y: 410 },
    signedBy:          { x: 105, y: 275, isSig: true },
    signatureDate:     { x: 304, y: 293 },
  },

  'Form RHW10': {
    landlordName:      { x: 112, y: 615 },
    landlordAddress:   { x: 77,  y: 576, maxLines: 2 },
    tenantName:        { x: 366, y: 615 },
    dwellingAddress:   { x: 77,  y: 490, maxLines: 2 },
    statementDeadline: { x: 77,  y: 410 },
    signedBy:          { x: 105, y: 275, isSig: true },
    signatureDate:     { x: 304, y: 293 },
  },

  'Form RHW11': {
    landlordName:      { x: 112, y: 615 },
    landlordAddress:   { x: 77,  y: 576, maxLines: 2 },
    tenantName:        { x: 366, y: 615 },
    dwellingAddress:   { x: 77,  y: 490, maxLines: 2 },
    statementDeadline: { x: 77,  y: 410 },
    signedBy:          { x: 105, y: 275, isSig: true },
    signatureDate:     { x: 304, y: 293 },
  },

  'Form RHW12': {
    // contractType handled by FORM_CHECKBOXES
    landlordName:       { x: 346, y: 599 },
    landlordAddress:    { x: 311, y: 560, maxLines: 2 },
    tenantName:         { x: 132, y: 501 },
    dwellingAddress:    { x: 311, y: 488, maxLines: 2 },
    effectiveDate:      { x: 205, y: 408 },
    newRent:            { x: 323, y: 408 },
    rentPeriod:         { x: 400, y: 408 },
    currentRent:        { x: 259, y: 371 },
    currentRentPeriod:  { x: 345, y: 371 },
    signedBy:           { x: 77,  y: 241, isSig: true },
    signatureDate:      { x: 304, y: 241 },
  },

  'Form RHW13': {
    landlordName:       { x: 112, y: 615 },
    landlordAddress:    { x: 77,  y: 576, maxLines: 2 },
    tenantName:         { x: 366, y: 615 },
    dwellingAddress:    { x: 77,  y: 490, maxLines: 2 },
    effectiveDate:      { x: 205, y: 408 },
    newRent:            { x: 323, y: 408 },
    signedBy:           { x: 77,  y: 293, isSig: true },
    signatureDate:      { x: 304, y: 293 },
  },

  'Form RHW14': {
    landlordName:       { x: 112, y: 615 },
    landlordAddress:    { x: 77,  y: 576, maxLines: 2 },
    tenantName:         { x: 366, y: 615 },
    dwellingAddress:    { x: 77,  y: 490, maxLines: 2 },
    effectiveDate:      { x: 205, y: 408 },
    newRent:            { x: 323, y: 408 },
    signedBy:           { x: 77,  y: 293, isSig: true },
    signatureDate:      { x: 304, y: 293 },
  },

  'Form RHW15': {
    landlordName:       { x: 112, y: 553 },
    landlordAddress:    { x: 77,  y: 514, maxLines: 2 },
    tenantName:         { x: 346, y: 553 },
    dwellingAddress:    { x: 77,  y: 444, maxLines: 2 },
    // exclusionReason handled by FORM_CHECKBOXES (page 1)
    exclusionSpecifics: { x: 77,  y: 348, maxLines: 4 },
    // Fields below are on page 2
    exclusionDateTime:  { x: 258, y: 755, page: 1 },
    exclusionPeriod:    { x: 258, y: 722, page: 1 },
    returnDateTime:     { x: 258, y: 689, page: 1 },
    firstExclusionDate: { x: 375, y: 630, page: 1 },
    signedBy:           { x: 77,  y: 175, isSig: true, page: 1 },
    signatureDate:      { x: 304, y: 175, page: 1 },
  },

  'Form RHW16': {
    landlordName:    { x: 112, y: 550 },
    landlordAddress: { x: 77,  y: 512, maxLines: 2 },
    tenantName:      { x: 366, y: 550 },
    dwellingAddress: { x: 77,  y: 442, maxLines: 2 },
    expiryDate:      { x: 77,  y: 353 },
    signedBy:        { x: 77,  y: 211, isSig: true },
    signatureDate:   { x: 304, y: 211 },
  },

  'Form RHW17': {
    landlordName:    { x: 112, y: 550 },
    landlordAddress: { x: 77,  y: 512, maxLines: 2 },
    tenantName:      { x: 366, y: 550 },
    dwellingAddress: { x: 77,  y: 442, maxLines: 2 },
    noticeDate:      { x: 77,  y: 365 },
    signedBy:        { x: 77,  y: 223, isSig: true },
    signatureDate:   { x: 304, y: 223 },
  },

  'Form RHW18': {
    landlordName:    { x: 112, y: 589 },
    landlordAddress: { x: 77,  y: 552, maxLines: 2 },
    tenantName:      { x: 366, y: 589 },
    dwellingAddress: { x: 77,  y: 486, maxLines: 2 },
    noticeDate:      { x: 77,  y: 406 },
    reviewDate:      { x: 316, y: 298 },
    signedBy:        { x: 77,  y: 114, isSig: true },
    signatureDate:   { x: 304, y: 114 },
  },

  'Form RHW19': {
    landlordName:        { x: 112, y: 601 },
    landlordAddress:     { x: 77,  y: 564, maxLines: 2 },
    tenantName:          { x: 366, y: 601 },
    dwellingAddress:     { x: 77,  y: 496, maxLines: 2 },
    originalNoticeDate:  { x: 150, y: 420 },
    possessionDate:      { x: 213, y: 407 },
    // withdrawalTiming handled by FORM_CHECKBOXES
    signedBy:            { x: 77,  y: 136, isSig: true },
    signatureDate:       { x: 304, y: 136 },
  },

  'Form RHW20': {
    landlordName:    { x: 112, y: 550 },
    landlordAddress: { x: 77,  y: 512, maxLines: 2 },
    tenantName:      { x: 364, y: 550 },
    dwellingAddress: { x: 77,  y: 442, maxLines: 2 },
    // arrearsType handled via ARREARS_BOXES (legacy) / FORM_CHECKBOXES
    signedBy:        { x: 105, y: 168, isSig: true },
    signatureDate:   { x: 304, y: 180 },
  },

  'Form RHW21': {
    landlordName:    { x: 118, y: 576 },
    landlordAddress: { x: 83,  y: 539, maxLines: 2 },
    tenantName:      { x: 365, y: 576 },
    dwellingAddress: { x: 83,  y: 469, maxLines: 2 },
    // arrearsType handled by FORM_CHECKBOXES
    reviewDate:      { x: 316, y: 325 },
    signedBy:        { x: 120, y: 94, isSig: true },
    signatureDate:   { x: 305, y:  89 },
  },

  'Form RHW22': {
    landlordName:    { x: 112, y: 575 },
    landlordAddress: { x: 77,  y: 538, maxLines: 2 },
    tenantName:      { x: 366, y: 575 },
    dwellingAddress: { x: 77,  y: 471, maxLines: 2 },
    noticeDate:      { x: 77,  y: 394 },
    signedBy:        { x: 77,  y: 228, isSig: true },
    signatureDate:   { x: 304, y: 228 },
  },

  'Form RHW23': {
    landlordName:           { x: 112, y: 600 },
    landlordAddress:        { x: 77,  y: 563, maxLines: 2 },
    tenantName:             { x: 364, y: 600 },
    dwellingAddress:        { x: 77,  y: 493, maxLines: 2 },
    // possessionGround handled by FORM_CHECKBOXES
    breachParticulars:      { x: 83,  y: 435, maxLines: 3 },
    // estateManagementGround handled by FORM_CHECKBOXES
    signedBy:               { x: 77,  y: 145, isSig: true, page: 1 },
    signatureDate:          { x: 304, y: 145, page: 1 },
  },

  'Form RHW24': {
    landlordName:    { x: 112, y: 539 },
    landlordAddress: { x: 77,  y: 502, maxLines: 2 },
    tenantName:      { x: 366, y: 539 },
    dwellingAddress: { x: 77,  y: 432, maxLines: 2 },
    noticeDate:      { x: 130, y: 343 },
    signedBy:        { x: 77,  y: 237, isSig: true },
    signatureDate:   { x: 304, y: 237 },
  },

  'Form RHW25': {
    landlordName:    { x: 107, y: 566 },
    landlordAddress: { x: 72,  y: 529, maxLines: 2 },
    tenantName:      { x: 357, y: 566 },
    dwellingAddress: { x: 72,  y: 458, maxLines: 2 },
    noticeDate:      { x: 160, y: 370 },
    signedBy:        { x: 72,  y: 264, isSig: true },
    signatureDate:   { x: 295, y: 264 },
  },

  'Form RHW26': {
    landlordName:        { x: 112, y: 589 },
    landlordAddress:     { x: 77,  y: 552, maxLines: 2 },
    tenantName:          { x: 366, y: 589 },
    dwellingAddress:     { x: 77,  y: 482, maxLines: 2 },
    originalNoticeDate:  { x: 130, y: 429 },
    possessionDate:      { x: 130, y: 411 },
    // withdrawalTiming handled by FORM_CHECKBOXES
    signedBy:            { x: 77,  y: 122, isSig: true },
    signatureDate:       { x: 304, y: 122 },
  },

  'Form RHW27': {
    landlordName:         { x: 112, y: 600 },
    landlordAddress:      { x: 77,  y: 560, maxLines: 2 },
    tenantName:           { x: 366, y: 600 },
    subHolderLodgerNames: { x: 132, y: 487 },
    dwellingAddress:      { x: 311, y: 489, maxLines: 2 },
    warningDate:          { x: 316, y: 354 },
    signedBy:             { x: 77,  y: 128, isSig: true },
    signatureDate:        { x: 304, y: 128 },
  },

  'Form RHW28': {
    landlordName:         { x: 112, y: 579 },
    landlordAddress:      { x: 77,  y: 540, maxLines: 2 },
    tenantName:           { x: 366, y: 579 },
    subHolderLodgerNames: { x: 132, y: 466 },
    dwellingAddress:      { x: 311, y: 468, maxLines: 2 },
    previousNoticeDate:   { x: 315, y: 382 },
    contractEndDate:      { x: 188, y: 348 },
    possessionDate:       { x: 188, y: 316 },
    signedBy:             { x: 77,  y: 118, isSig: true },
    signatureDate:        { x: 304, y: 118 },
  },

  'Form RHW29': {
    landlordName:               { x: 112, y: 537 },
    landlordAddress:            { x: 77,  y: 498, maxLines: 2 },
    jointContractHolderName:    { x: 346, y: 537 },
    jointContractHolderAddress: { x: 311, y: 498, maxLines: 2 },
    otherContractHolderNames:   { x: 132, y: 425 },
    dwellingAddress:            { x: 311, y: 412, maxLines: 2 },
    occupancyTerm:              { x: 77,  y: 330, maxLines: 3 },
    warningDate:                { x: 316, y: 238 },
    signedBy:                   { x: 77,  y:  90, isSig: true },
    signatureDate:              { x: 304, y:  90 },
  },

  'Form RHW30': {
    landlordName:               { x: 112, y: 551 },
    landlordAddress:            { x: 77,  y: 512, maxLines: 2 },
    jointContractHolderName:    { x: 346, y: 551 },
    jointContractHolderAddress: { x: 311, y: 512, maxLines: 2 },
    otherContractHolderNames:   { x: 132, y: 437 },
    dwellingAddress:            { x: 311, y: 426, maxLines: 2 },
    previousNoticeDate:         { x: 316, y: 350 },
    contractEndDate:            { x: 318, y: 294 },
    signedBy:                   { x: 77,  y: 138, isSig: true },
    signatureDate:              { x: 304, y: 138 },
  },

  'Form RHW31': {
    landlordName:               { x: 112, y: 551 },
    landlordAddress:            { x: 77,  y: 512, maxLines: 2 },
    jointContractHolderName:    { x: 346, y: 551 },
    dwellingAddress:            { x: 77,  y: 428, maxLines: 2 },
    contractEndDate:            { x: 318, y: 294 },
    signedBy:                   { x: 77,  y: 138, isSig: true },
    signatureDate:              { x: 304, y: 138 },
  },

  'Form RHW32': {
    landlordName:             { x: 112, y: 537 },
    landlordAddress:          { x: 77,  y: 498, maxLines: 2 },
    jointContractHolderName:  { x: 346, y: 537 },
    dwellingAddress:          { x: 77,  y: 428, maxLines: 2 },
    breachParticulars:        { x: 77,  y: 360, maxLines: 4 },
    signedBy:                 { x: 77,  y: 138, isSig: true },
    signatureDate:            { x: 304, y: 138 },
  },

  'Form RHW33': {
    landlordName:              { x: 112, y: 537 },
    landlordAddress:           { x: 77,  y: 498, maxLines: 2 },
    jointContractHolderName:   { x: 346, y: 537 },
    otherContractHolderNames:  { x: 132, y: 425 },
    dwellingAddress:           { x: 311, y: 412, maxLines: 2 },
    signedBy:                  { x: 77,  y: 209, isSig: true },
    signatureDate:             { x: 304, y: 209 },
  },

  'Form RHW34': {
    landlordName:         { x: 112, y: 603 },
    landlordAddress:      { x: 77,  y: 566, maxLines: 2 },
    tenantName:           { x: 366, y: 603 },
    dwellingAddress:      { x: 77,  y: 500, maxLines: 2 },
    introductionDate:     { x: 215, y: 408 },
    introductoryEndDate:  { x: 323, y: 408 },
    extensionReasons:     { x: 77,  y: 368, maxLines: 3 },
    reviewDate:           { x: 316, y: 288 },
    signedBy:             { x: 77,  y: 138, isSig: true },
    signatureDate:        { x: 304, y: 138 },
  },

  'Form RHW35': {
    landlordName:          { x: 112, y: 577 },
    landlordAddress:       { x: 77,  y: 538, maxLines: 2 },
    tenantName:            { x: 366, y: 577 },
    dwellingAddress:       { x: 77,  y: 472, maxLines: 2 },
    conductParticulars:    { x: 77,  y: 415, maxLines: 4 },
    proceedingsNotBefore:  { x: 280, y: 307 },
    proceedingsNotAfter:   { x: 277, y: 270 },
    signedBy:              { x: 77,  y: 126, isSig: true },
    signatureDate:         { x: 304, y: 126 },
  },

  'Form RHW36': {
    landlordName:     { x: 112, y: 589 },
    landlordAddress:  { x: 77,  y: 550, maxLines: 2 },
    tenantName:       { x: 366, y: 589 },
    dwellingAddress:  { x: 77,  y: 480, maxLines: 2 },
    probationEndDate: { x: 205, y: 398 },
    signedBy:         { x: 77,  y: 317, isSig: true },
    signatureDate:    { x: 304, y: 317 },
  },

  'Form RHW37': {
    landlordName:     { x: 112, y: 577 },
    landlordAddress:  { x: 77,  y: 540, maxLines: 2 },
    tenantName:       { x: 366, y: 577 },
    dwellingAddress:  { x: 77,  y: 474, maxLines: 2 },
    probationEndDate: { x: 235, y: 398 },
    extensionReasons: { x: 77,  y: 358, maxLines: 3 },
    reviewDate:       { x: 252, y: 241 },
    signedBy:         { x: 77,  y: 136, isSig: true },
    signatureDate:    { x: 304, y: 136 },
  },

  'Form RHW38': {
    landlordName:    { x: 147, y: 555 },
    landlordAddress: { x: 112, y: 518, maxLines: 2 },
    tenantName:      { x: 391, y: 555 },
    dwellingAddress: { x: 112, y: 448, maxLines: 2 },
    noticeDate:      { x: 188, y: 371 },
    signedBy:        { x: 112, y: 148, isSig: true },
    signatureDate:   { x: 329, y: 148 },
  },
};

/* ─── Checkbox / tick-box definitions ─────────────────────────────────
   Each entry maps a select field key to an array of { keyword, x, y }
   The keyword is matched (case-insensitive) against the select value.
   A ✓ is drawn at (x, y) when matched.
   RHW20's arrearsType is handled separately via ARREARS_BOXES (legacy).
────────────────────────────────────────────────────────────────────── */
type CheckboxEntry = { keyword: string; x: number; y: number; page?: number };

const FORM_CHECKBOXES: Record<string, Record<string, CheckboxEntry[]>> = {

  'Form RHW1': {
    // Tick columns extracted from page content stream (pdf-lib coords, y-up):
    //   Left  tick column: rect x:272.3 w:36.4 → checkmark center x ≈ 286
    //   Right tick column: rect x:496.4 w:29.4 → checkmark center x ≈ 507
    // Row y values (bottom of each row) + row heights used to center vertically.
    schedule3Para: [
      { keyword: 'Paragraph 1',  x: 282, y: 350 },
      { keyword: 'Paragraph 2',  x: 282, y: 320 },
      { keyword: 'Paragraph 3',  x: 282, y: 290 },
      { keyword: 'Paragraph 4',  x: 282, y: 260 },
      // Paragraph 5 is repealed and has no box in the official PDF
      { keyword: 'Paragraph 6',  x: 282, y: 200 },
      { keyword: 'Paragraph 7',  x: 286, y: 170 },
      { keyword: 'Paragraph 8',  x: 282, y: 140 },
      { keyword: 'Paragraph 9',  x: 504, y: 350 },
      { keyword: 'Paragraph 10', x: 504, y: 320 },
      { keyword: 'Paragraph 11', x: 504, y: 290 },
      { keyword: 'Paragraph 12', x: 504, y: 260 },
      { keyword: 'Paragraph 13', x: 504, y: 230 },
      { keyword: 'Paragraph 14', x: 504, y: 200 },
      { keyword: 'Paragraph 15', x: 504, y: 170 },
      { keyword: 'Paragraph 16', x: 504, y: 140 },
    ],
  },

  'Form RHW12': {
    contractType: [
      { keyword: 'Secure',   x: 248, y: 595 },
      { keyword: 'Periodic', x: 248, y: 573 },
    ],
  },

  'Form RHW15': {
    exclusionReason: [
      { keyword: 'violence',   x: 82, y: 403 },
      { keyword: 'significant harm', x: 82, y: 385 },
      { keyword: 'impeding',   x: 82, y: 367 },
      { keyword: 'impedes',    x: 82, y: 367 },
    ],
  },

  'Form RHW19': {
    withdrawalTiming: [
      { keyword: 'Within 28', x: 83, y: 258 },
      { keyword: 'After 28',  x: 83, y: 220 },
    ],
  },

  'Form RHW21': {
    arrearsType: [
      { keyword: 'eight weeks', x: 83, y: 408 },
      { keyword: 'two months',  x: 83, y: 383 },
      { keyword: 'one quarter', x: 83, y: 358 },
      { keyword: '25%',         x: 83, y: 333 },
    ],
  },

  'Form RHW23': {
    possessionGround: [
      { keyword: 'Breach of contract',      x: 83, y: 460 },
      { keyword: 'Estate management',       x: 83, y: 408 },
      { keyword: "failure to give up",      x: 83, y: 300, page: 1 },
    ],
    estateManagementGround: [
      { keyword: 'Ground A', x: 102, y: 390 },
      { keyword: 'Ground B', x: 102, y: 375 },
      { keyword: 'Ground C', x: 102, y: 360 },
      { keyword: 'Ground D', x: 102, y: 345 },
      { keyword: 'Ground E', x: 102, y: 330 },
      { keyword: 'Ground F', x: 102, y: 315 },
      { keyword: 'Ground G', x: 102, y: 300 },
      { keyword: 'Ground H', x: 102, y: 285 },
      { keyword: 'Ground I', x: 102, y: 270 },
    ],
  },

  'Form RHW26': {
    withdrawalTiming: [
      { keyword: 'Within 28', x: 83, y: 263 },
      { keyword: 'After 28',  x: 83, y: 225 },
    ],
  },
};

/* RHW20 arrears checkbox positions (legacy — kept for backwards compat) */
const ARREARS_BOXES: { keyword: string; x: number; y: number }[] = [
  { keyword: 'eight weeks', x: 82, y: 327 },
  { keyword: 'two months',  x: 82, y: 302 },
  { keyword: 'one quarter', x: 82, y: 278 },
  { keyword: '25%',         x: 82, y: 254 },
];

/* ─── Main export ─── */
/* ─── NEW: Returns modified bytes instead of triggering a download ─── */
export async function generateFilledPdfBytes(
  pdfUrl: string,
  data: Record<string, any>,
  formName: string,
): Promise<Uint8Array | null> {
  if (!pdfUrl.toLowerCase().endsWith('.pdf')) {
    return null;
  }

  try {
    const response = await fetch(pdfUrl);
    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    /* Native fields fallback */
    const form = pdfDoc.getForm();
    const nativeFields = form.getFields();
    let filledAny = false;

    if (nativeFields.length > 0) {
      const mapper: Record<string, string[]> = {
        tenantName:      ['tenant_name', 'tenant', 'name_of_tenant', 'contract_holder', 'name'],
        landlordName:    ['landlord_name', 'landlord', 'name_of_landlord'],
        dwellingAddress: ['property_address', 'address', 'dwelling_address'],
        effectiveDate:   ['date', 'effective_date', 'start_date', 'notice_date'],
        landlordAddress: ['landlord_address', 'service_address'],
      };
      for (const [key, value] of Object.entries(data)) {
        if (!value) continue;
        const aliases = mapper[key] || [key];
        for (const alias of aliases) {
          try {
            const f = form.getTextField(alias);
            if (f) { f.setText(value); filledAny = true; break; }
          } catch { }
        }
        if (!filledAny) {
          const partial = nativeFields.find(f =>
            aliases.some(a => f.getName().toLowerCase().includes(a.toLowerCase())),
          );
          if (partial instanceof PDFTextField) {
            partial.setText(value);
            filledAny = true;
          }
        }
      }
    }

    /* Coordinate-based fallback */
    if (!filledAny) {
      const pages       = pdfDoc.getPages();
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const italicFont  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      const numMatch = formName.match(/RHW(\d+)/i);
      const formKey  = numMatch ? `Form RHW${numMatch[1]}` : '';
      const coords   = FORM_COORDS[formKey];
      const checkboxMap = FORM_CHECKBOXES[formKey];

      if (coords) {
        for (const [key, value] of Object.entries(data)) {
          if (!value) continue;

          if (key === 'arrearsType' && formKey === 'Form RHW20') {
            const lower = value.toLowerCase();
            const page0 = pages[0];
            for (const box of ARREARS_BOXES) {
              if (lower.includes(box.keyword)) {
                drawVectorCheckmark(page0, box.x, box.y);
                break;
              }
            }
            continue;
          }

          if (checkboxMap?.[key]) {
            let selections: string[] = [];
            if (Array.isArray(value)) {
              selections = value.map(v => v.toLowerCase().trim());
            } else {
              selections = String(value).toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
            }
            
            const sortedCheckboxes = [...checkboxMap[key]].sort((a, b) => b.keyword.length - a.keyword.length);
            
            // For each distinct selection made by the user, find the best matching checkbox
            for (const selection of selections) {
              for (const box of sortedCheckboxes) {
                if (selection.includes(box.keyword.toLowerCase())) {
                  const pageIndex = box.page ?? 0;
                  const targetPage = pages[pageIndex] ?? pages[0];
                  drawVectorCheckmark(targetPage, box.x, box.y);
                  break; // Found the best match for THIS specific selection
                }
              }
            }
            continue;
          }

          const c = coords[key];
          if (!c) continue;
          const pageIndex  = c.page ?? 0;
          const targetPage = pages[pageIndex] ?? pages[0];
          await drawField(pdfDoc, targetPage, value, c, regularFont, italicFont);
        }
      }
    }

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error in generateFilledPdfBytes:', error);
    return null;
  }
}

export async function fillAndDownloadPDF(
  pdfUrl: string,
  data: Record<string, any>,
  fileName: string,
) {
  const modified = await generateFilledPdfBytes(pdfUrl, data, fileName);
  if (!modified) {
    window.open(pdfUrl, '_blank');
    return;
  }

  const blob = new Blob([new Uint8Array(modified)], { type: 'application/pdf' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  // Use a safer removal method to avoid "removeChild of null" errors
  if (a.parentNode) {
    a.parentNode.removeChild(a);
  } else {
    a.remove();
  }
  URL.revokeObjectURL(url);
}

/* ─── Helpers ─── */

async function drawField(
  pdfDoc: PDFDocument,
  page: PDFPage,
  value: string,
  coord: Coord,
  regularFont: PDFFont,
  italicFont: PDFFont,
) {
  const { x, y, maxLines = 1, isSig = false } = coord;
  const font  = isSig ? italicFont  : regularFont;
  const color = isSig ? rgb(0.05, 0.05, 0.45) : rgb(0.05, 0.05, 0.05);
  const size  = isSig ? 11 : 10;

  /* For signatures: no longer painting over the existing line to avoid cropping borders */

  // Check if value is a base64 signature image
  if (isSig && value.startsWith('data:image/')) {
    try {
      const base64Data = value.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const image = await pdfDoc.embedPng(imageBytes);
      
      // Smaller scale to fit better in tight signature boxes
      const dims = image.scaleToFit(140, 35);
      
      page.drawImage(image, {
        x: x, 
        y: y,
        width: dims.width,
        height: dims.height,
      });
      return;
    } catch (err) {
      console.error('Failed to embed signature image:', err);
      // Fallback to text if image fails
    }
  }

  /* Split into lines (honouring newlines + word-wrap) */
  const lines = splitToLines(value, isSig ? 38 : 48, maxLines);
  for (let i = 0; i < lines.length; i++) {
    page.drawText(lines[i], {
      x,
      y:    y - i * 13,
      size,
      font,
      color,
    });
  }
}

/**
 * Draws a vector checkmark (✓) at the given position using two lines.
 * Avoids the WinAnsi encoding limitation of standard PDF fonts.
 * The mark is ~10 × 8 pt, matching the size of a 12pt "✓" glyph.
 */
function drawVectorCheckmark(page: PDFPage, x: number, y: number) {
  const color = rgb(0.05, 0.05, 0.05);
  const thickness = 1.6;
  const cap = LineCapStyle.Round;
  // Short left stroke: down-left leg of the tick
  page.drawLine({
    start: { x: x,     y: y + 4 },
    end:   { x: x + 3, y: y },
    thickness, color, lineCap: cap,
  });
  // Long right stroke: up-right leg of the tick
  page.drawLine({
    start: { x: x + 3, y: y },
    end:   { x: x + 9, y: y + 8 },
    thickness, color, lineCap: cap,
  });
}

function splitToLines(text: string, maxChars: number, maxLines: number): string[] {
  const out: string[] = [];
  for (const rawLine of text.split('\n')) {
    if (out.length >= maxLines) break;
    if (rawLine.length <= maxChars) {
      out.push(rawLine);
    } else {
      const words = rawLine.split(' ');
      let cur = '';
      for (const word of words) {
        if (out.length >= maxLines) break;
        if (cur.length + word.length + 1 <= maxChars) {
          cur = cur ? `${cur} ${word}` : word;
        } else {
          if (cur) out.push(cur);
          cur = word;
        }
      }
      if (cur && out.length < maxLines) out.push(cur);
    }
  }
  return out;
}
