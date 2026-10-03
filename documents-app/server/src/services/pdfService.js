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
function text(page, value, x, y, size, font, color = BLACK, maxWidth = 500) { page.drawText(String(value ?? ''), { x, y, size, font, color, maxWidth }); }
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

export async function createBusinessPdf(document, settings = {}) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage(A4);
  const [width, height] = A4;
  let logo;
  try { logo = await pdf.embedPng(await fs.readFile(logoPath)); } catch { logo = null; }
  page.drawRectangle({ x: 0, y: height - 86, width, height: 86, color: MAROON });
  const companyName = settings.companyName ?? '';
  const address = settings.address ?? '';
  const email = settings.email ?? '';
  const phone = settings.phone ?? '';
  const gstRate = settings.defaultGstRate ?? 0;
  const logoHeight = 34;
  const logoWidth = logo ? logoHeight * logo.width / logo.height : 0;
  const headerTextX = 42 + logoWidth + 18;
  if (logo) page.drawImage(logo, { x: 42, y: height - 64, width: logoWidth, height: logoHeight });
  fittedText(page, companyName, headerTextX, height - 45, 13, bold, 205, WHITE);
  text(page, 'Business document', headerTextX, height - 64, 9, regular, WHITE);
  text(page, String(document.title || document.type || 'BUSINESS DOCUMENT').toUpperCase(), 395, height - 45, 11, bold, WHITE);
  text(page, document.number || 'DRAFT', 437, height - 63, 9, regular, WHITE);
  text(page, companyName, 42, height - 122, 10, bold);
  const addressLineCount = wrappedText(page, address, 42, height - 137, 8.5, regular, 270, 11);
  const contactY = height - 137 - addressLineCount * 11 - 4;
  text(page, `${email}  |  ${phone}`, 42, contactY, 8.5, regular);
  const detailsLineY = contactY - 12;
  line(page, 42, detailsLineY, width - 84, 2);
  const billLabelY = detailsLineY - 26;
  text(page, 'BILL TO', 42, billLabelY, 8, bold);
  text(page, document.party || 'Client / employee', 42, billLabelY - 16, 11, bold);
  text(page, 'DOCUMENT DATE', 380, billLabelY, 8, bold);
  text(page, document.date || new Date().toISOString().slice(0, 10), 380, billLabelY - 16, 10, regular);
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
  text(page, 'SUBTOTAL', 380, totalY, 8, bold); text(page, money(subtotal), 482, totalY, 9, regular);
  text(page, `GST (${appliedGstRate}%)`, 380, totalY - 18, 8, bold); text(page, money(total - subtotal), 482, totalY - 18, 9, regular);
  line(page, 370, totalY - 31, 183, 1.5); text(page, 'TOTAL', 380, totalY - 50, 10, bold); text(page, money(total), 472, totalY - 50, 10, bold);
  text(page, 'NOTE', 42, 150, 8, bold);
  wrappedText(page, document.notes || DEFAULT_NOTE, 42, 135, 9, regular, 300, 12);
  text(page, 'AUTHORISED SIGNATORY', 420, 150, 8, bold); line(page, 420, 112, 125, .7); fittedText(page, `For ${companyName}`, 420, 97, 8, regular, 125);
  text(page, 'Page 1 of 1', 480, 35, 8, regular);
  await fs.mkdir(config.pdfStoragePath, { recursive: true });
  const bytes = await pdf.save();
  const filename = `${String(document.number || 'document').replace(/[^a-z0-9_-]/gi, '_')}.pdf`;
  const filePath = path.join(config.pdfStoragePath, filename);
  await fs.writeFile(filePath, bytes);
  return { filename, filePath, bytes };
}
