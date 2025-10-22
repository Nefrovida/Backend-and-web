import React from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((e) => console.log(`Error: ${e}`));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Inicio de la aplicación: App()</p>
      </header>
    </div>
  );
}

export default App;
