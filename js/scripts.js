mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-73.953781,40.767022],
    zoom: 9
});

var zoomThreshold = 4;

map.on('load', function() {

    $.getJSON('data/cd.geojson', function(data) {
      data.features.map(function(feature) {
        feature.properties.pop2010 = parseInt(feature.properties.pop2010);
      });

      data.features.forEach(function(feature) {
        console.log(feature.properties.pop2010)
      })


      map.addSource('community-district-population', {
          'type': 'geojson',
          'data': data,
      });

      map.addLayer({
        id: 'nyc-community-districts',
        type: 'fill',
        source: 'community-district-population',
        paint: {
          'fill-opacity': 0.7,
          'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'pop2010'],
              0, '#f1eef6',
              50000, '#bdc9e1',
              100000, '#74a9cf',
              250000, '#2b8cbe',
              500000, '#2b8cbe'
          ],
        }
      });

      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('mouseenter', 'nyc-community-districts', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var feature = e.features[0]

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.lngLat)
          .setHTML(`
            <h4>${feature.properties.cd_name}</h4><br/>
            <p>Population: ${numeral(feature.properties.pop2010).format('0.0a')}</p>
          `)
          .addTo(map);
      });

      map.on('mouseleave', 'nyc-community-districts', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });



});

// var stateLegendEl = document.getElementById('state-legend');
// var countyLegendEl = document.getElementById('county-legend');
// map.on('zoom', function() {
//     if (map.getZoom() > zoomThreshold) {
//         stateLegendEl.style.display = 'none';
//         countyLegendEl.style.display = 'block';
//     } else {
//         stateLegendEl.style.display = 'block';
//         countyLegendEl.style.display = 'none';
//     }
// });
