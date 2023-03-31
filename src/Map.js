import React, { useState, useEffect, useRef } from "react";
import geojson from './data/master_crash_clean.geojson'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

function Map(props) {
    const { hexVisibility } = props
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

    useEffect(() => {
        fetch(data)
            .then(response => {
                return response.json();
            })
            .then(data => setData(data));

    }, [])

    useEffect(() => {
        console.log('rendering map, hex visibility == ', hexVisibility)
        // mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/dark-v10", // stylesheet location
                center: [long, lat],
                zoom: zoom
            }).fitBounds([
                [-86.61974841955835, 39.111017400606066],
                [-86.46310073817295, 39.21646913099789]
            ]).addControl(
                new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl
                })
            );

            hexGridData.features.map((hex) => {
                hex.properties.numPoints = turf.within(data, hex).features.length
                return hex
            })

            const binWMostPoints = hexGridData.features.reduce(
                (prev, current) => {
                    return prev.properties.numPoints > current.properties.numPoints ? prev : current
                }
            )

            map.on("load", () => {
                setMap(map)
                map.resize()

                map.addSource('crash-data-source', {
                    'type': 'geojson',
                    'data': data
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
                    'id': 'maine',
                    'type': 'fill',
                    'source': {
                        'type': 'geojson',
                        'data': hexGridData
                    },
                    'layout': {
                        'visibility': hexVisibility == true ? 'visible' : 'none'
                    },
                    'paint': {
                        'fill-color': '#088',
                        'fill-opacity': [
                            "interpolate", ["linear"], ["get", "numPoints"],
                            // if there are zero points, opacity = 0
                            0, 0,
                            // if the number of points = the max, opacity = 60%
                            binWMostPoints.properties.numPoints, .6
                        ]
                    }
                })

            })

            // map.on('idle', () => {

            // })


        };

        if (!map) initializeMap({ setMap, mapContainer });


    }, [map, data, hexVisibility]);

    return (
        <div ref={mapContainer} className="mapContainer" />
    )
}


export default Map