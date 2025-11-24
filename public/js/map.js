
    maplibregl.setRTLTextPlugin(
        'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
        true // Lazy load the plugin
    );

    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://tiles.openfreemap.org/styles/bright',
        center: [85.3300, 23.3500],
        zoom: 11
    });
