import React, { useState, Fragment } from "react"
import './App.css'
import Switch from "react-switch"


function SliderButton(props) {

    const { textOn, textOff, flag, setFlag } = props

    const [text, setText] = useState(textOn)

    const onChange = () => {
        console.log('changing')
        console.log(flag)
        // setChecked(!checked)
        setFlag(!flag)
        setText(flag ? textOff : textOn)
    }

    // const [checked, setChecked] = useState(flag)

    return (
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
    )
}

export default SliderButton;
