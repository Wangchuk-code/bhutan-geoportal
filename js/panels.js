/**
 * panels.js — the two floating information panels.
 *
 *   #info   (top right)    — small hover readout, key/value rows
 *   #detail (bottom right) — full description of a geologic unit
 *
 * Requires: js/colors.js (colors); counts is defined in js/layers.js but only
 * read at call time.
 */

var info = document.getElementById('info');

/**
 * Show the hover info panel.
 * @param {string} title - Panel heading.
 * @param {Array<[string, string|number]>} rows - [label, value] pairs rendered as rows.
 */
function showInfo(title, rows) {
  info.innerHTML = '<h4>' + title + '</h4>' +
    rows.map(r => '<div class="kv"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>').join('');
  info.style.display = 'block';
}

/** Hide the hover info panel. */
function hideInfo() { info.style.display = 'none'; }

/**
 * Open the detail panel for a geologic unit: name, age, zone, polygon count,
 * lithology, digitization warning (if flagged) and the map source citation.
 * @param {string} u - Unit code (key of UNITS), e.g. "Tsm".
 */
function showDetail(u) {
  var m = UNITS[u];
  if (!m) return;
  document.getElementById('detailBody').innerHTML =
    '<h4><span class="code-chip" style="background:' + colors[u] + '">' + u + '</span>' + m.name + '</h4>' +
    '<div class="meta"><b>Age:</b> ' + m.age + ' &nbsp;·&nbsp; <b>Zone:</b> ' + m.group +
    ' &nbsp;·&nbsp; <b>Polygons:</b> ' + (counts[u] || 0) + '</div>' +
    '<div class="lith">' + m.lith + '</div>' +
    (m.note ? '<div class="warn">⚠ Interpretation flagged: see description — this code or its placement is not a 1:1 match with the published legend.</div>' : '') +
    '<div class="src">Source: Long, McQuarrie, Tobgay, Grujic &amp; Hollister (2011), Geologic Map of Bhutan, Journal of Maps 7(1), doi:10.4113/jom.2011.1159</div>';
  document.getElementById('detail').style.display = 'block';
}
