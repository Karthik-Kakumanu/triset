function hasSmtpConfig() {
  const required = [process.env.EMAIL_HOST, process.env.EMAIL_PORT, process.env.EMAIL_USER, process.env.EMAIL_PASSWORD];
  const recipient = process.env.CONTACT_RECEIVER || process.env.EMAIL_USER || process.env.EMAIL_FROM;
  return Boolean(required.every(Boolean) && recipient);
}

async function sendContactEmail(submission) {
  if (!hasSmtpConfig()) {
    return { sent: false, reason: 'smtp_not_configured' };
  }

  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch (error) {
    return { sent: false, reason: 'nodemailer_not_installed' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: String(process.env.EMAIL_SECURE || '').toLowerCase() === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.CONTACT_RECEIVER || process.env.EMAIL_USER,
    replyTo: submission.email,
    subject: `TRISET website inquiry: ${submission.service || 'General'}`,
    text: [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Phone: ${submission.phone || '-'}`,
      `Company: ${submission.company || '-'}`,
      `Service: ${submission.service || '-'}`,
      '',
      submission.message,
    ].join('\n'),
  });

  return { sent: true };
}

async function sendJobPostedEmail(job) {
  if (!job || !hasSmtpConfig()) {
    return { sent: false, reason: 'smtp_not_configured' };
  }

  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch (error) {
    return { sent: false, reason: 'nodemailer_not_installed' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: String(process.env.EMAIL_SECURE || '').toLowerCase() === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const toAddress = process.env.CONTACT_RECEIVER || process.env.EMAIL_USER;
  const subject = `New TRISET job posted: ${job.title}`;
  const text = [
    'A new job has been posted on the TRISET careers page.',
    '',
    `Title: ${job.title}`,
    `Location: ${job.location}`,
    `Department: ${job.department || 'General'}`,
    `Employment type: ${job.employment_type || 'Full-time'}`,
    `Experience: ${job.experience || 'Flexible'}`,
    `Featured: ${job.is_featured ? 'Yes' : 'No'}`,
    '',
    `Description: ${job.description || ''}`,
    `Requirements: ${job.requirements || ''}`,
    `Apply email: ${job.apply_email || 'info@trisetsolutions.com'}`,
    `Apply URL: ${job.apply_url || 'Not provided'}`,
  ].join('\n');

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toAddress,
    subject,
    text,
  });

  return { sent: true };
}

module.exports = { sendContactEmail, sendJobPostedEmail };
