/**
 * layers.js — builds every Leaflet overlay layer from the embedded data.
 *
 *   geologyLayer   — geologic map polygons, colored per unit, popup + hover + click detail
 *   countryLayer   — Bhutan outline (non-interactive)
 *   dzongkhagLayer — district boundaries with permanent center labels
 *   gewogLayer     — sub-district boundaries (hover highlight)
 *   watershedLayer — 186 watershed polygons (hover highlight)
 *
 * Also defines the geology display state shared with the sidebar:
 *   counts  {unitCode: n} — polygon count per unit
 *   opacity (number 0–1)  — geology fill opacity, set by the slider
 *   hidden  (Set<string>) — unit codes currently hidden via the legend
 *
 * Layers are created here but added to the map in js/main.js.
 * Requires: data/*.js (DATA), js/colors.js, js/panels.js.
 */

var counts = {};
DATA.geology.features.forEach(f => counts[f.properties.name] = (counts[f.properties.name]||0)+1);
var opacity = 0.7, hidden = new Set();

/**
 * Leaflet style function for geology polygons: unit color, current opacity,
 * fully transparent when the unit is hidden.
 * @param {Object} f - GeoJSON feature.
 * @returns {L.PathOptions}
 */
function geoStyle(f) {
  var u = f.properties.name;
  return { fillColor: colors[u] || '#888', fillOpacity: hidden.has(u) ? 0 : opacity,
           color: '#111', weight: hidden.has(u) ? 0 : 0.5 };
}

var geologyLayer = L.geoJSON(DATA.geology, {
  style: geoStyle,
  onEachFeature: function(f, layer) {
    var p = f.properties, m = UNITS[p.name] || {name: 'Unknown unit', age: '—', group: '—', lith: ''};
    layer.bindPopup(
      '<b>' + p.name + ' — ' + m.name + '</b><br>' +
      '<span class="pmeta">' + m.age + ' · ' + m.group + '</span><br><br>' +
      m.lith + '<br><br>' +
      '<span class="pmeta">This polygon: ' + (p.SHAPE__Are/1e6).toFixed(1) + ' km² · perimeter ' +
      (p.SHAPE__Len/1000).toFixed(1) + ' km</span>',
      {maxWidth: 340});
    layer.on('click', function() { showDetail(p.name); });
    layer.on('mouseover', function() {
      if (hidden.has(p.name)) return;
      layer.setStyle({weight: 2.5, color: '#fff'});
      layer.bringToFront();
      showInfo(p.name + ' · ' + m.name, [
        ['Age', m.age],
        ['Area', (p.SHAPE__Are/1e6).toFixed(1) + ' km²'],
        ['Polygons of unit', counts[p.name]]
      ]);
    });
    layer.on('mouseout', function() { geologyLayer.resetStyle(layer); hideInfo(); });
  }
});

var countryLayer = L.geoJSON(DATA.country, {
  style: {color: '#f8fafc', weight: 3, fill: false, opacity: .95}, interactive: false });

var dzongkhagLayer = L.geoJSON(DATA.dzongkhag, {
  style: {color: '#fbbf24', weight: 1.4, dashArray: '5 4', fill: true, fillOpacity: 0},
  onEachFeature: function(f, layer) {
    layer.bindTooltip(f.properties.dzongkhag, {permanent: true, direction: 'center', className: 'dzo-label'});
    layer.on('mouseover', function() {
      layer.setStyle({weight: 3, fillOpacity: .08, fillColor: '#fbbf24'});
      showInfo(f.properties.dzongkhag, [['Type', 'Dzongkhag']]);
    });
    layer.on('mouseout', function() { dzongkhagLayer.resetStyle(layer); hideInfo(); });
  }
});

var gewogLayer = L.geoJSON(DATA.gewog, {
  style: {color: '#a78bfa', weight: .8, fill: true, fillOpacity: 0},
  onEachFeature: function(f, layer) {
    layer.on('mouseover', function() {
      layer.setStyle({weight: 2.5, fillOpacity: .1, fillColor: '#a78bfa'});
      showInfo(f.properties.name_eng, [['Type', 'Gewog']]);
    });
    layer.on('mouseout', function() { gewogLayer.resetStyle(layer); hideInfo(); });
  }
});

var watershedLayer = L.geoJSON(DATA.watershed, {
  style: {color: '#22d3ee', weight: 1, fill: true, fillOpacity: 0},
  onEachFeature: function(f, layer) {
    var p = f.properties;
    layer.on('mouseover', function() {
      layer.setStyle({weight: 2.5, fillOpacity: .1, fillColor: '#22d3ee'});
      showInfo('Watershed #' + p.ws_id, [['Area', Math.round(p.area_ha_1).toLocaleString() + ' ha']]);
    });
    layer.on('mouseout', function() { watershedLayer.resetStyle(layer); hideInfo(); });
  }
});

/**
 * Show dzongkhag name labels only when zoomed in (zoom >= 9) and the
 * dzongkhag layer is on. Called on zoomend and after layer toggles.
 */
function syncLabels() {
  var show = map.getZoom() >= 9 && map.hasLayer(dzongkhagLayer);
  document.querySelectorAll('.dzo-label').forEach(el => el.style.display = show ? '' : 'none');
}
