import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CSS/Home.css';

export default function Home(){
  const [numPlayer, setPlayer] = useState("");
  const navigate = useNavigate();

  const goWait = async event => {
    event.preventDefault();
    navigate(`/waiting-room/${encodeURIComponent(numPlayer)}`);
  };
  const goCreate = async event => {
    event.preventDefault();
    navigate(`/player-create`);
  };
  const goDirectory = async event => {
    event.preventDefault();
    navigate(`/player-directory`);
  };

  return (
    <div className="home">
      <form onSubmit={goWait}>
        <div className="row">
          <h2 className="title">
            Start Game
          </h2>
        </div>
        <div className="row">
          <input
            type="text"
            value={numPlayer}
            onChange={event=>setPlayer(event.target.value)}
            placeholder="Num Players"
          />
          <button type="submit">Go!</button>
        </div>
      </form>
      <div className="row">
          <h2 className="title">
            Player Directory
          </h2>
        </div>
        <div className="row">
          <button onClick={goCreate}>Create Player</button>
          <button onClick={goDirectory}>Search Player</button>
        </div>
    </div>
    
  );
}