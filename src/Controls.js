import React from "react"
import './App.css'
import ControlButton from './ControlButton.js'

function Controls(props) {
    const {
        hexVisibility,
        setHexVisibility,
        hexOpacity,
        setHexOpacity,
        dotSize,
        setDotSize,
        districtVisibility,
        setDistrictVisibility
    } = props
    return (
        <div className="Controls">
            <svg className="logo" viewBox="0 0 163.17 68.85">
                <path style={{ fill: "#990000" }} d="M0,67.77V1.08H19.89V67.77Z" />
                <path style={{ fill: "#990000" }}
                    d="M32.85,67.77V1.08H58.32c19.44,0,38.34,6.21,38.34,33.3,0,26.64-20.07,33.39-39.6,33.39ZM52.74,50.4h5.85c12.06,0,17.91-4.41,17.91-16s-5.67-15.3-18.81-15.3H52.74Z" />
                <path style={{ fill: "#990000" }}
                    d="M98.82,59l9.54-13.59c6.66,4.59,15.93,7,23.31,7,9.45,0,11.7-2.16,11.7-4.86s-2.7-3.78-12.51-4.59c-14.31-1.17-28.26-4.86-28.26-21.15C102.6,5.67,115.83,0,131,0c15.84,0,24.48,4.05,29.16,7.83l-9.9,14.31c-3.78-2.52-12.33-4.77-19-4.77s-8.73,1.08-8.73,3.69c0,3.24,2.79,4.05,12.69,4.86,14.94,1.26,28,4.14,28,20.7,0,13.5-11.52,22.23-30.87,22.23C114.66,68.85,105.84,64.53,98.82,59Z" />
            </svg>
            <h1>Monroe County Crash Dashboard</h1>
            <p><em><a href="#" >About the data</a></em></p>

            <h2>Filters</h2>

            <h2>Style</h2>
            <ControlButton
                type="toggle"
                textOn="Districts shown"
                textOff="Districts hidden"
                flag={districtVisibility}
                setFlag={setDistrictVisibility}
            />
            <ControlButton
                type="toggle"
                textOn="Hexbins shown"
                textOff="Hexbins hidden"
                flag={hexVisibility}
                setFlag={setHexVisibility}
            />
            {/* <ControlButton
                type="slider"
                textOn="Hexbin opacity"
                flag={hexOpacity}
                setFlag={setHexOpacity}
                flagSecondary={hexVisibility}
                smallLabels={["Lighter", "Darker"]}
            /> */}
            {/* <ControlButton
                type="slider"
                textOn="Dot size"
                flag={dotSize}
                setFlag={setDotSize}
                flagSecondary={'null'}
                smallLabels={["Smaller", "Larger"]}
            /> */}
        </div>
    )
}

export default Controls;
