/**
 * basemaps.js — basemap tile layers and the switcher buttons.
 *
 * Defines the global `basemaps` {name: L.TileLayer} and builds one button per
 * basemap inside #basemaps. Clicking a button swaps the active tile layer on
 * the map (the `map` global from js/main.js is only touched at click time).
 */

var basemaps = {
  'Dark':      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {attribution:'&copy; OSM &copy; CARTO', subdomains:'abcd'}),
  'Topo':      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {attribution:'Esri'}),
  'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution:'Esri'}),
  'OSM':       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'&copy; OpenStreetMap'})
};

var bmDiv = document.getElementById('basemaps');
Object.keys(basemaps).forEach(function(name, i) {
  var b = document.createElement('button');
  b.textContent = name;
  if (i === 0) b.classList.add('active');
  b.onclick = function() {
    Object.values(basemaps).forEach(l => map.removeLayer(l));
    basemaps[name].addTo(map);
    bmDiv.querySelectorAll('button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  };
  bmDiv.appendChild(b);
});
