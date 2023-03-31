import React, { useState } from "react";
import './App.css';
import Map from './Map.js'
import Controls from './Controls.js'

function App() {

  const [hexVisibility, setHexVisibility] = useState(true)
  const [hexOpacity, setHexOpacity] = useState(2)
  const [dotSize, setDotSize] = useState(4)

  return (
    <div className="App">
      <Controls
        hexVisibility={hexVisibility}
        setHexVisibility={setHexVisibility}
        hexOpacity={hexOpacity}
        setHexOpacity={setHexOpacity}
        dotSize={dotSize}
        setDotSize={setDotSize}
      />
      <Map hexVisibility={hexVisibility} hexOpacity={hexOpacity} dotSize={dotSize} />
    </div>
  )
}

export default App;
