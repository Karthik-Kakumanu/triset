# TRISET Project Audit

Audit date: 2026-08-11  
Instruction status: Phase 0 only. No production/source website code was intentionally modified.

## Sources Reviewed

| Source | Status |
|---|---|
| Existing project | `Triset.zip` extracted to `.audit-source/Triset` for audit-only inspection |
| Current workspace | Small static site already present in `C:\triset` |
| Live TRISET site | `https://www.trisetsolutions.com/` inspected through web search/crawl |
| TCON reference | `https://www.tconsolutions.com/`; direct access failed and indexed page showed an application error |

## Project Inventory

The extracted project contains 1,544 files. Major file types:

| Type | Count | Notes |
|---|---:|---|
| `.scss` | 354 | Mostly Bootstrap/template source |
| `.php` | 278 | Public pages, controllers, views, legacy copies, PHPMailer |
| `.jpg` | 157 | Main and duplicate imagery |
| `.png` | 121 | Logos, projects, template/sample images |
| `.js` | 105 | Bootstrap, carousel, app scripts, libraries |
| `.webp` | 95 | Modern service/gallery images |
| `.avif` | 92 | Modern service/gallery images |
| `.css` | 81 | Bootstrap/template and newer site CSS |
| `.html` | 36 | Admin template pages |
| `.gif` | 27 | Service/template animation assets |
| `.svg` | 24 | Icons/brand/visual assets |
| `.md` | 22 | Prior planning/status docs |
| `.json` | 5 | Composer/SBOM/tooling metadata |
| Database/config | SQL, SQLite DB, `.env.example`, ini files | Needs review before any live reuse |
| 3D model | 1 `.glb` | `assets/models/photogrammetry.glb` |

## Key Folders

| Folder | Contents | Recommendation |
|---|---|---|
| `app/` | Bootstrap, controllers, helpers, `app/data/site.php` | Keep/migrate useful content and security patterns |
| `resources/views/` | Newer PHP view components/pages | Review/migrate ideas, but rebuild UI |
| `img/` | Main image library, 317 images | Audit for ownership and quality |
| `assets/` | Newer CSS/JS/model assets | Migrate selectively |
| `admin/` | DarkPan Bootstrap admin template | Replace/delete later; do not ship public |
| `PHPMailer/` | Email library | Migrate only if PHP stack remains |
| `database/` | Core SQL migration | Review if contact/auth storage remains |
| `dbconfig/` | Older database helper classes | Replace |
| `sample/` | Template/sample site assets | Delete later |
| `migration_backup/` | Duplicate historical PHP pages | Delete later after backup approval |
| `triset_old/` | Old copy of site/libraries/images | Delete later after backup approval |
| `tools/php/` | Bundled local PHP runtime/tooling | Not part of public site |

## KEEP / MIGRATE / REBUILD / REPLACE / DELETE

| Category | Items | Why |
|---|---|---|
| KEEP | `app/data/site.php`, verified company data, service hierarchy, contact email/phone, process steps, likely brand assets | Best canonical source of real TRISET content |
| MIGRATE | Service details, selected `img/` assets, team data if approved, real projects, contact form intent, `photogrammetry.glb` if performant | Useful content/functionality but should move into a cleaner build |
| REBUILD | Frontend UI, navigation, footer, service experience, legal pages, SEO metadata | Current site is template-heavy and fragmented |
| REPLACE | Admin template, sample assets, generic Bootstrap page layouts, old DB helpers | Not suitable for a premium public website |
| DELETE LATER | `sample/`, `triset_old/`, `migration_backup/`, unused admin HTML, duplicate libraries | Keep during audit; remove only after approval |
| UNKNOWN / NEEDS REVIEW | Testimonials, team photos, project cards beyond Saraswathi Academy, full address, legal copy, image ownership | Require client confirmation |

## Functionality Audit

| Functionality | Found | Notes | New site requirement |
|---|---|---|---|
| Contact form | Yes | `ContactController.php` validates CSRF, writes DB if available, sends PHPMailer SMTP if configured | Required |
| Authentication | Yes | `AuthController.php`, login/signup/logout, password hashing, sessions | Not required for a public marketing site unless admin/careers portal is planned |
| Admin | Partial/template | `admin/index.php` requires login; many admin HTML pages are template demos | Not required |
| Database | Yes | PDO connection, SQL migration, older MySQL helper classes | Only required if storing inquiries/applications |
| Email | Yes | PHPMailer with env SMTP | Required if contact form sends mail |
| Careers/application | Page exists | No strong business workflow found | Simple inquiry form is enough unless hiring workflow is specified |
| Test systems | Yes | `TestController.php`, `test_paper.php`, `submit_test_paper.php`, answer viewing | Not required for TRISET website |
| APIs | No public API surface found | API development is a service offering, not site functionality | Not required |
| Routing | PHP files plus view layer | Many individual service pages and legacy routes | Rebuild as small route map |

## Live TRISET Comparison

The live site confirms the same core business content in `app/data/site.php`: digital services, geospatial services, Hyderabad origin, email, phone, hours, team, process, and service lists.

Differences/problems:

- Live footer still shows `123 Street, New York, USA`, which conflicts with Hyderabad, India.
- Live page includes template/service repetition, including duplicated “Web Design” and repeated service blocks.
- Service details are spread across homepage, individual service files, and data arrays.
- Team/testimonial/project content appears promotional but needs proof/approval before reuse.
- Live footer includes Terms, Privacy, Help, FAQs, Contact, but reliable legal/help copy was not found.
- Current workspace static site appears to be a newer experimental rewrite, not the source project requested in the zip.

## Data Quality Audit

Search results across the extracted project found:

| Pattern | Count |
|---|---:|
| `123 Street` | 17 |
| `New York` | 28 |
| `HTML Codex` | 42 |
| `htmlcodex.com` | 85 |
| `Lorem ipsum` | 36 |
| `placeholder` | 257 |
| `dummy` | 2 |
| `demo` | 47 |
| `example.com` | 56 |
| `John Doe` | 21 |
| `Jane Doe` | 1 |

These are mostly concentrated in admin/sample/legacy/template folders, but some appear in public-facing footer/history areas and must be removed from the rebuild.

## Image Audit Summary

Full inventory: `docs/image-inventory.md`

Findings:

- 522 image files were indexed.
- The main `img/` folder contains 317 images and is the strongest reuse candidate.
- `sample/`, `admin/`, and `triset_old/` contain many template/demo/duplicate assets.
- Several service images map cleanly to TRISET service names.
- Ownership is not always clear; images must be approved before publication.
- Some formats require manual dimension/visual review, especially AVIF/WebP/SVG where local decoding was limited.

## Design Reference Summary

TCON could not be reliably inspected live during this audit. Search metadata positions it as a premium software/digital transformation site, while the indexed homepage showed a renderer application error. The new TRISET direction should therefore use the *quality bar* requested by the user, not copy TCON details.

Design direction is documented in `docs/design-direction.md`.

## Recommended New Site

Build 9 pages maximum:

1. Home
2. About
3. Services
4. Solutions
5. Projects
6. Careers
7. Contact
8. Privacy Policy
9. Terms

Team should live inside About. All services should live inside one strong Services page with Digital Solutions and Geo-Spatial Solutions sections.

## Primary Risks Before Build

- Full legal/company address is not verified.
- Image ownership is not fully verified.
- Testimonials may be synthetic or unapproved.
- Project examples need validation.
- Existing app contains auth/admin/test systems that may tempt unnecessary complexity.
- Current live site contains template contamination that must not be copied forward.

## Stop Point

Phase 0 audit is complete. Do not start building until TRISET confirms content, assets, and the proposed site map.
