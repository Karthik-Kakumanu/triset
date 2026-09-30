import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { config } from '../config.js';

const MAROON = rgb(11 / 255, 102 / 255, 255 / 255);
const WHITE = rgb(1, 1, 1);
const A4 = [595.28, 841.89];

function line(page, x, y, width, thickness = 1) { page.drawRectangle({ x, y, width, height: thickness, color: MAROON }); }
function text(page, value, x, y, size, font, color = MAROON) { page.drawText(String(value ?? ''), { x, y, size, font, color, maxWidth: 500 }); }
function money(value) { return `INR ${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`; }

export async function createBusinessPdf(document) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage(A4);
  const [width, height] = A4;
  page.drawRectangle({ x: 0, y: height - 86, width, height: 86, color: MAROON });
  text(page, 'TRISET', 42, height - 52, 25, bold, WHITE);
  text(page, 'Solutions India Private Limited', 42, height - 68, 9, regular, WHITE);
  text(page, String(document.title || document.type || 'BUSINESS DOCUMENT').toUpperCase(), 395, height - 45, 11, bold, WHITE);
  text(page, document.number || 'DRAFT', 437, height - 63, 9, regular, WHITE);
  text(page, 'TRISET Solutions India Private Limited', 42, height - 122, 10, bold);
  text(page, 'Flat No. 201, Plot No.851, Ramakrishnapuram, Pragatinagar', 42, height - 137, 8.5, regular);
  text(page, 'Hyderabad, Telangana, India - 500090  |  info@trisetsolutions.com  |  7416612292', 42, height - 151, 8.5, regular);
  line(page, 42, height - 174, width - 84, 2);
  text(page, 'BILL TO', 42, height - 200, 8, bold);
  text(page, document.party || 'Client / employee', 42, height - 216, 11, bold);
  text(page, document.address || 'Address to be configured', 42, height - 232, 9, regular);
  text(page, 'DOCUMENT DATE', 380, height - 200, 8, bold);
  text(page, document.date || new Date().toISOString().slice(0, 10), 380, height - 216, 10, regular);
  text(page, 'REFERENCE', 380, height - 242, 8, bold);
  text(page, document.reference || 'Not provided', 380, height - 258, 10, regular);
  const tableY = height - 304;
  page.drawRectangle({ x: 42, y: tableY, width: width - 84, height: 27, color: MAROON });
  text(page, 'DESCRIPTION', 52, tableY + 9, 8, bold, WHITE);
  text(page, 'QTY', 340, tableY + 9, 8, bold, WHITE);
  text(page, 'RATE', 395, tableY + 9, 8, bold, WHITE);
  text(page, 'AMOUNT', 482, tableY + 9, 8, bold, WHITE);
  const items = document.items?.length ? document.items : [{ description: 'Professional services', quantity: 1, rate: document.amount || 100000 }];
  items.slice(0, 12).forEach((item, index) => { const y = tableY - 25 - index * 27; line(page, 42, y - 8, width - 84, .5); text(page, item.description || 'Service item', 52, y, 9, regular); text(page, item.quantity || 1, 344, y, 9, regular); text(page, money(item.rate), 395, y, 9, regular); text(page, money((item.quantity || 1) * (item.rate || 0)), 482, y, 9, regular); });
  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 1) * Number(item.rate || 0), 0);
  const total = subtotal + subtotal * Number(document.gstRate || 18) / 100;
  const totalY = tableY - 60 - Math.min(items.length, 12) * 27;
  text(page, 'SUBTOTAL', 380, totalY, 8, bold); text(page, money(subtotal), 482, totalY, 9, regular);
  text(page, `GST (${document.gstRate || 18}%)`, 380, totalY - 18, 8, bold); text(page, money(total - subtotal), 482, totalY - 18, 9, regular);
  line(page, 370, totalY - 31, 183, 1.5); text(page, 'TOTAL', 380, totalY - 50, 10, bold); text(page, money(total), 472, totalY - 50, 10, bold);
  text(page, 'BANK DETAILS', 42, 150, 8, bold); text(page, 'Bank details are editable in Company Settings.', 42, 135, 9, regular);
  text(page, 'AUTHORISED SIGNATORY', 420, 150, 8, bold); line(page, 420, 112, 125, .7); text(page, 'For TRISET Solutions India Private Limited', 350, 97, 8, regular);
  text(page, 'Page 1 of 1', 480, 35, 8, regular);
  await fs.mkdir(config.pdfStoragePath, { recursive: true });
  const bytes = await pdf.save();
  const filename = `${String(document.number || 'document').replace(/[^a-z0-9_-]/gi, '_')}.pdf`;
  const filePath = path.join(config.pdfStoragePath, filename);
  await fs.writeFile(filePath, bytes);
  return { filename, filePath, bytes };
}
