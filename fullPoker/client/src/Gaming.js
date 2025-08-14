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

  const [players2ID, setP2ID] = useState({});
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [SB, setSB] = useState(0);
  const [BB, setBB] = useState(1);
  const [rows, setRows] = useState([]);


  const playerBuy = async (name, amount = buyIn) => {
    console.log("buyIn player %r", name)
    const payload = { "playerID": players2ID[name], "buyIn": amount }
    try {
      const buyBack = await fetch("/api/buyIn", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });

      const body = await buyBack.json();

      if (!body.success){
        console.error("Create failed: ", body.error);
      }
    } catch (err) {
      console.error("error occored: ", err);
    }
  }

  useEffect(() => {
    const fetchGame = async() => {
      const res = await fetch('/api/createGame', {
        method: "GET",
      });
      const data = await res.json();
      if (data) {
        setP2ID(data["players2ID"]);
        const tmp = players2ID;
        // console.log("players2ID", players2ID)
        setBuyIn(data["buyIn"]);
        setBigBlind(data["bigBlind"]);
        setSmallBlind(data["smallBlind"]);
        setPlayers(Object.keys(tmp));
        setTotalPlayers(players.length);
      }
    };

    fetchGame();
  }, []);


  useEffect(() => {
    if (totalPlayers == 0) return;
  
    setRows(players.map(name => ({ "name": name, "chips": buyIn, "preFlop": 0, "flop": 0, "turn": 0, "river": 0, "message": "" })));

    for (let name of players) {
      playerBuy(name);
    }
  }, [players, buyIn, playerBuy]);

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

// also have to miplemieent a buy back function to get back to buyIn, update chips

// for saving, create database, col 1 (main) date time, and col 2 is json of moves


  const rounds = ["preFlop", "flop", "turn", "river"]
  const [roundI, setRoundI] = useState(0);
  const nextRound = () => {
    if (roundI < 3) {
      setRoundI(prevI => (prevI + 1) % rounds.length)
    }
  }
  const isCurrentRound = (roundName) => {
    return roundName == rounds[roundI]
  }

  return (
    <div className="home">
      <h1 className="Title">Players</h1>
      <button onClick={nextRound}>Next round</button>
      <table className="borderTable">
        {/* <colgroup>
          <col className="name" />
          <col className="chips" />
          <col className={`${isCurrentRound("preFlop") ? "chips" : "ignoreCol"}`} />
          <col className={`${isCurrentRound("Flop") ? "chips" : "ignoreCol"}`} />
          <col className={`${isCurrentRound("Turn") ? "chips" : "ignoreCol"}`} />
          <col className={`${isCurrentRound("River") ? "chips" : "ignoreCol"}`} />
          <col className="actions"/>
        </colgroup> */}
      
        <thead>
          <tr>
            <th className="name borderTable">Name</th>
            <th className="chips borderTable">Chips</th>
            <th className={`borderTable ${isCurrentRound("preFlop") ? "chips" : "ignoredHead"}`}>PreFlop</th>
            <th className={`borderTable ${isCurrentRound("flop") ? "chips" : "ignoredHead"}`}>Flop</th>
            <th className={`borderTable ${isCurrentRound("turn") ? "chips" : "ignoredHead"}`}>Turn</th>
            <th className={`borderTable ${isCurrentRound("river") ? "chips" : "ignoredHead"}`}>River</th>
            <th className="hidden">Hidden</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(row => (
            // thoguht about key={row.name} but im lowkey confused by what a key does
            // like its not interactable but makes react itself keep track of things?
            <tr>
              <td className="borderTable centerText">{row.name}</td>
              <td className="borderTable centerText">{row.chips}</td>
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