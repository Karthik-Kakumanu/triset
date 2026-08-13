# TRISET Migration Plan

## Migration Strategy

Build a new small site from verified content, not by reskinning the current PHP/template stack. Preserve the extracted project as a reference archive until the new site is approved.

## Keep

| Asset/content | Why |
|---|---|
| `app/data/site.php` | Best consolidated source of company, services, process, team and project data |
| `img/logo_final.png` and brand assets | Likely TRISET-owned |
| Service names and service hierarchy | Matches live site and business offering |
| Contact email/phone/hours | Verified on live site |
| Process steps | Useful and business-specific enough to reuse |
| `assets/models/photogrammetry.glb` | Potential lightweight 3D asset after QA |

## Migrate

| Item | Migration note |
|---|---|
| Service descriptions | Rewrite into one Services page with expandable details |
| Team data | Migrate only after client confirms names/photos/roles |
| Project cards | Migrate verified items; “Cyber Security”, “Mobile Info”, etc. need proof |
| Contact form | Rebuild with secure spam protection and clear email delivery |
| Selected images from `img/` | Use only after ownership/quality review |

## Rebuild

| Item | Why |
|---|---|
| Frontend UI | Current project mixes old Bootstrap, new PHP views, and static experiments |
| Navigation/footer | Existing footer contains template/incorrect links and address |
| Services UX | Too many individual pages; brief asks for one excellent service experience |
| Privacy/Terms | Current legal/help content is not reliable |
| SEO metadata | Must be rebuilt around final IA and content |

## Replace

| Item | Replacement |
|---|---|
| Template/admin HTML pages | Do not ship in public site |
| Placeholder/testimonial stock assets | Real approved imagery or neutral branded visuals |
| HTML Codex public credits | New original design/code |
| `123 Street, New York, USA` and generic contact data | Verified TRISET contact details |

## Delete Later, Not During Audit

No files were deleted in Phase 0. Candidates for later removal after backup/approval: `triset_old/`, `migration_backup/`, `sample/`, template admin pages, duplicate PHPMailer copies, local PHP toolchain under `tools/php`, and obsolete individual service PHP pages after redirects are in place.

## Build Readiness Checklist

- Confirm full company address and legal name usage.
- Confirm service list and whether all 14 service capabilities should remain public.
- Confirm team/publication permissions.
- Confirm testimonials are real and approved.
- Confirm project case studies and images.
- Confirm hosting stack: static/Next.js/PHP.
- Decide whether contact submissions should email only, store in DB, or both.
- Confirm privacy/terms copy.

## Suggested Implementation Phases

1. Content approval: canonical copy, service grouping, contact/legal data.
2. Visual system: brand palette, typography, image treatment, 3D terrain concept.
3. Build: small site with Home, About, Services, Solutions, Projects, Careers, Contact, Privacy, Terms.
4. QA: responsive widths, forms, performance, accessibility, redirects, SEO.
5. Launch: deploy, verify analytics/search, archive old site.
