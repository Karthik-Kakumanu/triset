import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { config } from '../config.js';

const MAROON = rgb(11 / 255, 102 / 255, 255 / 255);
const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);
const A4 = [595.28, 841.89];
const logoPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../client/public/logo_final.png');
const DEFAULT_NOTE = 'Payment Terms: 50% advance to start the project and 50% before final deployment.';

function line(page, x, y, width, thickness = 1) { page.drawRectangle({ x, y, width, height: thickness, color: MAROON }); }
function coloredLine(page, x, y, width, thickness, color) { page.drawRectangle({ x, y, width, height: thickness, color }); }
function text(page, value, x, y, size, font, color = BLACK, maxWidth = 500) { page.drawText(String(value ?? ''), { x, y, size, font, color, maxWidth }); }
function rightText(page, value, right, y, size, font, color = BLACK) { const content = String(value ?? ''); text(page, content, right - font.widthOfTextAtSize(content, size), y, size, font, color); }
function fittedText(page, value, x, y, size, font, maxWidth, color = BLACK) { let fitted = size; while (fitted > 7 && font.widthOfTextAtSize(String(value ?? ''), fitted) > maxWidth) fitted -= 0.5; text(page, value, x, y, fitted, font, color, maxWidth); }
function wrappedText(page, value, x, y, size, font, maxWidth, lineHeight = size + 3, color = MAROON) {
  const words = String(value ?? '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) { lines.push(current); current = word; } else current = candidate;
  }
  if (current) lines.push(current);
  lines.forEach((item, index) => text(page, item, x, y - index * lineHeight, size, font, color));
  return lines.length || 1;
}
function money(value) { return `INR ${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`; }
function quotationDate(value) {
  const date = new Date(`${value || new Date().toISOString().slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? String(value || '') : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export async function createBusinessPdf(document, settings = {}) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage(A4);
  const [width, height] = A4;
  let logo;
  try { logo = await pdf.embedPng(await fs.readFile(logoPath)); } catch { logo = null; }
  const companyName = settings.companyName ?? '';
  const address = settings.address ?? '';
  const email = settings.email ?? '';
  const phone = settings.phone ?? '';
  const gstRate = settings.defaultGstRate ?? 0;
  const isQuotation = String(document.type || document.title || '').toLowerCase() === 'quotation';
  const documentKind = String(document.type || document.title || '').toLowerCase();
  const isInvoice = documentKind === 'invoice' || documentKind === 'tax invoice';
  const isPurchaseOrder = documentKind === 'purchase-order' || documentKind === 'purchase order';
  const isPayslip = documentKind === 'payslip';
  const logoHeight = 34;
  const logoWidth = logo ? logoHeight * logo.width / logo.height : 0;
  const headerTextX = 42 + logoWidth + 18;

  if (isQuotation || isInvoice || isPurchaseOrder || isPayslip) {
    const ink = rgb(24 / 255, 40 / 255, 65 / 255);
    const blue = rgb(18 / 255, 100 / 255, 232 / 255);
    const muted = rgb(103 / 255, 118 / 255, 138 / 255);
    const pale = rgb(244 / 255, 247 / 255, 252 / 255);
    const border = rgb(205 / 255, 220 / 255, 241 / 255);
    const amount = (value) => Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const quotationItems = (document.items?.length ? document.items : [{ description: document.description || 'Service item', quantity: document.quantity ?? 1, rate: document.amount ?? 0 }]).slice(0, 3);
    const subtotal = quotationItems.reduce((sum, item) => sum + Number(item.quantity || 1) * Number(item.rate || 0), 0);
    const appliedGstRate = Number(document.gstRate ?? gstRate);
    const total = subtotal + subtotal * appliedGstRate / 100;

    if (logo) page.drawImage(logo, { x: 45, y: 748, width: 170, height: 44 });
    const documentTitle = isInvoice ? 'TAX INVOICE' : isPurchaseOrder ? 'PURCHASE ORDER' : isPayslip ? 'PAYSLIP' : 'QUOTATION';
    const documentSubject = document.subject || (isInvoice ? 'Business Services' : isPurchaseOrder ? 'Supply Order' : isPayslip ? 'Salary Statement' : 'Website Development');
    const recipientLabel = isInvoice ? 'BILL TO' : isPurchaseOrder ? 'VENDOR / SUPPLIER' : isPayslip ? 'EMPLOYEE' : 'QUOTATION FOR';
    text(page, documentTitle, 350, 776, 14, bold, ink);
    fittedText(page, String(documentSubject).toUpperCase(), 350, 757, 8, regular, 200, blue);
    coloredLine(page, 45, 730, 505, 1.7, blue);
    text(page, companyName, 45, 702, 10, bold, ink);
    const addressText = String(address || '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
    const addressLineCount = addressText.length
      ? addressText.slice(0, 2).reduce((count, value, index) => count + wrappedText(page, value, 45, 682 - index * 12, 8, regular, 365, 12, muted), 0)
      : 0;
    text(page, `${email} | ${phone}`, 45, 658 - Math.max(0, addressLineCount - 2) * 12, 8, regular, muted);
    text(page, 'DOCUMENT DATE', 416, 704, 7.3, bold, muted);
    text(page, quotationDate(document.date), 416, 686, 9, regular, ink);
    text(page, 'REFERENCE', 416, 665, 7.3, bold, muted);
    text(page, document.reference || 'Not provided', 416, 649, 8, regular, blue);

    page.drawRectangle({ x: 45, y: 558, width: 505, height: 62, color: pale, borderColor: border, borderWidth: .5 });
    text(page, recipientLabel, 58, 601, 7.3, bold, muted);
    fittedText(page, document.party || (isPayslip ? 'Employee' : isPurchaseOrder ? 'Supplier' : 'Client'), 58, 575, 12, bold, 430, ink);

    page.drawRectangle({ x: 45, y: 507, width: 505, height: 28, color: blue });
    text(page, 'DESCRIPTION', 57, 519, 7.5, bold, WHITE);
    text(page, 'QTY', 351, 519, 7.5, bold, WHITE);
    text(page, 'RATE', 400, 519, 7.5, bold, WHITE);
    text(page, 'AMOUNT', 485, 519, 7.5, bold, WHITE);
    quotationItems.forEach((item, index) => {
      const y = 482 - index * 49;
      coloredLine(page, 45, y - 24, 505, .5, border);
      fittedText(page, item.description || 'Service item', 57, y, 9, regular, 270, ink);
      text(page, item.quantity || 1, 361, y, 9, regular, ink);
      rightText(page, amount(item.rate), 470, y + 3, 9, regular, ink);
      rightText(page, amount(Number(item.quantity || 1) * Number(item.rate || 0)), 550, y + 3, 9, regular, ink);
    });

    text(page, isPayslip ? 'Payroll amounts in INR' : 'All amounts in INR', 45, 340, 7.5, regular, muted);
    text(page, 'SUBTOTAL', 347, 324, 8, bold, muted);
    rightText(page, `INR ${amount(subtotal)}`, 550, 319, 10, regular, ink);
    coloredLine(page, 339, 307, 211, 1, blue);
    text(page, 'TOTAL', 347, 286, 10, bold, blue);
    rightText(page, `INR ${amount(total)}`, 550, 281, 13, bold, ink);
    text(page, 'Before applicable taxes, if any.', 347, 264, 7.5, regular, muted);

    const noteLabel = isInvoice ? 'NOTES' : isPurchaseOrder ? 'DELIVERY NOTE' : isPayslip ? 'PAYROLL NOTE' : 'SERVICE NOTE';
    const noteText = document.serviceNote || document.notes || (isInvoice ? 'Thank you for your business.' : isPurchaseOrder ? 'Delivery details to be confirmed with the supplier.' : isPayslip ? 'This document is confidential and intended for the named employee.' : 'Service details to be confirmed with the client.');
    text(page, noteLabel, 45, 258, 8, bold, blue);
    wrappedText(page, noteText, 45, 236, 9, regular, 505, 12, ink);

    page.drawRectangle({ x: 45, y: 102, width: 505, height: 88, color: pale, borderColor: border, borderWidth: .5 });
    page.drawLine({ start: { x: 345, y: 102 }, end: { x: 345, y: 190 }, thickness: .5, color: border });
    const termsLabel = isInvoice ? 'PAYMENT TERMS' : isPurchaseOrder ? 'ORDER TERMS' : isPayslip ? 'PAYROLL PERIOD' : 'PAYMENT TERMS';
    const termsText = document.paymentTerms || (isPayslip ? (document.date || 'Current pay period') : DEFAULT_NOTE.replace('Payment Terms: ', ''));
    text(page, termsLabel, 58, 168, 8, bold, ink);
    wrappedText(page, termsText, 58, 147, 9, regular, 270, 13.5, muted);
    text(page, 'AUTHORISED SIGNATORY', 360, 168, 7.5, bold, muted);
    // Keep the signatory name blank in quotation-style documents.
    text(page, '', 360, 138, 10, regular, muted);
    wrappedText(page, `For ${companyName}`, 360, 122, 7.5, regular, 150, 11.25, muted);
    const closingText = isInvoice ? 'Thank you for your business.' : isPurchaseOrder ? 'Thank you for your order.' : isPayslip ? 'This payslip is confidential.' : 'Thank you for considering Triset Solutions for your project.';
    text(page, closingText, 45, 78, 7.5, regular, muted);
    page.drawRectangle({ x: 45, y: 46, width: 505, height: 23, color: pale });
    text(page, 'Triset Solutions India Pvt Ltd | Confidential - For Official Use Only', 79, 55, 7, regular, muted);
    await fs.mkdir(config.pdfStoragePath, { recursive: true });
    const bytes = await pdf.save();
    const filename = `${String(document.number || 'document').replace(/[^a-z0-9_-]/gi, '_')}.pdf`;
    const filePath = path.join(config.pdfStoragePath, filename);
    await fs.writeFile(filePath, bytes);
    return { filename, filePath, bytes };
  }

  page.drawRectangle({ x: 0, y: height - 86, width, height: 86, color: MAROON });
  if (logo) page.drawImage(logo, { x: 42, y: height - 64, width: logoWidth, height: logoHeight });
  fittedText(page, companyName, headerTextX, height - 45, 13, bold, 205, WHITE);
  text(page, 'Business document', headerTextX, height - 64, 9, regular, WHITE);
  text(page, isQuotation ? 'QUOTATION' : String(document.title || document.type || 'BUSINESS DOCUMENT').toUpperCase(), 395, height - 45, 11, bold, WHITE);
  text(page, document.number || 'DRAFT', 437, height - 63, 9, regular, WHITE);
  if (isQuotation) fittedText(page, document.subject || 'Website Development', 395, height - 78, 8.5, regular, 155, WHITE);
  text(page, companyName, 42, height - 122, 10, bold);
  const addressLineCount = wrappedText(page, address, 42, height - 137, 8.5, regular, 270, 11);
  const contactY = height - 137 - addressLineCount * 11 - 4;
  text(page, `${email}  |  ${phone}`, 42, contactY, 8.5, regular);
  const detailsLineY = contactY - 12;
  line(page, 42, detailsLineY, width - 84, 2);
  const billLabelY = detailsLineY - 26;
  text(page, isQuotation ? 'QUOTATION FOR' : 'BILL TO', 42, billLabelY, 8, bold);
  text(page, document.party || 'Client / employee', 42, billLabelY - 16, 11, bold);
  text(page, 'DOCUMENT DATE', 380, billLabelY, 8, bold);
  text(page, isQuotation ? quotationDate(document.date) : (document.date || new Date().toISOString().slice(0, 10)), 380, billLabelY - 16, 10, regular);
  text(page, 'REFERENCE', 380, billLabelY - 42, 8, bold);
  text(page, document.reference || 'Not provided', 380, billLabelY - 58, 10, regular);
  const tableY = billLabelY - 104;
  page.drawRectangle({ x: 42, y: tableY, width: width - 84, height: 27, color: MAROON });
  text(page, 'DESCRIPTION', 52, tableY + 9, 8, bold, WHITE);
  text(page, 'QTY', 340, tableY + 9, 8, bold, WHITE);
  text(page, 'RATE', 395, tableY + 9, 8, bold, WHITE);
  text(page, 'AMOUNT', 482, tableY + 9, 8, bold, WHITE);
  const items = document.items?.length ? document.items : [{ description: document.description || 'Service item', quantity: document.quantity ?? 1, rate: document.amount ?? 0 }];
  items.slice(0, 12).forEach((item, index) => { const y = tableY - 25 - index * 27; line(page, 42, y - 8, width - 84, .5); text(page, item.description || 'Service item', 52, y, 9, regular); text(page, item.quantity || 1, 344, y, 9, regular); text(page, money(item.rate), 395, y, 9, regular); text(page, money((item.quantity || 1) * (item.rate || 0)), 482, y, 9, regular); });
  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 1) * Number(item.rate || 0), 0);
  const appliedGstRate = document.gstRate ?? gstRate;
  const total = subtotal + subtotal * Number(appliedGstRate) / 100;
  const totalY = tableY - 60 - Math.min(items.length, 12) * 27;
  if (isQuotation) text(page, 'All amounts in INR', 42, totalY - 2, 8, regular);
  text(page, 'SUBTOTAL', 380, totalY, 8, bold); text(page, money(subtotal), 482, totalY, 9, regular);
  text(page, `GST (${appliedGstRate}%)`, 380, totalY - 18, 8, bold); text(page, money(total - subtotal), 482, totalY - 18, 9, regular);
  line(page, 370, totalY - 31, 183, 1.5); text(page, 'TOTAL', 380, totalY - 50, 10, bold); text(page, money(total), 472, totalY - 50, 10, bold);
  if (isQuotation) {
    text(page, 'SERVICE NOTE', 42, 275, 8, bold);
    wrappedText(page, document.serviceNote || document.notes || 'Service details to be confirmed with the client.', 42, 260, 9, regular, 300, 12);
    text(page, 'PAYMENT TERMS', 42, 215, 8, bold);
    wrappedText(page, document.paymentTerms || DEFAULT_NOTE.replace('Payment Terms: ', ''), 42, 200, 9, regular, 300, 12);
  } else {
    text(page, 'NOTE', 42, 150, 8, bold);
    wrappedText(page, document.notes || DEFAULT_NOTE, 42, 135, 9, regular, 300, 12);
  }
  text(page, 'AUTHORISED SIGNATORY', 420, 150, 8, bold); line(page, 420, 112, 125, .7); fittedText(page, `For ${companyName}`, 420, 97, 8, regular, 125);
  text(page, 'Page 1 of 1', 480, 35, 8, regular);
  if (isQuotation) text(page, 'Thank you for considering TRISET Solutions for your project.', 42, 55, 8, regular);
  await fs.mkdir(config.pdfStoragePath, { recursive: true });
  const bytes = await pdf.save();
  const filename = `${String(document.number || 'document').replace(/[^a-z0-9_-]/gi, '_')}.pdf`;
  const filePath = path.join(config.pdfStoragePath, filename);
  await fs.writeFile(filePath, bytes);
  return { filename, filePath, bytes };
}
