import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './CSS/Home.css';
import './CSS/PlayerDirectory.css'

export default function Home(){
  const [players, setPlayers] = useState([]);
  const [buyIn, setBuyIn] = useState("");
  const [smallBlind, setSmallBlind] = useState("");
  const [bigBlind, setBigBlind] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async() => {
      const res = await fetch('/api/createGame');
      const data = await res.json();
      if (data) {
        setPlayers(data["players"]);
        setBuyIn(data["buyIn"]);
        setBigBlind(data["bigBlind"]);
        setSmallBlind(data["smallBlind"]);
      }
    };

    fetchGame();
  }, []);

// delete go back option. change to cash out

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

// also have to miplemieent a buy back function to get back to buyIn, update chips

// for saving, create database, col 1 (main) date time, and col 2 is json of moves

  return (
    <div className="home">
      <h1 className="Title">Players</h1>
      <h2>{players}</h2>
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
}