const buckets = new Map();

function rateLimit({ key, limit = 8, windowMs = 15 * 60 * 1000 }) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  current.count += 1;
  if (current.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }

  return { allowed: true };
}

module.exports = { rateLimit };
