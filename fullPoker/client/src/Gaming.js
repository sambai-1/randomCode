import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import './CSS/Home.css';
import './CSS/Gaming.css'

export default function Home(){
  const [players, setPlayers] = useState([]);
  const [buyIn, setBuyIn] = useState(0);
  const [smallBlind, setSmallBlind] = useState(0);
  const [bigBlind, setBigBlind] = useState(0);
  // const [firstLoad, setFirstLoad] = useState(false);
  const firstLoad = useRef(true);
  const navigate = useNavigate();

  const [players2ID, setP2ID] = useState({});
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [SB, setSB] = useState(0);
  const [BB, setBB] = useState(1);
  const [rows, setRows] = useState([]);
  const actions = ["Check", "Call", "Raise", "Fold", "All In"]
  const rounds = ["preFlop", "flop", "turn", "river"]
  const [roundI, setRoundI] = useState(0);


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
      console.log("data", data)
      if (data) {
        setP2ID(data["players2ID"]);
        setBuyIn(data["buyIn"]);
        setBigBlind(data["bigBlind"]);
        setSmallBlind(data["smallBlind"]);

      }
    };

    fetchGame();
  }, []);

  useEffect(() => {
    const tmp = Object.keys(players2ID);
    setPlayers(tmp);
    setTotalPlayers(tmp.length); 
  }, [players2ID]);

  useEffect(() => {
    if (!firstLoad.current) return;
    if (totalPlayers == 0) return;
    firstLoad.current = false;
    
    // actions : ["Check", "Call", "Raise", "Fold", "All In"]

    setRows(players.map(name => ({ "name": name, 
      "chips": buyIn, "preFlop": 0, "flop": 0, 
      "turn": 0, "river": 0, "actions": [1, 2, 3, 4], "message": "" 
    })));

    const initialBuy = async() => {
      for (const name of players) {
        await playerBuy(name, buyIn);
      }
    };
    
    initialBuy();
  }, [players, buyIn]);

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

  const setBet = (i, amount) => {
    setRows(prevRows => {
      return prevRows.map((row, index) => {
        if (index != i) return row;
        const label = rounds[roundI]
        return { ...row, label: amount};
      })
    })
  } 

  const handleAction = (i, action) => {
    return;
  };

// also have to miplemieent a buy back function to get back to buyIn, update chips

// for saving, create database, col 1 (main) date time, and col 2 is json of moves



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
            <th className="actions borderTable">Actions</th>
            <th className="hidden">Hidden</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            // thoguht about key={row.name} but im lowkey confused by what a key does
            // like its not interactable but makes react itself keep track of things?
            <tr>
              <td className="borderTable centerText">{row.name}</td>
              <td className="borderTable centerText">{row.chips}</td>
              {() => {
                if (isCurrentRound("preFlop")) {
                  return (
                    <input
                      type="number"
                      placeholder="bet..."
                      value={row.preFlop}
                      min="0"
                      step="1"
                      onKeyDown={e => {
                        const blocked = ['e', 'E', '-', '+'];
                        if (blocked.includes(e.key)) e.preventDefault();
                      }}
                      onChange={event => setBet(i, event.target.value)}
                    />
                  )
                } else {
                  return <td className="borderTable centerText ignoredText">{row.preFlop}</td>
                }
              }}
                
                  
              <td className={`borderTable centerText ${isCurrentRound("preFlop") ? "" : "ignoredText"}`}>
              </td>
              <td className={`borderTable centerText ${isCurrentRound("flop") ? "" : "ignoredText"}`}>{row.flop}</td>
              <td className={`borderTable centerText ${isCurrentRound("turn") ? "" : "ignoredText"}`}>{row.turn}</td>
              <td className={`borderTable centerText ${isCurrentRound("river") ? "" : "ignoredText"}`}>{row.river}</td>
              <td className="borderTable centerText">
                {row.actions.map(action => {
                  const label = actions[action];
                  return <button onClick={() => handleAction(i, label)}>{label}</button>
                })}
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