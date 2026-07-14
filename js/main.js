/**
 * main.js — map creation and startup wiring.
 *
 * Creates the global `map` with the default basemap, adds zoom/scale controls,
 * turns on the default overlays (geology, country, dzongkhag), zooms to Bhutan
 * and hooks up the zoom-dependent dzongkhag labels.
 *
 * Requires: js/basemaps.js, js/layers.js. Load after both, before js/sidebar.js.
 */

var map = L.map('map', {layers: [basemaps['Dark']], zoomControl: false});
L.control.zoom({position: 'bottomleft'}).addTo(map);
L.control.scale({position: 'bottomleft', imperial: false}).addTo(map);

geologyLayer.addTo(map);
countryLayer.addTo(map);
dzongkhagLayer.addTo(map);
map.fitBounds(countryLayer.getBounds(), {padding: [20, 20]});

map.on('zoomend', syncLabels); syncLabels();
