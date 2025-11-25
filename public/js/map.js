async function geocodeLocation(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=geojson&limit=1`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Stay-Yatra/1.0 (contact: your-email@example.com)'
    }
  });
  const data = await response.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].geometry.coordinates; // [lng, lat]
  }
  return null;
}



maplibregl.setRTLTextPlugin(
  'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
  true // Lazy load the plugin
);

(async () => {
  const coords = await geocodeLocation(locationString); // [lng, lat]
  if (coords) {
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: coords,   // ✅ yahan array pass karo
      zoom: 10
    });

    map.addControl(new maplibregl.NavigationControl());

    // Marker
    new maplibregl.Marker({color:"red"})
      .setLngLat(coords)
      .setPopup(new maplibregl.Popup().setText(locationString))
      .addTo(map);

    // Fly to location
    map.flyTo({ center: coords, zoom: 12 });
  }
})();
