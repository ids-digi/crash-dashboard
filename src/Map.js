import React, { useState, useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import districts from './data/city-council-districts.geojson'
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

function Map(props) {
    const { hexVisibility, districtVisibility, data, hexGridData } = props

    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    const districtColor = "rgba(255,255,255,0.2)"
    const hexColor = "rgb(119, 216, 240)"
    const pointColor = "yellow"
    const borderColor = "rgb(53, 53, 53)"

    useEffect(() => {

        /* 
            INITIALIZE MAP
        */
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                // it will know where to put the map based on the mapContainer ref
                container: mapContainer.current,
                // style: "mapbox://styles/mapbox/dark-v10",
                style: "mapbox://styles/cterbush/clfyfv364003s01o4xuofdpp3",
                // center it over Bloomington
                center: [-86.52702437238956, 39.1656613635316],
                zoom: 12,
                // prevent from zooming out too far
                minZoom: 10
            }).addControl(
                // add geocoder to enable search
                new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl
                })
            )

            map.on("load", () => {
                setMap(map)
                map.resize()

                /*
                    ADD DATA SOURCES
                */
                // crash data points 
                map.addSource('crash-data-source', {
                    'type': 'geojson',
                    'data': data
                })
                // city council district areas 
                map.addSource('council-districts', {
                    'type': 'geojson',
                    'data': districts
                })
                // hexbins geojson (generated in MapContext)
                map.addSource('hexbin-data', {
                    'type': 'geojson',
                    'data': hexGridData
                })

                /*
                    ADD LAYERS + STYLING
                */
                // city council districts
                map.addLayer({
                    id: 'districts',
                    type: 'fill',
                    source: 'council-districts',
                    paint: {
                        'fill-color': districtColor,
                        'fill-opacity': ['case',
                            ['boolean', ['feature-state', 'hover'], false],
                            0.8,
                            0.5
                        ]
                    },
                }).addLayer({
                    // gray border on each district
                    'id': 'district-borders',
                    'type': 'line',
                    'source': 'council-districts',
                    'layout': {},
                    'paint': {
                        'line-color': borderColor,
                        'line-width': 2
                    }
                }).addLayer({
                    // label each district
                    'id': 'district-labels',
                    'type': 'symbol',
                    'source': 'council-districts',
                    'layout': {
                        'text-field': [
                            'format',
                            ['get', 'district_name'],
                            { 'font-scale': 0.6 }
                        ],
                    },
                    "paint": {
                        "text-color": borderColor
                    }
                })

                // hexbins
                map.addLayer({
                    id: 'hexBins',
                    type: 'fill',
                    source: 'hexbin-data',
                    // set visibility as visible initially
                    // then it can be toggled later 
                    'layout': {
                        'visibility': 'visible'
                    },
                    'paint': {
                        'fill-color': hexColor,
                        'fill-opacity': [
                            "interpolate", ["linear"], ["get", "density"],
                            // if there are zero points, max opacity = 0
                            0, 0,
                            // if the density = 1, max opacity = 80%
                            1, .8
                        ]
                    }
                }).addLayer({
                    // light border on each hexbin
                    'id': 'hex-borders',
                    'type': 'line',
                    'source': 'hexbin-data',
                    'layout': {},
                    'paint': {
                        'line-color': borderColor,
                        'line-width': ['match', ['get', 'density'], 0, 0, 1]
                    }
                })

                // individual crash data points
                map.addLayer({
                    id: 'points',
                    type: 'circle',
                    source: 'crash-data-source',
                    paint: {
                        'circle-color': pointColor,
                        // adjust circle radius based on zoom level
                        'circle-radius': ['interpolate', ['linear'], ['zoom'],
                            // at zoom level 10 => 1 px
                            10, 1,
                            // at zoom level 12 => 1.5 px
                            12, 1.5,
                            14, 3,
                            // at zoom level 20 => 20 px
                            20, 20],
                        // no stroke
                        'circle-stroke-width': 0,
                        'circle-opacity': 0.3
                    }
                })

                /*
                    POPUPS & HOVER EFFECTS
                */
                // Create a popup, but don't add it to the map yet.
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                })

                // display the popup when a point is hovered over
                map.on('mouseenter', 'points', (e) => {
                    // Change the cursor style as a UI indicator.
                    map.getCanvas().style.cursor = 'pointer';

                    // Copy coordinates array.
                    const coordinates = e.features[0].geometry.coordinates.slice()
                    const primaryFactor = e.features[0].properties["Primary Factor"]
                    const date = e.features[0].properties.DateTime

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    let popupHTML = `
                            <p style=margin-bottom:0;><strong>${new Date(date).toLocaleDateString('en-us', { hour: "numeric", year: "numeric", month: "short", day: "numeric" })}</strong></p>
                            <p style=margin-bottom:0;>Primary factor: ${primaryFactor.charAt(0).toUpperCase() + primaryFactor.slice(1).toLowerCase()}</p>
                        `

                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup.setLngLat(coordinates).setHTML(popupHTML).addTo(map);
                })

                // hide the popup when the point is no longer hovered
                map.on('mouseleave', 'points', () => {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                })

                // hover effect => council districts
                let hoveredStateId = null;

                // map.on('mousemove', 'districts', (e) => {
                //     console.log(e.features[0])

                //     if (e.features.length > 0) {
                //         if (hoveredStateId !== null) {
                //             map.setFeatureState(
                //                 { source: 'council-districts', id: hoveredStateId },
                //                 { hover: false }
                //             );
                //         }
                //         hoveredStateId = e.features[0].properties.district_id;
                //         map.setFeatureState(
                //             { source: 'council-districts', id: hoveredStateId },
                //             { hover: true }
                //         );
                //     }
                // })

            })
        }

        if (!map) initializeMap({ setMap, mapContainer });

    }, [data, hexGridData]);

    useEffect(() => {
        if (map) {
            map.setLayoutProperty('hexBins', 'visibility', hexVisibility ? 'visible' : 'none');
            map.setLayoutProperty('hex-borders', 'visibility', hexVisibility ? 'visible' : 'none');
        }

        console.log(map)

    }, [hexVisibility])

    useEffect(() => {
        if (map) {
            map.setLayoutProperty('districts', 'visibility', districtVisibility ? 'visible' : 'none');
            map.setLayoutProperty('district-labels', 'visibility', districtVisibility ? 'visible' : 'none');
            map.setLayoutProperty('district-borders', 'visibility', districtVisibility ? 'visible' : 'none');
        }

        console.log(map)
    }, [districtVisibility])

    return (
        <div ref={mapContainer} className="mapContainer" />
    )
}


export default Map