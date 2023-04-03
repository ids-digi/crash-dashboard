import React, { useState } from "react";
import './App.css';
// import Map from './Map.js'
import MapContext from './MapContext.js'
import Controls from './Controls.js'

function App() {

  const [hexVisibility, setHexVisibility] = useState(true)
  const [districtVisibility, setDistrictVisibility] = useState(false)
  const [showDeaths, setShowDeaths] = useState(true)
  const [showInjuries, setShowInjuries] = useState(true)
  const [showMinorCrashes, setShowMinorCrashes] = useState(true)

  return (
    <div className="App">
      <Controls
        hexVisibility={hexVisibility}
        setHexVisibility={setHexVisibility}
        districtVisibility={districtVisibility}
        setDistrictVisibility={setDistrictVisibility}
        showDeaths={showDeaths}
        setShowDeaths={setShowDeaths}
        showInjuries={showInjuries}
        setShowInjuries={setShowInjuries}
        showMinorCrashes={showMinorCrashes}
        setShowMinorCrashes={setShowMinorCrashes}

      />
      <MapContext
        hexVisibility={hexVisibility}
        districtVisibility={districtVisibility}
        showDeaths={showDeaths}
        showInjuries={showInjuries}
        showMinorCrashes={showMinorCrashes}
      />
    </div>
  )
}

export default App;
