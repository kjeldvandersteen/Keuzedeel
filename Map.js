//#region TILE LAYER
// link naar de kaart en de copyright informatie
var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var cycleMap = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© CyclOSM | © OpenStreetMap contributors'
});
//#endregion

//#region Layer 1
var Provincies = L.layerGroup();

// GeoJSON data van steden in Nederland
var geoJSONLayer = fetch('nl.json')
  .then(response => response.json())
  .then(data => {
    return L.geoJSON(data, {
      style: { color: "#185be1", weight: 2 },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.name); // province name
      }
    }).addTo(Provincies);
  });
//#endregion

//#region Layer 2
var Utrecht = L.marker([52.0907, 5.1214]).bindPopup('Utrecht<br> Inwoners: 357.179'),
    DenHaag = L.marker([52.0705, 4.3007]).bindPopup('Den Haag<br> Inwoners: 528.715'),
    DenBosch = L.marker([51.6860, 5.3037]).bindPopup('Den Bosch<br> Inwoners: 142.465'),
    Haarlem = L.marker([52.3874, 4.6462]).bindPopup('Haarlem<br> Inwoners: 229.890'),
    Zwolle = L.marker([52.5168, 6.0830]).bindPopup('Zwolle<br> Inwoners: 139.704'),
    Leeuwarden = L.marker([53.2012, 5.7999]).bindPopup('Leeuwarden<br> Inwoners: 117.743'),
    Groningen = L.marker([53.2194, 6.5665]).bindPopup('Groningen<br> Inwoners: 116.000'),
    Maastricht = L.marker([50.8514, 5.6900]).bindPopup('Maastricht<br> Inwoners: 122.000'),
    middelburg = L.marker([51.4833, 3.5833]).bindPopup('Middelburg<br> Inwoners: 75.000'),
    lelystad = L.marker([52.5186, 5.4697]).bindPopup('Lelystad<br> Inwoners: 70.000'),
    assen = L.marker([52.9921, 6.5645]).bindPopup('Assen<br> Inwoners: 65.000');

var Hoofdsteden = L.layerGroup([Utrecht, DenHaag, DenBosch, Haarlem, Zwolle, Leeuwarden, Groningen, Maastricht, middelburg, lelystad, assen]);
//#endregion

//#region GPS
var GPS = L.layerGroup();;
navigator.geolocation.getCurrentPosition(success);

function success(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

     L.marker([lat, lon])
        .bindPopup("Je bent hier!")
        .openPopup()
        .addTo(GPS);
}
//#endregion

//#region MAP INITIALIZATION
// de kaart centreren op Nederland
var netherlandsBounds = L.latLngBounds(L.latLng(50.7, 3.3), L.latLng(53.7, 7.3));
var map = L.map('map', {maxBounds: netherlandsBounds, maxBoundsViscosity: 1.00, layers: [baseLayer, Hoofdsteden]});
map.fitBounds(netherlandsBounds);
//#endregion

//#region CONTROLS
// schaal links onder
L.control.scale({
    metric: true,
    imperial: false,
    position: 'bottomleft',
}).addTo(map);
//#endregion


//#region LAYER CONTROL
var baseMaps = {
    "OpenStreetMap": baseLayer,
    "CycleMap": cycleMap
};
var overlayMaps = {
    "hoofdsteden": Hoofdsteden,
    "provincies": Provincies,
    "GPS": GPS
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
//#endregion
