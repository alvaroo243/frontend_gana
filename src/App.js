import React, { useState } from "react";
import Tabla from "./Components/src/Tabla/Tabla";
import Formularios from "./Components/src/Form/Formularios";
import './index.css';



function App() {
  const [actualizarTabla, setActualizarTabla] = useState(false);
  
  return (
    <div className="App">
      <Formularios titulo="Nuevo" id={0} actualizarTabla= {actualizarTabla} setActualizarTabla={setActualizarTabla} />
      <Tabla actualizarTabla= {actualizarTabla} setActualizarTabla={setActualizarTabla} />
    </div>
  );
}

export default App;