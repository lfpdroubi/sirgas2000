// Add AJAX request for data

var unidades_federacao = $.ajax({
  url:"https://raw.githubusercontent.com/lfpdroubi/sirgas2000/master/unidades_federacao.geojson",
  dataType: "json",
  success: console.log("unidades_federacao data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var municipios = $.ajax({
  url:"https://raw.githubusercontent.com/lfpdroubi/sirgas2000/master/municipios.geojson",
  dataType: "json",
  success: console.log("municipios data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

/* when().done() SECTION*/
// Add the variable for each of your AJAX requests to $.when()
$.when(unidades_federacao, municipios).done(function() {
  
  var crs = new L.Proj.CRS('EPSG:31982',
    '+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  {
    resolutions: [
      16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5
    ],
    origin: [0, 0]
  });
  
  var map = new L.Map('map', {
    crs: crs
  });
  
  var CBERS = L.tileLayer.wms(
    'http://brazildatacube.dpi.inpe.br/bdc/geoserver/bdc_brmosaic/wms', {
      layers: 'cbers_full_resolution_tiles',
      maxNativeZoom: 19,
      maxZoom: 100,
      label: "SIG/SC",
      iconURL: 'sig-sc.png'
  }).addTo(map);
  
  var wmsLayer = L.tileLayer.wms(
    'http://sigsc.sc.gov.br/sigserver/SIGSC/wms', {
      layers: 'OrtoRGB-Landsat-2012',
      maxNativeZoom: 19,
      maxZoom: 100,
      label: "SIG/SC",
      iconURL: 'sig-sc.png'
  }).addTo(map);
  
  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
  
  map.setView([-27.675, -51.15], 3);
  
  // Adds SIRGAS2000 GeoJSON
  var UF = L.Proj.geoJson(unidades_federacao.responseJSON, {
    style: {
      color: '#f1f4c7',
      weight: 2,
      fillOpacity: 0.25
    },
      onEachFeature: function( feature, layer ){
        layer.bindPopup(
          "<b>Estado: </b>" + feature.properties.NM_ESTADO + "<br>" +
          "<b>Região: </b>" + feature.properties.NM_REGIAO + "<br>" +
          "<b>Código: </b>" + feature.properties.CD_GEOCUF
        );
      }
    }
  ).addTo(map);
  
  // Adds standard GeoJSON
  var MUNICIPIOS = L.geoJSON(municipios.responseJSON, {
    style: areaStyle,
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Município: </b>" + feature.properties.nome + "<br>" +
        "<b>Geocodigo: </b>" + feature.properties.geocodigo + "<br>" +
        "<b>Gestão de Praias: </b>" + gestaoPraiaStatus(feature)  + "<br>" +
        "<b>NUP: </b>" + "<a href=" + feature.properties.nup_gpraia + ">Link para portaria.</a>"
        );
      }
    }
  );
  
  L.control.mousePosition().addTo(map);
  L.control.mouseCoordinate({gpsLong: false, utm:true,utmref:true}).addTo(map);
  
  var options = {
	 interval: 6,
	 showshowOriginLabel: true,
	 redraw: 'move'
	};
	
	L.simpleGraticule(options).addTo(map);
	 
	/** Definitions for a Swiss Grid - EPSG code 21781
  */
  L.SCGrid = L.MetricGrid.extend({
    options: {
      proj4ProjDef: "+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      bounds: [[213000, 6728000] , [790500, 7141500]]        
    }
  });
  
  // instance factory
  L.scGrid = function (options) {
    return new L.SCGrid(options);
  };
  
  var sGrid = L.scGrid({
	   color: '#C00',
     showAxis100km: true
	 }).addTo(map);
    
  var baseLayers = {
    "CBERS": CBERS,
	  "Esri Satélite": Esri_WorldImagery,
	  "Ortofotos SDS 2012": wmsLayer
	 }
  var overlays = {
	  "Unidades da Federação": UF,
	  "Municípios": MUNICIPIOS,
	  "Grid": sGrid
	 }
	 L.control.layers(baseLayers, overlays).addTo(map);
	    
});
