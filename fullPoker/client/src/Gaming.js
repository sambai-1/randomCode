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
//double check the difference between a useState and useRef

  const [SB, setSB] = useState(0);
  const [BB, setBB] = useState(1);
  const [hasAction, setHasAction] = useState(0);
  const [rows, setRows] = useState([]);
  const actions = ["Check", "Call", "Raise", "Fold", "All In"]
  const rounds = ["preFlop", "flop", "turn", "river"]
  const [roundI, setRoundI] = useState(0);
  const [pot, setPot] = useState(0);
  const [sidePot, setSidePot] = useState([1, 2, 3, 4]);

  
  const inputRefs = useRef([]); 


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

    setRows(players.map(name => ({ "name": name, "position": "",  
      "hasAction": false, "stillPlaying": true, "chips": buyIn, "preFlop": 0, "flop": 0, 
      "turn": 0, "river": 0, "actions": [1, 2, 3, 4], "message": "" 
    })));

  const clearRows = (winner) => {
    setRows(prevRows => {
      return prevRows.map((row, index) => {
        let empty = { ...row, "position": "", "hasAction": false, 
          "stillPlaying": true, "preFlop": 0, "flop": 0,
          "turn": 0, "river": 0, "actions": [1, 2, 3, 4], "message": ""
        }
        if (row.chips < bigBlind) {
          if (index == winner)
            return empty
          return { ...empty, "stilPlaying": false, "message": "not enough chips"};
        }
      });
    });
  }

  const resetGame = (winner) => {
    setHasAction((BB + 1) % totalPlayers)
    clearRows(winner);
    setRows(prevRows => {
      return prevRows.map((row, index) => {
        let tmp = row;
        if (index == winner) {
          tmp = { ...tmp, "chips": row.chips + pot};
          setPot(0);
        }
        if (index == SB) tmp = { ...tmp, "position": "SB", "preFlop": smallBlind, "chips": row.chips - smallBlind}
        if (index == BB) tmp = { ...tmp, "position": "BB", "preFlop": bigBlind, "chips": row.chips - bigBlind}
        if (index == hasAction) tmp = { ...tmp, "hasAction": true};

        return tmp
      });
    });
    setSB((SB + 1) % totalPlayers)
    setBB((BB + 1) % totalPlayers)
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

    setRows(players.map(name => ({ "name": name, "position": "",  
      "hasAction": false, "stillPlaying": true, "chips": buyIn, "preFlop": 0, "flop": 0, 
      "turn": 0, "river": 0, "actions": [1, 2, 3, 4], "message": "" 
    })));

    const initialBuy = async() => {
      for (const name of players) {
        await playerBuy(name, buyIn);
      }
    };
    
    initialBuy();

    resetGame(0);

  }, [players, buyIn]);

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

  const setBet = (i, amount) => {
    setRows(prevRows => {
      return prevRows.map((row, index) => {
        if (index != i) return row;
        // return { ...row, "${rounds[roundI]}": amount};
        // whichRound = rounds[roundI]
        // return { ...row, whichRound: amount};
        // i dont understand why it chooses to use the variable name
        // bro who uses square brackets?
        if (row.chips < amount) {
          return row;
        }
        return { ...row, [rounds[roundI]]: amount};
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
    console.log(rows)
  }

  // some sort of new round option when next round is at end
  // rather than navigate to original page, it just sets rows and roundI to defaults
  const isCurrentRound = (roundName) => {
    return roundName == rounds[roundI]
  }

  return (
    <div className="home">
      <h1 className="Title">Players</h1>
      <div className="row">
        <h1 className="messagePots">Current Pot: {pot}</h1>
        {sidePot.map((sideP, i) => (
          <h2 className="messagePots">SidePot {i + 1}: {sideP}</h2>
        ))}
        <button onClick={nextRound}>Next round</button>
      </div>
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

              
              {rounds.map((round) => (
                <td className="borderTable centerText">
                {
                  isCurrentRound(round) ? (
                    <input
                      type="number"
                      placeholder="bet..."
                      value={row[round]}
                      min="0"
                      step="1"
                      onKeyDown={e => {
                        const blocked = ['e', 'E', '-', '+'];
                        if (blocked.includes(e.key)) e.preventDefault();
                      }}
                      onChange={event => setBet(i, event.target.value)}
                    />
                  ) : (
                    <span className="ignoredText"></span>
                  )
                }
                </td>
              ))}
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