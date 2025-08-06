import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CSS/Home.css';
import './CSS/main.css';

export default function Home(){
  const [numPlayer, setPlayer] = useState("");
  const navigate = useNavigate();

  const submit = async event => {
    event.preventDefault();
    navigate(`/waiting-room/${encodeURIComponent(numPlayer)}`);
  };

  return (
    <form onSubmit={submit} className="home">
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
  );
}