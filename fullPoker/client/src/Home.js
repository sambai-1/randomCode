import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CSS/Home.css';

export default function Home(){
  const [numPlayer, setPlayer] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const goWait = async event => {
    event.preventDefault();
    try {
      const res = await fetch("/api/countPlayers");
      if (!res.ok) console.error("count players error: ", res.error);
      const { totalPlayers } = await res.json();

      console.log(totalPlayers)
      console.log(numPlayer)
      
      if (numPlayer <= 1) {
        setMessage("Needs at least 2 players")
      } else if (numPlayer > totalPlayers) {
        setMessage("Not Enough Registered Players")
      } else {
        navigate(`/waiting-room/${encodeURIComponent(numPlayer)}`);
      }
    } catch (err) {
      console.error("Failed to fetch player count:", err);
    }
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
            type="number"
            value={numPlayer}
            onChange={event=>setPlayer(event.target.value)}
            placeholder="Num Players"
          />
          <button type="submit">Go!</button>
        </div>
      </form>

      {message && (
        <div className="row">
          <h2 className="message">{message}</h2>
        </div>
      )}

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