/**
 * colors.js — color assignment for geologic units.
 *
 * Each tectonostratigraphic group (GROUPS) has a fixed HSL hue; every unit in a
 * group gets a lightness step of that hue so related units read as one family
 * while staying distinguishable. Groups with hue === null (Unclassified) get grays.
 *
 * Defines globals used by the rest of the app:
 *   groupOf     {unitCode: groupName}   — reverse lookup unit → group
 *   groupUnits  {groupName: [codes]}    — units belonging to each group, sorted
 *   colors      {unitCode: cssColor}    — fill color of each geologic unit
 *   groupColor  {groupName: cssColor}   — representative swatch color per group
 *
 * Requires: data/units.js (UNITS, GROUPS).
 */

var groupOf = {}, groupUnits = {};
GROUPS.forEach(g => groupUnits[g[0]] = []);
Object.keys(UNITS).forEach(function(u) {
  groupOf[u] = UNITS[u].group;
  (groupUnits[UNITS[u].group] = groupUnits[UNITS[u].group] || []).push(u);
});

var colors = {}, groupColor = {};
GROUPS.forEach(function(g) {
  var name = g[0], hue = g[1], us = groupUnits[name] || [];
  us.sort();
  us.forEach(function(u, i) {
    if (hue === null) { colors[u] = 'hsl(0,0%,' + (45 + i*8) + '%)'; return; }
    var n = us.length;
    // spread lightness 38–72% across the group's units; alternate saturation for contrast
    var light = n === 1 ? 55 : 38 + Math.round(34 * i / (n - 1));
    var sat = 62 + (i % 2) * 12;
    colors[u] = 'hsl(' + hue + ',' + sat + '%,' + light + '%)';
  });
  groupColor[name] = hue === null ? 'hsl(0,0%,55%)' : 'hsl(' + hue + ',65%,52%)';
});
