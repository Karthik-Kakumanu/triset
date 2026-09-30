import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { config } from '../config.js';

const MAROON = rgb(128 / 255, 0, 0);
const BLACK = rgb(0, 0, 0);
const GREY = rgb(0.35, 0.35, 0.35);
const LIGHT_GREY = rgb(0.9, 0.9, 0.9);
const WHITE = rgb(1, 1, 1);
const A4 = [595.28, 841.89];
const MARGIN = 42;
const logoPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../client/public/logo_final.png');

function money(value) { return 'INR ' + Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }); }
function safe(value, fallback = '') { return String(value ?? fallback); }
function wrap(value, font, size, maxWidth) {
  const words = safe(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) { lines.push(current); current = word; } else current = candidate;
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}
function drawText(page, value, x, y, size, font, color = BLACK) { page.drawText(safe(value), { x, y, size, font, color }); }
function drawFitted(page, value, x, y, size, font, maxWidth, color = BLACK) {
  let fitted = size;
  while (fitted > 7 && font.widthOfTextAtSize(safe(value), fitted) > maxWidth) fitted -= 0.5;
  drawText(page, value, x, y, fitted, font, color);
}
function drawWrapped(page, value, x, y, size, font, maxWidth, lineHeight = size + 3, color = BLACK) {
  const lines = wrap(value, font, size, maxWidth);
  lines.forEach((item, index) => drawText(page, item, x, y - index * lineHeight, size, font, color));
  return lines.length;
}
function drawRule(page, x, y, width, thickness = 1, color = MAROON) { page.drawRectangle({ x, y, width, height: thickness, color }); }
function drawLabel(page, label, value, x, y, fonts, maxWidth = 220) {
  drawText(page, String(label).toUpperCase(), x, y, 7.5, fonts.bold, MAROON);
  drawWrapped(page, value, x, y - 14, 9, fonts.regular, maxWidth, 11, BLACK);
}
function drawHeader(page, document, settings, logo, fonts) {
  const [width, height] = A4;
  page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: MAROON });
  if (logo) {
    const dimensions = logo.scale(1);
    const logoHeight = 34;
    const logoWidth = Math.min(135, logoHeight * dimensions.width / dimensions.height);
    page.drawImage(logo, { x: MARGIN, y: height - 63, width: logoWidth, height: logoHeight });
  }
  drawFitted(page, settings.companyName || '', 190, height - 42, 13, fonts.bold, 235, WHITE);
  drawText(page, 'Business document', 190, height - 61, 8.5, fonts.regular, WHITE);
  drawFitted(page, safe(document.title || document.type || 'Business document').toUpperCase(), 405, height - 39, 10, fonts.bold, 145, WHITE);
  drawFitted(page, document.number || 'DRAFT', 405, height - 57, 9, fonts.regular, 145, WHITE);
}
function drawFooter(page, pageNumber, pageCount, settings, fonts) {
  const [width] = A4;
  drawRule(page, MARGIN, 53, width - MARGIN * 2, 0.7, LIGHT_GREY);
  const footer = [settings.companyName, settings.email, settings.phone].filter(Boolean).join('  |  ');
  drawFitted(page, footer, MARGIN, 38, 7.5, fonts.regular, width - 130, GREY);
  drawText(page, 'Page ' + pageNumber + ' of ' + pageCount, width - 105, 38, 7.5, fonts.regular, GREY);
}
function normalizeItems(document) {
  if (Array.isArray(document.items) && document.items.length) return document.items;
  return [{ description: document.description || 'Service item', quantity: document.quantity ?? 1, rate: document.rate ?? document.amount ?? 0 }];
}
function drawTableHeader(page, y, fonts, withTaxColumns = false) {
  const columns = withTaxColumns ? [['DESCRIPTION', 52], ['HSN/SAC', 280], ['QTY', 350], ['RATE', 402], ['AMOUNT', 486]] : [['DESCRIPTION', 52], ['QTY', 350], ['RATE', 405], ['AMOUNT', 486]];
  page.drawRectangle({ x: MARGIN, y, width: A4[0] - MARGIN * 2, height: 25, color: MAROON });
  columns.forEach(([label, x]) => drawText(page, label, x, y + 8, 7.5, fonts.bold, WHITE));
}
function drawItemRow(page, item, y, fonts, withTaxColumns = false) {
  const descriptionWidth = withTaxColumns ? 215 : 280;
  const lines = wrap(item.description || 'Service item', fonts.regular, 8.5, descriptionWidth);
  const rowHeight = Math.max(24, lines.length * 11 + 10);
  lines.forEach((lineText, index) => drawText(page, lineText, 52, y - index * 11, 8.5, fonts.regular, BLACK));
  const quantity = Number(item.quantity || 0);
  const rate = Number(item.rate || 0);
  if (withTaxColumns) {
    drawText(page, item.hsnSac || item.hsn || item.sac || '', 280, y, 8.5, fonts.regular, BLACK);
    drawText(page, quantity, 354, y, 8.5, fonts.regular, BLACK);
    drawText(page, money(rate), 402, y, 8.5, fonts.regular, BLACK);
    drawText(page, money(quantity * rate), 486, y, 8.5, fonts.regular, BLACK);
  } else {
    drawText(page, quantity, 354, y, 8.5, fonts.regular, BLACK);
    drawText(page, money(rate), 405, y, 8.5, fonts.regular, BLACK);
    drawText(page, money(quantity * rate), 486, y, 8.5, fonts.regular, BLACK);
  }
  drawRule(page, MARGIN, y - rowHeight + 5, A4[0] - MARGIN * 2, 0.5, LIGHT_GREY);
  return rowHeight;
}
function drawTotals(page, y, subtotal, gstRate, fonts) {
  const tax = subtotal * Number(gstRate || 0) / 100;
  const total = subtotal + tax;
  drawLabel(page, 'Subtotal', money(subtotal), 382, y, fonts, 120);
  drawLabel(page, 'GST (' + (gstRate || 0) + '%)', money(tax), 382, y - 28, fonts, 120);
  drawRule(page, 370, y - 56, 183, 1.4, MAROON);
  drawText(page, 'TOTAL', 382, y - 76, 9.5, fonts.bold, MAROON);
  drawText(page, money(total), 472, y - 76, 10, fonts.bold, MAROON);
  return total;
}
function drawAdditionalSections(page, document, settings, y, fonts) {
  let cursor = y;
  const notes = document.notes || document.terms || document.paymentTerms;
  if (notes) {
    drawLabel(page, 'Notes / terms', notes, MARGIN, cursor, fonts, 510);
    cursor -= Math.max(32, wrap(notes, fonts.regular, 8.5, 510).length * 11 + 24);
  }
  drawLabel(page, 'Bank details', [settings.bankName, settings.accountName, settings.accountNumber, settings.ifsc, settings.branch].filter(Boolean).join('  | '), MARGIN, cursor, fonts, 330);
  drawLabel(page, 'Authorised signatory', settings.authorisedSignatory || '', 410, cursor, fonts, 140);
}

export async function createBusinessPdf(document, settings = {}) {
  const pdf = await PDFDocument.create();
  const fonts = { regular: await pdf.embedFont(StandardFonts.Helvetica), bold: await pdf.embedFont(StandardFonts.HelveticaBold) };
  let logo = null;
  try { logo = await pdf.embedPng(await fs.readFile(logoPath)); } catch { logo = null; }
  const pages = [];
  const addPage = () => { const page = pdf.addPage(A4); pages.push(page); return page; };
  let page = addPage();
  const [width, height] = A4;
  drawHeader(page, document, settings, logo, fonts);
  const addressLines = wrap(settings.address || '', fonts.regular, 8.5, 315);
  drawText(page, settings.companyName || '', MARGIN, height - 123, 10, fonts.bold, BLACK);
  addressLines.forEach((lineText, index) => drawText(page, lineText, MARGIN, height - 138 - index * 11, 8.5, fonts.regular, BLACK));
  const contactY = height - 138 - addressLines.length * 11 - 3;
  drawText(page, [settings.email, settings.phone].filter(Boolean).join('  |  '), MARGIN, contactY, 8.5, fonts.regular, BLACK);
  drawRule(page, MARGIN, contactY - 14, width - MARGIN * 2, 1.6, MAROON);
  const metaY = contactY - 43;
  drawLabel(page, 'Bill to', document.party || 'Client / employee', MARGIN, metaY, fonts, 275);
  drawWrapped(page, document.address || 'Address to be configured', MARGIN, metaY - 28, 8.5, fonts.regular, 275, 11, BLACK);
  drawLabel(page, 'Document date', document.date || new Date().toISOString().slice(0, 10), 385, metaY, fonts, 165);
  drawLabel(page, 'Reference', document.reference || 'Not provided', 385, metaY - 42, fonts, 165);
  const items = normalizeItems(document);
  const withTaxColumns = items.some((item) => item.hsnSac || item.hsn || item.sac);
  let tableY = metaY - 98;
  drawTableHeader(page, tableY, fonts, withTaxColumns);
  let cursor = tableY - 34;
  items.forEach((item) => {
    const expected = Math.max(24, wrap(item.description || 'Service item', fonts.regular, 8.5, withTaxColumns ? 215 : 280).length * 11 + 10);
    if (cursor - expected < 105) {
      page = addPage();
      drawHeader(page, document, settings, logo, fonts);
      drawText(page, 'CONTINUED', MARGIN, height - 116, 8, fonts.bold, MAROON);
      tableY = height - 140;
      drawTableHeader(page, tableY, fonts, withTaxColumns);
      cursor = tableY - 34;
    }
    cursor -= drawItemRow(page, item, cursor, fonts, withTaxColumns);
  });
  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0), 0);
  if (cursor < 220) {
    page = addPage();
    drawHeader(page, document, settings, logo, fonts);
    cursor = height - 130;
  }
  const total = drawTotals(page, cursor - 5, subtotal, document.gstRate ?? settings.defaultGstRate ?? 0, fonts);
  drawText(page, 'Amount summary', MARGIN, cursor - 5, 8, fonts.bold, MAROON);
  drawText(page, 'Total payable: ' + money(total), MARGIN, cursor - 23, 9, fonts.bold, BLACK);
  drawAdditionalSections(page, document, settings, cursor - 75, fonts);
  pages.forEach((currentPage, index) => drawFooter(currentPage, index + 1, pages.length, settings, fonts));
  await fs.mkdir(config.pdfStoragePath, { recursive: true });
  const bytes = await pdf.save();
  const filename = String(document.number || 'document').replace(/[^a-z0-9_-]/gi, '_') + '.pdf';
  const filePath = path.join(config.pdfStoragePath, filename);
  await fs.writeFile(filePath, bytes);
  return { filename, filePath, bytes };
}
