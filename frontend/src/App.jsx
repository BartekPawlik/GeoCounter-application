import React from "react";
import Title from "./components/UI/Title";
import Tabs from "./components/Tabs/Tabs";

function App() {
  return (
    <div className="app">
      <Title />
      <div className="panel-tab">
        <Tabs />
      </div>
    </div>
  );
}
export default App;
