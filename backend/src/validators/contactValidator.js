function clean(value, maxLength = 1000) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value) {
  return /^[+()\-\s0-9]{7,20}$/.test(value);
}

function validateContact(payload) {
  const data = {
    name: clean(payload.name, 120),
    email: clean(payload.email, 180).toLowerCase(),
    phone: clean(payload.phone, 40),
    company: clean(payload.company, 160),
    service: clean(payload.service, 120),
    message: clean(payload.message, 4000),
    website: clean(payload.website, 200),
  };

  const errors = {};
  if (data.website) errors.website = 'Spam check failed.';
  if (!data.name || data.name.length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!data.email || !isEmail(data.email)) errors.email = 'Enter a valid email address.';
  if (data.phone && !isPhone(data.phone)) errors.phone = 'Enter a valid phone number.';
  if (!data.message || data.message.length < 10) errors.message = 'Message must be at least 10 characters.';

  return { valid: Object.keys(errors).length === 0, data, errors };
}

module.exports = { validateContact };
