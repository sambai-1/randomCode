import React, {useState, useEffect} from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import WaitRoom from "./WaitRoom";

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="waiting-room/:numPlayers" element={<WaitRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;