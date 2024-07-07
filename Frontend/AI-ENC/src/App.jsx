import React from "react";
import Chat from "./components/Chat";
import "./style/App.css";
import Header from "./components/Header";

function App() {
  return (
    <>
      <div className="background" />
      <div className="content">
        <Header />
        <br />
        <Chat />
      </div>
    </>
  );
}

export default App;
