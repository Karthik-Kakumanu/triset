const fs = require('fs');
const path = require('path');
const { storageDir } = require('../config/paths');

function ensureStorage() {
  fs.mkdirSync(storageDir, { recursive: true });
}

function saveContactSubmission(submission) {
  ensureStorage();
  const file = path.join(storageDir, 'contact-submissions.jsonl');
  fs.appendFileSync(file, `${JSON.stringify(submission)}\n`, 'utf8');
  return { stored: true, file };
}

function readContactSubmissions() {
  ensureStorage();
  const file = path.join(storageDir, 'contact-submissions.jsonl');
  if (!fs.existsSync(file)) return [];

  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
  const submissions = lines.map((line) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      return null;
    }
  }).filter(Boolean);

  return submissions.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

module.exports = { saveContactSubmission, readContactSubmissions };
