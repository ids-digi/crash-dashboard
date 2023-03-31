import React from "react"
import './App.css'
import SliderButton from './SliderButton.js'

function Controls(props) {
    const { hexVisibility, setHexVisibility } = props
    return (
        <div className="Controls">
            <h1>Monroe County Crash Dashboard</h1>
            <SliderButton
                textOn="Hexbins shown"
                textOff="Hexbins hidden"
                flag={hexVisibility}
                setFlag={setHexVisibility}
            />
        </div>
    )
}

export default Controls;
