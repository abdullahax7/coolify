import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont, PDFTextField } from 'pdf-lib';

/* ─── Types ─── */
type Coord = {
  x: number;
  y: number;
  maxLines?: number;   // how many lines to allow (default 1)
  isSig?: boolean;     // render as italic "e-signature"
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
    signedBy:              { x: 77,  y: 189, isSig: true },
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

  'Form RHW6': {
    headLandlordName:      { x: 112, y: 575 },
    headLandlordAddress:   { x: 77,  y: 536, maxLines: 2 },
    contractHolderName:    { x: 366, y: 575 },
    contractHolderAddress: { x: 311, y: 536, maxLines: 2 },
    subHolderName:         { x: 132, y: 463 },
    subHolderAddress:      { x: 311, y: 450, maxLines: 2 },
    signedBy:              { x: 77,  y: 173, isSig: true },
    signatureDate:         { x: 304, y: 173 },
  },

  'Form RHW7': {
    headLandlordName:    { x: 112, y: 589 },
    headLandlordAddress: { x: 77,  y: 552, maxLines: 2 },
    contractHolderName:  { x: 366, y: 589 },
    subHolderName:       { x: 132, y: 471 },
    subHolderAddress:    { x: 77,  y: 418, maxLines: 2 },
    dwellingAddress:     { x: 311, y: 458, maxLines: 2 },
    signedBy:            { x: 77,  y: 157, isSig: true },
    signatureDate:       { x: 304, y: 157 },
  },

  'Form RHW8': {
    headLandlordName:    { x: 112, y: 603 },
    headLandlordAddress: { x: 77,  y: 564, maxLines: 2 },
    contractHolderName:  { x: 366, y: 603 },
    subHolderName:       { x: 132, y: 491 },
    subHolderAddress:    { x: 77,  y: 452, maxLines: 2 },
    newSubHolderAddress: { x: 311, y: 478, maxLines: 2 },
    signedBy:            { x: 77,  y: 239, isSig: true },
    signatureDate:       { x: 304, y: 239 },
  },

  'Form RHW12': {
    landlordName:    { x: 346, y: 599 },
    landlordAddress: { x: 311, y: 560, maxLines: 2 },
    tenantName:      { x: 132, y: 501 },
    dwellingAddress: { x: 311, y: 488, maxLines: 2 },
    effectiveDate:   { x: 205, y: 408 },
    newRent:         { x: 323, y: 408 },
    currentRent:     { x: 259, y: 371 },
    signedBy:        { x: 77,  y: 241, isSig: true },
    signatureDate:   { x: 304, y: 241 },
  },

  'Form RHW15': {
    landlordName:    { x: 112, y: 553 },
    landlordAddress: { x: 77,  y: 514, maxLines: 2 },
    tenantName:      { x: 346, y: 553 },
    dwellingAddress: { x: 77,  y: 444, maxLines: 2 },
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
    signedBy:        { x: 77,  y: 114, isSig: true },
    signatureDate:   { x: 304, y: 114 },
  },

  'Form RHW19': {
    landlordName:    { x: 112, y: 601 },
    landlordAddress: { x: 77,  y: 564, maxLines: 2 },
    tenantName:      { x: 366, y: 601 },
    dwellingAddress: { x: 77,  y: 496, maxLines: 2 },
    signedBy:        { x: 77,  y: 136, isSig: true },
    signatureDate:   { x: 304, y: 136 },
  },

  'Form RHW20': {
    landlordName:    { x: 112, y: 550 },
    landlordAddress: { x: 77,  y: 512, maxLines: 2 },
    tenantName:      { x: 364, y: 550 },
    dwellingAddress: { x: 77,  y: 442, maxLines: 2 },
    // arrearsType handled specially below via ARREARS_COORDS
    signedBy:        { x: 77,  y: 180, isSig: true },
    signatureDate:   { x: 304, y: 180 },
  },

  'Form RHW21': {
    landlordName:    { x: 118, y: 576 },
    landlordAddress: { x: 83,  y: 539, maxLines: 2 },
    tenantName:      { x: 365, y: 576 },
    dwellingAddress: { x: 83,  y: 469, maxLines: 2 },
    signedBy:        { x: 83,  y:  89, isSig: true },
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
    landlordName:    { x: 112, y: 600 },
    landlordAddress: { x: 77,  y: 563, maxLines: 2 },
    tenantName:      { x: 364, y: 600 },
    dwellingAddress: { x: 77,  y: 493, maxLines: 2 },
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
    headLandlordName:    { x: 112, y: 589 },
    headLandlordAddress: { x: 77,  y: 552, maxLines: 2 },
    contractHolderName:  { x: 366, y: 589 },
    dwellingAddress:     { x: 77,  y: 482, maxLines: 2 },
    breakNoticeDate:     { x: 130, y: 429 },
    signedBy:            { x: 77,  y: 122, isSig: true },
    signatureDate:       { x: 304, y: 122 },
  },

  'Form RHW27': {
    landlordName:    { x: 112, y: 600 },
    landlordAddress: { x: 77,  y: 560, maxLines: 2 },
    tenantName:      { x: 366, y: 600 },
    tenantAddress:   { x: 311, y: 489, maxLines: 2 },
    noticeDate:      { x: 316, y: 354 },
    signedBy:        { x: 77,  y: 128, isSig: true },
    signatureDate:   { x: 304, y: 128 },
  },

  'Form RHW28': {
    landlordName:    { x: 112, y: 579 },
    landlordAddress: { x: 77,  y: 540, maxLines: 2 },
    tenantName:      { x: 366, y: 579 },
    tenantAddress:   { x: 311, y: 468, maxLines: 2 },
    signedBy:        { x: 77,  y: 118, isSig: true },
    signatureDate:   { x: 304, y: 118 },
  },

  'Form RHW29': {
    landlordName:               { x: 112, y: 537 },
    landlordAddress:            { x: 77,  y: 498, maxLines: 2 },
    jointContractHolderName:    { x: 346, y: 537 },
    jointContractHolderAddress: { x: 311, y: 498, maxLines: 2 },
    otherContractHolderNames:   { x: 132, y: 425 },
    dwellingAddress:            { x: 311, y: 412, maxLines: 2 },
  },

  'Form RHW30': {
    landlordName:    { x: 112, y: 551 },
    landlordAddress: { x: 77,  y: 512, maxLines: 2 },
    tenantName:      { x: 346, y: 551 },
    tenantAddress:   { x: 311, y: 426, maxLines: 2 },
    warningDate:     { x: 320, y: 330 },
    signedBy:        { x: 77,  y: 138, isSig: true },
    signatureDate:   { x: 304, y: 138 },
  },

  'Form RHW32': {
    landlordName:    { x: 112, y: 537 },
    landlordAddress: { x: 77,  y: 498, maxLines: 2 },
    tenantName:      { x: 346, y: 537 },
    dwellingAddress: { x: 77,  y: 428, maxLines: 2 },
    signedBy:        { x: 77,  y: 138, isSig: true },
    signatureDate:   { x: 304, y: 138 },
  },

  'Form RHW33': {
    landlordName:       { x: 112, y: 537 },
    landlordAddress:    { x: 77,  y: 498, maxLines: 2 },
    tenantName:         { x: 346, y: 537 },
    jointHolderName:    { x: 132, y: 425 },
    jointHolderAddress: { x: 311, y: 412, maxLines: 2 },
    signedBy:           { x: 77,  y: 209, isSig: true },
    signatureDate:      { x: 304, y: 209 },
  },

  'Form RHW34': {
    landlordName:    { x: 112, y: 603 },
    landlordAddress: { x: 77,  y: 566, maxLines: 2 },
    tenantName:      { x: 366, y: 603 },
    dwellingAddress: { x: 77,  y: 500, maxLines: 2 },
    noticeDate:      { x: 215, y: 408 },
    signedBy:        { x: 77,  y: 138, isSig: true },
    signatureDate:   { x: 304, y: 138 },
  },

  'Form RHW35': {
    landlordName:    { x: 112, y: 577 },
    landlordAddress: { x: 77,  y: 538, maxLines: 2 },
    tenantName:      { x: 366, y: 577 },
    dwellingAddress: { x: 77,  y: 472, maxLines: 2 },
    changeDate:      { x: 280, y: 256 },
    effectiveDate:   { x: 277, y: 219 },
    signedBy:        { x: 77,  y: 126, isSig: true },
    signatureDate:   { x: 304, y: 126 },
  },

  'Form RHW36': {
    landlordName:       { x: 112, y: 589 },
    landlordAddress:    { x: 77,  y: 550, maxLines: 2 },
    tenantName:         { x: 366, y: 589 },
    dwellingAddress:    { x: 77,  y: 480, maxLines: 2 },
    occupationEndDate:  { x: 205, y: 398 },
    signedBy:           { x: 77,  y: 317, isSig: true },
    signatureDate:      { x: 304, y: 317 },
  },

  'Form RHW37': {
    landlordName:    { x: 112, y: 577 },
    landlordAddress: { x: 77,  y: 540, maxLines: 2 },
    tenantName:      { x: 366, y: 577 },
    dwellingAddress: { x: 77,  y: 474, maxLines: 2 },
    noticeDate:      { x: 235, y: 398 },
    decisionDate:    { x: 252, y: 241 },
    signedBy:        { x: 77,  y: 136, isSig: true },
    signatureDate:   { x: 304, y: 136 },
  },

  'Form RHW38': {
    landlordName:    { x: 147, y: 555 },
    landlordAddress: { x: 112, y: 518, maxLines: 2 },
    tenantName:      { x: 391, y: 555 },
    dwellingAddress: { x: 112, y: 448, maxLines: 2 },
    endDate:         { x: 188, y: 371 },
    signedBy:        { x: 112, y: 148, isSig: true },
    signatureDate:   { x: 329, y: 148 },
  },
};

/* RHW20 arrears checkbox positions */
const ARREARS_BOXES: { keyword: string; x: number; y: number }[] = [
  { keyword: 'eight weeks', x: 82, y: 327 },
  { keyword: 'two months',  x: 82, y: 302 },
  { keyword: 'one quarter', x: 82, y: 278 },
  { keyword: '25%',         x: 82, y: 254 },
];

/* ─── Main export ─── */
export async function fillAndDownloadPDF(
  pdfUrl: string,
  data: Record<string, string>,
  fileName: string,
) {
  if (!pdfUrl.toLowerCase().endsWith('.pdf')) {
    window.open(pdfUrl, '_blank');
    return;
  }

  try {
    /* 1. Fetch */
    const response = await fetch(pdfUrl);
    const pdfBytes = await response.arrayBuffer();

    /* 2. Load */
    const pdfDoc = await PDFDocument.load(pdfBytes);

    /* 3. Try native PDF form fields first */
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
          } catch { /* field doesn't exist */ }
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

    /* 4. Coordinate-based drawing fallback */
    if (!filledAny) {
      const page = pdfDoc.getPages()[0];
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const italicFont  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      /* Determine form name from file name */
      const numMatch = fileName.match(/RHW(\d+)/i);
      const formKey  = numMatch ? `Form RHW${numMatch[1]}` : '';
      const coords   = FORM_COORDS[formKey];

      if (coords) {
        /* Draw each field at its exact position */
        for (const [key, value] of Object.entries(data)) {
          if (!value) continue;

          /* RHW20 arrears type → tick appropriate checkbox */
          if (key === 'arrearsType') {
            const lower = value.toLowerCase();
            for (const box of ARREARS_BOXES) {
              if (lower.includes(box.keyword)) {
                page.drawText('✓', {
                  x: box.x, y: box.y,
                  size: 12, font: regularFont,
                  color: rgb(0.05, 0.05, 0.05),
                });
                break;
              }
            }
            continue;
          }

          const c = coords[key];
          if (!c) continue;

          drawField(page, value, c, regularFont, italicFont);
        }
      } else {
        /* Generic fallback: annotate bottom of form instead of top dump */
        const { height } = page.getSize();
        let ty = 60;
        page.drawText('— Submitted Data —', { x: 50, y: ty, size: 8, font: regularFont, color: rgb(0.4, 0.4, 0.4) });
        ty -= 12;
        for (const [key, val] of Object.entries(data)) {
          if (!val) continue;
          page.drawText(`${key}: ${val.substring(0, 70)}`, { x: 50, y: ty, size: 8, font: regularFont, color: rgb(0.2, 0.2, 0.2) });
          ty -= 11;
          if (ty < 10) break;
        }
        void height; // suppress unused var
      }
    }

    /* 5. Save & download */
    const modified = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(modified)], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error filling PDF:', error);
    window.open(pdfUrl, '_blank');
  }
}

/* ─── Helpers ─── */

function drawField(
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

  /* For signatures: paint over the existing dotted line */
  if (isSig) {
    page.drawRectangle({
      x:      x - 1,
      y:      y - 3,
      width:  210,
      height: 15,
      color:  rgb(1, 1, 1),
    });
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
