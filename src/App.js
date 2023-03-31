import React, { useState } from "react";
import './App.css';
import Map from './Map.js'
import Controls from './Controls.js'

function App() {

  const [hexVisibility, setHexVisibility] = useState(true)

  return (
    <div className="App">
      {/* <header>
        <h1>Monroe County Crash Dashboard</h1>
      </header> */}
      <Controls hexVisibility={hexVisibility} setHexVisibility={setHexVisibility} />
      <Map hexVisibility={hexVisibility} />
    </div>
  )
}

export default App;
