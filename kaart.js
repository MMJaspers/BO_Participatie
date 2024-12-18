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
        url: 'http://localhost:8080/geoserver/BookBizz/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=BookBizz%3Aboekwinkels&outputFormat=application%2Fjson',
        dataType: 'json'
    }).done(function(data) {
        console.log(data);
        boekwinkellaag = new L.GeoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var marker = L.marker(latlng, { icon: customIcon });
                let prop = feature.properties;
    
                // Maak de inhoud van properties.name vetgedrukt en een maatje groter
                var popupContent = '<strong style="font-size: 150%;">' + feature.properties.name + '</strong>';
                if (prop.website) {
                    popupContent += '<br><a href="' + feature.properties.website + '" target="_blank" style="font-size: medium;">' + feature.properties.website + '</a>'
                }
                if(prop.street){
                    popupContent+= '<br><span style="font-size: medium;">' + feature.properties.street + '</span>'
                }
                if(prop.housenumber){
                    popupContent+= ' <span style="font-size: medium;">' + feature.properties.housenumber + '</span>'
                }
                if(prop.postcode){
                    popupContent+= '<br><span style="font-size: medium;">' + feature.properties.postcode + '</span>'
                }
                if(prop.city){
                    popupContent+= ' <span style="font-size: medium;">' + feature.properties.city + '</span>';
                }
            
    
                marker.bindPopup(popupContent);
                return marker;
            }
        });
    
        boekwinkelCluster.addLayer(boekwinkellaag);
        //map.addControl(new L.Control.Search({ layer: boekwinkellaag, propertyName: 'city' }));
    });
    
    
    
    // Define layer switcher 
    var baseMaps = {
        "Grijze kaart": CartoDB_Positron,
        "Kleur kaart": Esri_WorldTopoMap,
    };

    var lagenSwitcher = L.control.layers(baseMaps);
    map.addControl(lagenSwitcher);
});