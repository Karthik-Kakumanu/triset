# TRISET Design Direction

## Reference Study: TCON

The TCON site was requested as a visual reference, not a source to copy. During this audit, direct shell access to `https://www.tconsolutions.com/` failed and the indexed page reported an application error: “Cannot set properties of null (setting 'renderer')”. Search metadata identifies it as a software development/digital transformation site with a premium software positioning. Because the live visual page was not reliably accessible, the design study below is conservative and should be validated with screenshots or a working browser pass before final design.

## What To Learn Without Copying

| Area | Reference lesson | TRISET application |
|---|---|---|
| Typography | Strong hierarchy, modern software-site tone | Use crisp sans-serif type, restrained display headings, readable body copy |
| Spacing | Premium sites use generous whitespace and clear section rhythm | Use fewer sections, stronger content density, no cluttered template stacks |
| Navigation | Clear product/service navigation with persistent CTA | Keep top nav simple and add one “Discuss a project” CTA |
| Hero composition | Immediate brand/category signal plus visual proof | Use TRISET name, service promise, and a geospatial/digital visual system |
| Image treatment | Polished visuals should support trust | Prefer real TRISET/project images; avoid generic stock and template graphics |
| Service presentation | Scannable service families | Use Digital Solutions and Geo-Spatial Solutions as the two main groups |
| Animation | Subtle, purposeful motion | Use small scroll/hover transitions; no over-animated futuristic effects |
| Color | Controlled palette with confident accent colors | Use TRISET logo colors, balanced with white/charcoal/soft technical neutrals |
| CTA | Direct and repeated only where useful | “Discuss a project”, “Request a quote”, “Contact TRISET” |
| Responsive behavior | Premium sites avoid cramped mobile layouts | Prioritize readable cards, accordions, and a clean mobile nav |

## Original TRISET Visual Direction

TRISET should feel premium, calm, professional, modern, technical, trustworthy, and fast. The site should avoid cyberpunk visuals, generic AI gloss, heavy gradients, gaming aesthetics, and Bootstrap-template residue.

Recommended visual language:

- White and near-white surfaces with technical charcoal text.
- TRISET green/teal as the primary accent, with a small secondary blue/cyan geospatial accent.
- Thin rules, compact data labels, map/grid details, and precise iconography.
- Real service imagery where available, but filtered through consistent crops and aspect ratios.
- Dense but readable service cards rather than oversized decorative cards.

## 3D/Interactive Direction

Use one lightweight interactive visual system: a low-poly terrain/point-cloud surface inspired by photogrammetry and GIS data.

Placement:

- Home hero: subtle interactive terrain or point-cloud field behind/alongside the hero copy.
- Services header: static or lightly animated terrain strip to tie digital and geospatial work together.
- Mobile fallback: static rendered image/SVG/PNG, no heavy WebGL.

Purpose:

- Communicates TRISET’s geospatial capability.
- Uses actual brand colors.
- Avoids random decoration.
- Can be implemented with a small Three.js mesh or pre-rendered image depending on performance budget.

## Responsive Direction

| Width | Navigation | Hero | Services | Forms/Footer | 3D fallback |
|---|---|---|---|---|---|
| 320px | Compact menu button, no inline nav | Single column, short headline, visual below or hidden | Accordion list | Full-width inputs, stacked footer | Static image or hidden |
| 375px | Same as 320px | Slightly more breathing room | Accordion with service family tabs | Large tap targets | Static image |
| 430px | Menu drawer | Hero visual can appear cropped below copy | Two compact family cards then accordions | Stacked contact details | Static/light canvas only |
| 768px | Tablet nav or menu depending fit | Two-column possible if content fits | Two family columns | Form/details two columns if space | Reduced animation |
| 1024px | Full nav | Two-column hero | Service families side by side | Balanced footer columns | Interactive mesh allowed |
| 1280px | Full nav + CTA | Full hero with visual | Rich expandable grid | Standard layout | Interactive mesh |
| 1440px | Full nav | Constrained content, no over-wide text | 3-column supporting rows | Footer max-width | Interactive mesh |
| 1920px | Full nav | Wider visual area, same readable text width | More whitespace, not bigger text | Max-width containers | Interactive mesh with capped resolution |

## Do Not Carry Forward

Do not carry forward template credits, placeholder testimonials, copied Bootstrap sections, NYC address content, “Web Design” duplicated cards, generic admin visuals, or unverified stock images.
