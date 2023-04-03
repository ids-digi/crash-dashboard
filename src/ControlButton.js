import React, { useState, Fragment } from "react"
import './App.css'
import Switch from "react-switch"
import ReactSlider from 'react-slider'
// import 'react-input-checkbox/lib/react-input-checkbox.min.css';
import { Checkbox } from 'react-input-checkbox';

function ControlButton(props) {

    const { type, textOn, textOff, flag, setFlag, flagSecondary, smallLabels, setSecondaryFlag, color } = props

    const [text, setText] = useState(textOn)

    const onChange = () => {

        if (type == "toggle" || type == "checkbox") {
            setFlag(!flag)
            if (setSecondaryFlag) {
                // console.log('setting secondary flag', setSecondaryFlag)
                setSecondaryFlag(flag)
            }
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
                        {/* {color && <div style={{
                            height: '15px',
                            width: '15px',
                            backgroundColor: color,
                            borderRadius: '50%',
                            marginRight: '8px'
                        }} />} */}
                        <span>{text}</span>

                        <Switch
                            className={'react-switch'}
                            onChange={onChange}
                            checked={flag}
                            // onColor={"#000"}
                            offColor={"#bda8a8"}
                            handleDiameter={16}
                            checkedIcon={false}
                            uncheckedIcon={<Fragment />}
                            height={22}
                            width={45}
                        />
                    </label>
                </div>
            )
        case "checkbox":
            return (
                <div className="dashControl">
                    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{text}</span>
                        <Checkbox
                            // theme="fancy-checkbox"
                            // disabled={props.disabled}
                            value={flag}
                            onChange={onChange}
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
                            max={4}
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
