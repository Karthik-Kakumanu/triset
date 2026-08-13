# Site Architecture

## Frontend

The frontend is a static HTML/CSS/JS experience with centralized browser data in `src/content.js` and interactions in `src/app.js`.

Pages:

- `index.html` -> `/`
- `about.html` -> `/about`
- `company.html` -> `/company`
- `services.html` -> `/services`
- `solutions.html` -> `/solutions`
- `projects.html` -> `/work` and `/projects`
- `careers.html` -> `/careers`
- `contact.html` -> `/contact`
- `privacy.html` -> `/privacy`
- `terms.html` -> `/terms`
- `404.html` -> `/404`

## Backend

The backend uses Node's built-in HTTP server to avoid unnecessary framework weight.

Modules:

- `backend/server.js`: entry point
- `backend/src/routes/router.js`: clean routes, legacy redirects, API routes, static serving
- `backend/src/controllers`: API behavior
- `backend/src/validators`: contact validation and sanitization
- `backend/src/services`: email abstraction and contact storage
- `backend/src/middleware`: security headers and rate limiting
- `backend/src/config`: environment and paths

## Data

Frontend service details live in `src/content.js`. Backend API summaries live in `backend/src/data/siteData.js`.

## Routing

The backend serves clean routes and also allows direct `.html` access for simple local preview. Legacy TRISET service PHP URLs are redirected to `/services` anchors.
