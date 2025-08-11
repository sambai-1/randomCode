import React, {useState, useEffect} from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import WaitRoom from "./WaitRoom";
import PlayerDirectory from "./PlayerDirectory";
import PlayerCreate from "./PlayerCreate";
import Gaming from "./Gaming"

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="waiting-room/:numPlayers" element={<WaitRoom />} />
          <Route path="player-create" element={<PlayerCreate />} />
          <Route path="player-directory" element={<PlayerDirectory />} />
          <Route path="in-game" element={<Gaming />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;