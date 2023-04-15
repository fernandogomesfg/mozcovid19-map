// Cria o mapa
var map = L.map('map').setView([-19.833333, 34.8388900], 5);

// Cria a camada principal e adiciona ao mapa
var mapaPrincipal = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Remove a camada principal do mapa
map.removeLayer(mapaPrincipal);

// Cores para representar os casos
function getColor(d) {
    return d >= 33340 ? '#ff0000' :
        d > 14240 ? '#ff3c3c' :
            d > 11220 ? '#ff7777' :
                d > 9140 ? '#ffb3b3' :
                    d > 8140 ? '#ffeeee' :
                        '#ffeeee';
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); 
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h2>CORONAVÍRUS (COVID-19) | MOÇAMBIQUE</h2>' +  (props ?
        '<b>' + props.provincia + '</b><br />' + props.Numero_de_casos + ' Casos Comulativos'
        : 'Passe o mouse para mias informações');
};

info.addTo(map);

// funcao estilo
function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '',
        fillOpacity: 0.9,
        fillColor: getColor(feature.properties.Numero_de_casos)
    }
}

// Adiconando interactividade ao mapa
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && L.Browser.edge) {
        layer.bringToFront();
    }
    
    info.update(layer.feature.properties)
}

var pronvicias;

function resetHighlight(e) {
    pronvicias.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        //click: zoomToFeature
    });
}



// Cria a camada GeoJSON e adiciona ao mapa
var pronvicias = L.geoJson(covid_moz, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map)


// Legenda do Mapa
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [0, 8144, 11229, 14241, 33349, 78473];
  var labels = [];
  var from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '')
    );
  }

  div.innerHTML = labels.join('<br>');
  return div;
};


legend.addTo(map);