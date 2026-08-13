# TRISET Content Inventory

Audit date: 2026-08-11  
Primary sources: extracted `Triset.zip`, live site `https://www.trisetsolutions.com/`, visual reference `https://www.tconsolutions.com/`.

## Verified Company Content

| Item | Current value | Source | Status |
|---|---|---|---|
| Legal/company name | TRISET SOLUTIONS INDIA PVT LTD | `app/data/site.php`, live homepage | Keep |
| Short name | TRISET / Triset Solutions | project + live site | Keep |
| Email | `info@trisetsolutions.com` | live homepage and `app/data/site.php` | Keep |
| Phone | `+91 738 281 9292` | live homepage and `app/data/site.php` | Keep |
| Location | Hyderabad, India | `app/data/site.php`, live about copy | Keep, but verify full street address |
| Hours | Mon - Sat 6:30 - 22:30, Sunday - CLOSED | live homepage and `app/data/site.php` | Keep if business confirms |
| Tagline | Precise. Powerful. Professional. | live homepage and `app/data/site.php` | Keep |
| Promise | Your trusted partner in delivering excellence at every step. | live homepage | Keep |
| Company origin | Journey began in 2018 as Aero Geospatial Services; company founded/rebranded in 2023 | live about copy and project data | Keep, but clarify wording |

## Page Content Hierarchy

| Page/content area | Found content | Source | Recommendation |
|---|---|---|---|
| Home | Hero/service carousel, service groups, about preview, team, process, testimonials, footer | live homepage, `index.php`, views | Rebuild as concise conversion-focused homepage |
| About | Company journey, capabilities, quality/customer focus | live homepage/about copy, `about.php`, `app/data/site.php` | Keep and rewrite for clarity |
| Services | Digital and geospatial services mixed across homepage, mega menus, individual service pages | live homepage, `app/data/site.php`, service PHP files | Consolidate into one strong Services experience |
| Projects | Project cards include Saraswathi Academy plus generic/unclear project categories | `app/data/site.php`, `project.php` | Migrate verified projects only; mark others for review |
| Team | Six team members with roles and experience | live homepage, `app/data/site.php` | Keep if approved for publication |
| Careers | Page exists, unclear active hiring content | `career.php` | Rebuild simple careers/contact-intent page |
| Contact | Contact form, email, phone, hours; footer has bad NYC placeholder address | `contact.php`, live footer | Keep form intent, remove bad address |
| Privacy/Terms/Legal | Live footer links mention Terms, Privacy, Help, FAQs; project has no strong legal copy | live footer, workspace static docs | Needs legal/client review |

## Service Inventory

| Service name | Category | Source URL/file | Short description | Sub-services | Images | CTA/info |
|---|---|---|---|---|---|---|
| Web Development | Digital Solutions | `web_development_service.php`, live homepage | Custom websites, APIs, UI/UX, chatbot, cloud-ready platforms | Custom Development; API Development; UI/UX Design; ChatBot; Cloud Integration | `img/web_development.jpg`, `img/web_development.jpeg` | Contact Now |
| App Development | Digital Solutions | `app-development_service.php`, live homepage | Scalable mobile applications and integrations | Marketing; UI/UX Design; App Development; App Integration; White Label Apps; Cross-Platform Development; App Maintenance & Support | `img/app-development.jpg`, `img/appdevelopment.gif` | Contact Now |
| E-Commerce | Digital Solutions | `e-commerce_service.php`, live homepage | Online stores, migrations, marketplaces, PWA/AMP, support | Store Setup & Upgrade; Theme Development; UI/UX; Mobile Apps; PWA & AMP; Migration; Marketplaces; ChatBot; Support & Maintenance | `img/e-commerce.jpg`, `img/e-commerce.webp` | Platforms include Shopify, Magento, WooCommerce, BigCommerce, PrestaShop, OpenCart, Squarespace, Wix store, Amazon, Etsy, Ebay, Zen Cart |
| Digital Marketing | Digital Solutions | `digital-marketing_service.php`, live homepage | SEO, paid ads, social, email, content, app and e-commerce marketing | SEO & Local SEO; Paid Ads; Social Media; App Marketing; Email Marketing; Content Marketing; E-Commerce Marketing/SEO/Paid/Social/Email/Content | `img/digital_market.jpg`, `img/digital.jpg`, `img/digital1.webp` | Contact Now |
| Data Entry | Digital Solutions | `data-entry_service.php`, live homepage | Data entry, processing, conversion, cleansing support | Data Entry Services; Data Processing; Data Conversion | `img/dataentry.jpg`, `img/dataentry.gif` | Contact Now |
| Photogrammetry | Geo-Spatial Solutions | `photogrammetry_service.php`, live homepage | High-accuracy mapping, visualization, geospatial extraction | Image Analysis; 3D Modeling; Mapping Solutions; 2D/3D Cartography; DEM; Orthophoto & Mosaicing; LIDAR; GIS/Remote Sensing; BIM; Drone Services | `img/photogrammetry.gif` | “Need High-Quality, High-Accuracy Visualization?” |
| 2D/3D Cartography | Geo-Spatial Solutions | `2d_3d.php`, `app/data/site.php` | 2D and 3D cartographic outputs | 2D Mapping; 3D Visualization; Cartographic Outputs | `img/2d_3d.jpg` | Contact Now |
| 3D Services | Geo-Spatial Solutions | `3d.php`, `app/data/site.php` | 3D visualization and model outputs | 3D Visualization; Model Outputs; Project Presentation | `img/2d_3d.jpg` | Contact Now |
| DEM | Geo-Spatial Solutions | `dem_service.php`, `app/data/site.php` | Digital elevation model outputs for terrain analysis | Elevation Modeling; Terrain Analysis; Mapping Data | `img/DEM.jpg` | Contact Now |
| Orthophoto & Mosaicing | Geo-Spatial Solutions | `orthophoto.php`, `app/data/site.php` | Accurate orthophoto processing and mosaicing | Orthophoto Processing; Mosaicing; Image Alignment | `img/Orthophoto_&_Mosaicing.jpeg` | Contact Now |
| LIDAR | Geo-Spatial Solutions | `lidar.php`, `app/data/site.php` | LiDAR data services for point-cloud and terrain workflows | Point Cloud Support; Terrain Data; Asset Mapping; Spatial Mapping | `img/lidar.jpg` | Contact Now |
| GIS Services / Remote Sensing | Geo-Spatial Solutions | `gis_service.php`, `app/data/site.php` | GIS mapping, remote sensing and spatial analysis | GIS Mapping; Remote Sensing; Spatial Data; Mapping Outputs | `img/gis.jpg` | Contact Now |
| BIM | Geo-Spatial Solutions | `bim_service.php`, `app/data/site.php` | Building Information Modeling support | BIM; Model Coordination; Digital Building Information; Visualization | `img/bim.webp` | Contact Now |
| Drone Services | Geo-Spatial Solutions | `drone.php`, `app/data/site.php` | Drone-based data acquisition for mapping and monitoring | Drone Data Acquisition; Aerial Mapping; Survey Support; Monitoring | `img/drone.webp` | Contact Now |

## Duplicates And Shared Content

| Content | Status | Recommendation |
|---|---|---|
| “Need High-Quality, High-Accuracy Visualization? Precise. Powerful. Professional.” | Appropriate shared CTA, currently over-repeated | Keep once or twice as a modular CTA |
| Company about paragraph | Duplicate across live/project areas | Keep canonical version, adapt per page |
| Service cards on homepage and service pages | Appropriate shared content | Use structured data source |
| Project onboarding/process steps | Appropriate shared content | Keep as one process section |
| Testimonials | Potential duplicate and unverifiable | Use only if client confirms real reviews |
| Team images and role cards | Appropriate shared content | Keep if publication rights confirmed |
| Footer quick links/help links | Partly template | Rebuild footer with only real pages |

## Template/Incorrect Content

| Item | Where found | Action |
|---|---|---|
| `123 Street, New York, USA` | live footer, `footer.php`, backups | Replace |
| `HTML Codex` / `htmlcodex.com` | admin template and old public footer files | Remove from public rebuild; retain license only if template retained internally |
| `Lorem ipsum` | testimonials/sample/admin/old files | Delete or ignore in new build |
| `John Doe`, `Jane Doe` | admin template pages | Delete/ignore |
| `info@example.com`, `name@example.com` | template/login/sample files | Replace where live |
| Placeholder images / `via.placeholder.com` references | carousel/sample/docs | Replace |
| “Web Design” duplicate service labels | live services area | Remove or merge into Web Development |

## Content Gaps

Full street address, registration/legal details, privacy/terms copy, project case study proof, hiring details, testimonial permission, and image ownership all need client confirmation before the build.
