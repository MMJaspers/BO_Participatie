$(document).ready(function() {

    // Define map options
    let mapOptions = {
        zoomControl: true,
        center: [52.10691902310309, 4.885569969336756],
        zoom: 7.1
    }

    // Define map global
    var map = L.map('kaart', mapOptions);

    var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    });

    var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });
    map.addLayer(CartoDB_Positron);
    var customIcon = L.icon({
        iconUrl: 'afbeeldingen/marker.png', // Set the path to your custom icon
        iconSize: [12, 12], // Set the size of the icon
        iconAnchor: [16, 12], // Set the anchor point of the icon
        popupAnchor: [0, -32] // Set the popup anchor point relative to the icon
    });

    let boekwinkelCluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        disableClusteringAtZoom:11,
        maxClusterRadius: 50,
    });
    map.addLayer(boekwinkelCluster);

    $.ajax({
        url: 'puntenlaag1.geojson', // Correct pad naar je GeoJSON-bestand
        dataType: 'json' // Gebruik 'json' als dataType
    }).done(function(data) {
        console.log(data);
    
        // Voeg de GeoJSON-data toe aan de kaart
        let geoLayer = new L.GeoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var marker = L.marker(latlng, { icon: customIcon });
                let prop = feature.properties;
    
                // Stel popup-inhoud samen
                var popupContent = `<strong style="font-size: 150%;">${prop.project_naam}</strong>`;
                popupContent += `<br><b>Gemeente:</b> ${prop.gem_name}`;
                popupContent += `<br><b>Score:</b> ${prop.score}`;
    
                marker.bindPopup(popupContent);
                return marker;
            }
        });
    
        // Voeg de GeoJSON-laag toe aan de clusterlaag
        boekwinkelCluster.addLayer(geoLayer);
    });
    
    
    
    
    // Define layer switcher 
    var baseMaps = {
        "Grijze kaart": CartoDB_Positron,
        "Kleur kaart": Esri_WorldTopoMap,
    };

    var lagenSwitcher = L.control.layers(baseMaps);
    map.addControl(lagenSwitcher);
});