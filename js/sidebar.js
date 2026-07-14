/**
 * sidebar.js — all sidebar controls.
 *
 *   - overlay layer checkboxes (#layers)
 *   - geology opacity slider (#opacity)
 *   - grouped, searchable geologic-unit legend (#units) with per-unit
 *     show/hide (eye) and click-for-detail
 *   - Show all / Hide all / Collapse groups actions
 *   - sidebar collapse button
 *
 * Requires: js/colors.js, js/layers.js, js/panels.js, js/main.js (map).
 * Load last.
 */

/* ---------- overlay layer toggles ---------- */
// [label, layer, swatch color, on by default]
var overlays = [
  ['Geology',              geologyLayer,   '#e884b5', true],
  ['Country Boundary',     countryLayer,   '#f8fafc', true],
  ['Dzongkhag Boundaries', dzongkhagLayer, '#fbbf24', true],
  ['Gewog Boundaries',     gewogLayer,     '#a78bfa', false],
  ['Watersheds (186)',     watershedLayer, '#22d3ee', false]
];
var layersDiv = document.getElementById('layers');
overlays.forEach(function(o) {
  var label = document.createElement('label');
  label.className = 'toggle';
  label.innerHTML = '<input type="checkbox"' + (o[3] ? ' checked' : '') + '>' +
    '<span class="dot" style="background:' + o[2] + '"></span>' + o[0];
  label.querySelector('input').addEventListener('change', function(e) {
    e.target.checked ? map.addLayer(o[1]) : map.removeLayer(o[1]);
    syncLabels();
    countryLayer.bringToFront();
  });
  layersDiv.appendChild(label);
});

/* ---------- geology opacity slider ---------- */
document.getElementById('opacity').addEventListener('input', function(e) {
  opacity = e.target.value / 100;
  geologyLayer.setStyle(geoStyle);
});

/* ---------- grouped legend: one collapsible block per group ---------- */
var unitsDiv = document.getElementById('units');
GROUPS.forEach(function(g) {
  var name = g[0], us = (groupUnits[name] || []).filter(u => counts[u]);
  if (!us.length) return;
  var grp = document.createElement('div');
  grp.className = 'grp';
  var head = document.createElement('div');
  head.className = 'grp-head';
  head.innerHTML = '<span class="chev">▼</span><span class="gsw" style="background:' + groupColor[name] + '"></span>' + name;
  head.onclick = function() { grp.classList.toggle('closed'); };
  grp.appendChild(head);
  var wrap = document.createElement('div');
  wrap.className = 'grp-units';
  us.forEach(function(u) {
    var m = UNITS[u];
    var d = document.createElement('div');
    d.className = 'unit'; d.dataset.u = u;
    d.dataset.search = (u + ' ' + m.name + ' ' + m.age + ' ' + m.lith).toLowerCase();
    d.title = m.name + ' (' + m.age + ')';
    d.innerHTML = '<i style="background:' + colors[u] + '"></i><span class="code">' + u + '</span>' +
      '<span class="uname">' + m.name + '</span><span class="eye" title="show/hide">👁</span>';
    d.onclick = function(e) {
      if (e.target.classList.contains('eye')) {   // eye icon: toggle unit visibility
        hidden.has(u) ? hidden.delete(u) : hidden.add(u);
        d.classList.toggle('off');
        geologyLayer.setStyle(geoStyle);
        return;
      }
      unitsDiv.querySelectorAll('.unit.sel').forEach(x => x.classList.remove('sel'));
      d.classList.add('sel');
      showDetail(u);
    };
    wrap.appendChild(d);
  });
  grp.appendChild(wrap);
  unitsDiv.appendChild(grp);
});

/* ---------- search across code, name, age, lithology ---------- */
document.getElementById('search').addEventListener('input', function(e) {
  var q = e.target.value.toLowerCase();
  unitsDiv.querySelectorAll('.unit').forEach(el =>
    el.style.display = el.dataset.search.includes(q) ? '' : 'none');
  unitsDiv.querySelectorAll('.grp').forEach(function(grp) {
    var any = [...grp.querySelectorAll('.unit')].some(el => el.style.display !== 'none');
    grp.style.display = any ? '' : 'none';
    if (q) grp.classList.remove('closed');
  });
});

/* ---------- show all / hide all / collapse groups ---------- */
document.getElementById('allOn').onclick = function() {
  hidden.clear();
  unitsDiv.querySelectorAll('.unit').forEach(el => el.classList.remove('off'));
  geologyLayer.setStyle(geoStyle);
};
document.getElementById('allOff').onclick = function() {
  Object.keys(UNITS).forEach(u => hidden.add(u));
  unitsDiv.querySelectorAll('.unit').forEach(el => el.classList.add('off'));
  geologyLayer.setStyle(geoStyle);
};
var grpsOpen = true;
document.getElementById('grpToggle').onclick = function() {
  grpsOpen = !grpsOpen;
  unitsDiv.querySelectorAll('.grp').forEach(el => el.classList.toggle('closed', !grpsOpen));
  this.textContent = grpsOpen ? 'Collapse groups' : 'Expand groups';
};

/* ---------- sidebar collapse ---------- */
var body = document.querySelector('#sidebar .body');
document.getElementById('collapse').onclick = function() {
  var open = body.style.display !== 'none';
  body.style.display = open ? 'none' : '';
  this.textContent = open ? '▸' : '▾';
};
