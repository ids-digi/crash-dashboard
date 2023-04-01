import React, { useState, useEffect, useRef } from "react";
import geojson from './data/master_crash_clean.geojson'
import districts from './data/city-council-districts.geojson'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

function Map(props) {
    const { hexVisibility, hexOpacity, dotSize } = props
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3RlcmJ1c2giLCJhIjoiY2t0dnZrYjM4MmU0aDJvbzM1dTFqbDY1NiJ9.zdZur9mZOlVhIxAoiqVwBA'

    const [long, setLong] = useState(-86.52702437238956);
    const [lat, setLat] = useState(39.1656613635316);
    const [zoom, setZoom] = useState(12);
    const [data, setData] = useState(geojson)



    // const [hexVisibility, setHexVisibility] = useState('visible')

    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    const bbox = [-86.70764843085207, 38.980672784175255, -86.33708588689486, 39.54695628365925]
    const cellSide = .5;
    const options = {};
    const hexGridData = turf.hexGrid(bbox, cellSide, options);

    // console.log(hexGridData)

    useEffect(() => {
        fetch(data)
            .then(response => {
                return response.json();
            })
            .then(data => setData(data));

    }, [])

    useEffect(() => {
        // mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/dark-v10", // stylesheet location
                center: [long, lat],
                zoom: zoom,
                minZoom: 10
            }).fitBounds([
                [-86.61974841955835, 39.111017400606066],
                [-86.46310073817295, 39.21646913099789]
            ]).addControl(
                new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl
                })
            )

            hexGridData.features.map((hex) => {
                hex.properties.numPoints = turf.within(data, hex).features.length
                return hex
            })

            const binWMostPoints = hexGridData.features.reduce(
                (prev, current) => {
                    return prev.properties.numPoints > current.properties.numPoints ? prev : current
                }
            )

            hexGridData.features.map((hex) => {
                hex.properties.density = hex.properties.numPoints / binWMostPoints.properties.numPoints
                return hex
            })

            // Create a popup, but don't add it to the map yet.
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            })

            map.on("load", () => {
                setMap(map)
                map.resize()

                map.addSource('crash-data-source', {
                    'type': 'geojson',
                    'data': data
                })

                map.addSource('council-districts', {
                    'type': 'geojson',
                    'data': districts
                })

                map.addLayer({
                    id: 'districts',
                    type: 'fill',
                    source: 'council-districts',
                    // filter: ['!', ['has', 'point_count']],
                    paint: {
                        'fill-color': '#0080ff', // blue color fill
                        'fill-opacity': 0.5
                    }
                })

                map.addLayer({
                    id: 'points',
                    type: 'circle',
                    source: 'crash-data-source',
                    // filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': "#3182bd",
                        'circle-radius': 2.5,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': 'transparent',
                        'circle-opacity': 0.3
                    }
                })

                map.addLayer({
                    id: 'hexBins',
                    type: 'fill',
                    source: {
                        'type': 'geojson',
                        'data': hexGridData
                    },
                    'layout': {
                        'visibility': 'visible'
                    },
                    'paint': {
                        'fill-color': '#088',
                        'fill-opacity': [
                            "interpolate", ["linear"], ["get", "density"],
                            // if there are zero points, opacity = 0
                            0, 0,
                            // if the density = 1, opacity = 60%
                            1, .8
                        ]
                    }
                })

                    .on('mouseenter', 'points', (e) => {
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
                    });

                map.on('mouseleave', 'points', () => {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                });

            })
        }

        if (!map) initializeMap({ setMap, mapContainer });

    }, [data]);

    useEffect(() => {
        if (map) {
            map.setLayoutProperty('hexBins', 'visibility', hexVisibility ? 'visible' : 'none');
        }
    }, [hexVisibility])

    useEffect(() => {
        if (map) {
            map.setPaintProperty('hexBins', 'fill-opacity', [
                "interpolate", ["linear"], ["get", "density"],
                // if there are zero points, opacity = 0
                0, 0,
                // if the density = 1, opacity = 60%
                1, hexOpacity * .2
            ])
        }
    }, [hexOpacity])

    useEffect(() => {
        if (map) {
            map.setPaintProperty('points', 'circle-radius', dotSize * 1.5)
        }
    }, [dotSize])

    // useEffect(() => {
    //     console.log(new Date().toLocaleDateString('en-us', { hour: "numeric", year: "numeric", month: "short", day: "numeric" }))
    // })

    return (
        <div ref={mapContainer} className="mapContainer" />
    )
}


export default Map