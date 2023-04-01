import React, { useState } from "react";
import './App.css';
import Map from './Map.js'
import Controls from './Controls.js'

function App() {

  const [hexVisibility, setHexVisibility] = useState(true)
  const [hexOpacity, setHexOpacity] = useState(2)
  const [dotSize, setDotSize] = useState(4)
  const [districtVisibility, setDistrictVisibility] = useState(true)

  return (
    <div className="App">
      <Controls
        hexVisibility={hexVisibility}
        setHexVisibility={setHexVisibility}
        hexOpacity={hexOpacity}
        setHexOpacity={setHexOpacity}
        dotSize={dotSize}
        setDotSize={setDotSize}
        districtVisibility={districtVisibility}
        setDistrictVisibility={setDistrictVisibility}
      />
      <Map hexVisibility={hexVisibility} hexOpacity={hexOpacity} dotSize={dotSize} districtVisibility={districtVisibility} />
    </div>
  )
}

export default App;
