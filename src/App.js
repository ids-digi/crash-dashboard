import React, { useState } from "react";
import './App.css';
// import Map from './Map.js'
import MapContext from './MapContext.js'
import Controls from './Controls.js'

function App() {

  const [hexVisibility, setHexVisibility] = useState(true)
  const [districtVisibility, setDistrictVisibility] = useState(true)

  return (
    <div className="App">
      <Controls
        hexVisibility={hexVisibility}
        setHexVisibility={setHexVisibility}
        districtVisibility={districtVisibility}
        setDistrictVisibility={setDistrictVisibility}
      />
      <MapContext hexVisibility={hexVisibility} districtVisibility={districtVisibility} />
    </div>
  )
}

export default App;
