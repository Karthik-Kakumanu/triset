# Migration Map

Legacy TRISET URLs should redirect to the new structure.

| Legacy URL | New target |
|---|---|
| `/web_development_service.php` | `/services#web-development` |
| `/app-development_service.php` | `/services#app-development` |
| `/e-commerce_service.php` | `/services#e-commerce` |
| `/digital-marketing_service.php` | `/services#digital-marketing` |
| `/data-entry_service.php` | `/services#data-entry` |
| `/photogrammetry_service.php` | `/services#photogrammetry` |
| `/gis_service.php` | `/services#gis` |
| `/lidar.php` | `/services#lidar` |
| `/bim_service.php` | `/services#bim` |
| `/drone.php` | `/services#drone` |
| `/dem_service.php` | `/services#dem` |
| `/orthophoto.php` | `/services#orthophoto` |
| `/2d_3d.php` | `/services#cartography` |
| `/3d.php` | `/services#3d-services` |

The backend implements these redirects in `backend/src/routes/router.js`.
