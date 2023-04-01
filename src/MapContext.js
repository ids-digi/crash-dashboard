import React, { useState, useEffect } from "react"
import './App.css'
import Map from './Map.js'
// import geojson from './data/master_crash_clean.min.geojson'
import geojson from './data/master_crash_clean.sample.geojson'
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf'

function MapContext(props) {
    const {
        hexVisibility, districtVisibility
    } = props

    mapboxgl.accessToken = 'pk.eyJ1IjoiY3RlcmJ1c2giLCJhIjoiY2t0dnZrYjM4MmU0aDJvbzM1dTFqbDY1NiJ9.zdZur9mZOlVhIxAoiqVwBA'

    const [data, setData] = useState(geojson)
    const [hexGridData, setHexGridData] = useState(null)

    useEffect(() => {
        const bbox = [-86.70764843085207, 38.980672784175255, -86.33708588689486, 39.54695628365925]
        const cellSide = .5;
        const options = {};
        const hexagons = turf.hexGrid(bbox, cellSide, options);

        hexagons.features.map((hex, i) => {
            const internalData = turf.within(data, hex).features
            hex.id = i
            hex.properties.data = internalData.map((d) => d.properties)
            hex.properties.numPoints = internalData.length
            return hex
        })

        const binWMostPoints = hexagons.features.reduce(
            (prev, current) => {
                return prev.properties.numPoints > current.properties.numPoints ? prev : current
            }
        )

        hexagons.features.map((hex) => {
            hex.properties.density = hex.properties.numPoints / binWMostPoints.properties.numPoints
            return hex
        })

        setHexGridData(hexagons)
    }, [data])

    useEffect(() => {
        fetch(data)
            .then(response => {
                return response.json();
            })
            .then(data => setData(data));

    }, [])

    return (
        <Map
            hexVisibility={hexVisibility}
            districtVisibility={districtVisibility}
            data={data}
            hexGridData={hexGridData}
        />
    )
}

export default MapContext;
