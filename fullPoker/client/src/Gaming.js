import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './CSS/Home.css';
import './CSS/Gaming.css'

export default function Home(){
  const [players, setPlayers] = useState([]);
  const [buyIn, setBuyIn] = useState("");
  const [smallBlind, setSmallBlind] = useState("");
  const [bigBlind, setBigBlind] = useState("");
  const navigate = useNavigate();
  let players2ID = {};

  let totalPlayers = 0;
  let SB = 0;
  let BB = 1;
  let action = (BB + 1) % totalPlayers;
  const [rows, setRows] = useState([]);


  useEffect(() => {
    const fetchGame = async() => {
      const res = await fetch('/api/createGame', {
        method: "GET",
      });
      const data = await res.json();
      if (data) {
        players2ID = data["players2ID"];
        const tmp = players2ID;
        // console.log("players2ID", players2ID)
        setBuyIn(data["buyIn"]);
        setBigBlind(data["bigBlind"]);
        setSmallBlind(data["smallBlind"]);
        setPlayers(Object.keys(tmp));

        totalPlayers = players2ID.length;
      }
    };

    fetchGame();
  }, []);

  useEffect(() => {
    setRows(Array.from({ length: totalPlayers }, () => ({ player: "", locked: false , message: "" })));
  }, [totalPlayers]);


  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

// also have to miplemieent a buy back function to get back to buyIn, update chips

// for saving, create database, col 1 (main) date time, and col 2 is json of moves

  return (
    <div className="home">
      <h1 className="Title">Players</h1>
      <table className="borderTable">
        <tr>
          <th className="name borderTable">Name</th>
          <th className="chips borderTable">Chips</th>

          <th className="actions borderTable">PreFlop</th>
          <th className="actions borderTable">Flop</th>
          <th className="actions borderTable">Turn</th>
          <th className="actions borderTable">River</th>
          <th className="actions borderTable">Actions</th>
        </tr>

        <tbody>
          {players.map(p => (
            <tr key={p.id}>
              <td className="borderTable centerText">{p.name}</td>
              <td className="borderTable centerText">{p.chips}</td>
              <td className="borderTable centerText">
                <Link to={`/players/${p.id}/history`}>History</Link><br/>
                <Link to={`/players/${p.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {
      //change to button that submits, but only when round is finished
      }
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
}