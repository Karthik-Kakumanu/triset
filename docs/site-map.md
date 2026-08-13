# TRISET Site Map Proposal

Target: small, premium website with 8-10 pages maximum and one excellent Services experience.

## Recommended Information Architecture

| Page | Purpose | Content modules |
|---|---|---|
| Home | Fast overview and conversion path | Hero, service families, proof/process, selected projects, CTA |
| About | Establish company credibility | Journey, capabilities, values, team preview |
| Services | Main service experience | Digital Solutions and Geo-Spatial Solutions with expandable service details |
| Solutions | Outcome/use-case page | Business workflows, geospatial workflows, digital delivery combinations |
| Projects | Proof and examples | Verified project cards/case studies only |
| Careers | Hiring/open interest | Simple intro, culture/process, contact/application form |
| Contact | Inquiry conversion | Contact form, direct email/phone, hours, location |
| Privacy Policy | Compliance | Needs legal/client-approved copy |
| Terms | Compliance | Needs legal/client-approved copy |

Optional: keep `Team` as an About section, not a separate page, unless TRISET wants a people-focused site.

## Services Page Structure

1. Hero: “Digital and Geo-Spatial Solutions from one technical team.”
2. Two top-level tabs/sections: Digital Solutions and Geo-Spatial Solutions.
3. Expandable service rows/cards with short description, sub-services, associated images, and inquiry CTA.
4. Shared process section: onboarding, analysis, proposal, kickoff, execution, delivery.
5. Final CTA: contact for project scoping.

## URL Plan

| New URL | Legacy/source pages to absorb |
|---|---|
| `/` | `index.php` |
| `/about` | `about.php`, team section |
| `/services` | all individual service PHP files |
| `/solutions` | service combinations and use cases |
| `/projects` | `project.php` |
| `/careers` | `career.php` |
| `/contact` | `contact.php`, contact form |
| `/privacy` | privacy copy |
| `/terms` | terms copy |

## Redirect Candidates

Redirect legacy service URLs such as `web_development_service.php`, `photogrammetry_service.php`, `gis_service.php`, `lidar.php`, `bim_service.php`, `drone.php`, `dem_service.php`, `orthophoto.php`, `2d_3d.php`, and `3d.php` to `/services` with anchors.

## Navigation

Primary nav: Home, About, Services, Solutions, Projects, Careers, Contact.  
Primary CTA: Discuss a project.  
Footer: About, Services, Projects, Careers, Contact, Privacy, Terms, email, phone, location.
