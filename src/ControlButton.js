import React, { useState, Fragment } from "react"
import './App.css'
import Switch from "react-switch"
import ReactSlider from 'react-slider'

function ControlButton(props) {

    const { type, textOn, textOff, flag, setFlag, flagSecondary, smallLabels } = props

    const [text, setText] = useState(textOn)

    const onChange = () => {

        if (type == "toggle") {
            setFlag(!flag)
            setText(flag ? textOff : textOn)
        } else if (type == "slider") {

        }
    }

    // const [checked, setChecked] = useState(flag)

    switch (type) {
        case "toggle":
            return (
                <div className="dashControl">
                    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{text}</span>
                        <Switch
                            onChange={onChange}
                            checked={flag}
                            // onColor={"#000"}
                            handleDiameter={16}
                            checkedIcon={false}
                            uncheckedIcon={<Fragment />}
                            height={22}
                            width={45}
                        />
                    </label>
                </div>
            )
        case "slider":
            return (
                <div className="dashControl">
                    <label className={`react-slider ${flagSecondary !== 'null' ? !flagSecondary ? 'disabled' : '' : ''}`}>
                        <span>{textOn}</span>
                        <ReactSlider
                            disabled={flagSecondary !== 'null' ? !flagSecondary : false}
                            defaultValue={2}
                            markClassName="mark"
                            className="react-slider"
                            min={1}
                            max={5}
                            // marks={1}
                            thumbClassName="thumb"
                            trackClassName="track"
                            onChange={(val) => setFlag(val)}
                        // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="small-label">{smallLabels[0]}</span>
                            <span className="small-label">{smallLabels[1]}</span>
                        </div>
                    </label>
                </div>
            )
    }
}

export default ControlButton;
