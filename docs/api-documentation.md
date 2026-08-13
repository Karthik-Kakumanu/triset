# API Documentation

Base URL: same origin as the website.

## GET `/api/health`

Returns server health.

```json
{ "ok": true, "service": "triset-website", "time": "2026-08-12T00:00:00.000Z" }
```

## POST `/api/contact`

Validates and stores a contact inquiry. If SMTP environment variables are configured and `nodemailer` is installed, the server also sends an email.

Fields:

| Field | Required | Notes |
|---|---:|---|
| `name` | Yes | Minimum 2 characters |
| `email` | Yes | Must be valid email |
| `phone` | No | `+`, digits, spaces and simple punctuation |
| `company` | No | Optional organization |
| `service` | No | Selected service/category |
| `message` | Yes | Minimum 10 characters |
| `website` | No | Honeypot spam field; must be empty |

Success:

```json
{
  "ok": true,
  "message": "Inquiry received. TRISET will respond using the contact details provided.",
  "id": "contact_...",
  "stored": true,
  "email": { "sent": false, "reason": "smtp_not_configured" }
}
```

Validation error:

```json
{ "ok": false, "errors": { "email": "Enter a valid email address." } }
```

Rate limit:

```json
{ "ok": false, "error": "Too many submissions. Please try again later." }
```

## GET `/api/services`

Returns the service index used for server-side API consumers.

## GET `/api/services/:slug`

Returns one service by slug or `404`.

## GET `/api/projects`

Returns the verified project/capability index.

## GET `/api/projects/:slug`

Returns one project by slug or `404`.
