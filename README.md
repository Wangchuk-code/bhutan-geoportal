# Bhutan Geoportal

Interactive geologic map of Bhutan built with [Leaflet](https://leafletjs.com/). Shows the
Geologic Map of Bhutan (Long, McQuarrie, Tobgay, Grujic & Hollister, 2011, *Journal of Maps*
7(1), doi:10.4113/jom.2011.1159) together with administrative and watershed boundaries, a
searchable geologic-unit legend, and per-unit descriptions.

## Run it
use this link to explore:
https://wangchuk-code.github.io/bhutan-geoportal/


Open `index.html` in a browser — no server or build step required.
(Optionally serve it: `python3 -m http.server` then visit http://localhost:8000.)

An internet connection is needed for the Leaflet library and basemap tiles (CDN).

## File structure

| Path | Contents |
|---|---|
| `index.html` | Page markup and script/stylesheet includes only |
| `css/style.css` | All styling (panels, sidebar, legend, Leaflet overrides) |
| `data/geology.js` | Geologic map polygons (GeoJSON, `DATA.geology`) |
| `data/country.js` | Bhutan country boundary (`DATA.country`) |
| `data/dzongkhag.js` | Dzongkhag (district) boundaries (`DATA.dzongkhag`) |
| `data/gewog.js` | Gewog (sub-district) boundaries (`DATA.gewog`) |
| `data/watershed.js` | 186 watershed boundaries (`DATA.watershed`) |
| `data/units.js` | `UNITS` (unit code → name/age/group/lithology) and `GROUPS` (group → color hue) |
| `js/colors.js` | Assigns each unit a color: one hue per group, lightness steps per unit |
| `js/panels.js` | Hover info panel and unit detail panel (`showInfo`, `hideInfo`, `showDetail`) |
| `js/basemaps.js` | Basemap tile layers (Dark/Topo/Satellite/OSM) and switcher buttons |
| `js/layers.js` | Builds all Leaflet overlay layers + geology visibility state |
| `js/main.js` | Creates the map, adds default layers, fits to Bhutan |
| `js/sidebar.js` | Layer toggles, opacity slider, searchable grouped legend, collapse controls |

Data files are plain scripts (not fetched `.geojson`) so the page also works when opened
directly from disk (`file://`), where `fetch()` of local files is blocked.

Scripts load in dependency order (data → colors → panels → basemaps → layers → main →
sidebar); state is shared through globals. Each `js/` file has a header comment describing
its responsibility.
