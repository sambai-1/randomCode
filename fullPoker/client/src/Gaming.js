import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { nextEligible, resetGameUtil } from "./gaming.utils";
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

  const [SB, setSB] = useState(-1);
  const [BB, setBB] = useState(0);
  const [hasAction, setHasAction] = useState(0);
  const [rows, setRows] = useState([]);
  const actions = ["Check", "Call", "Raise", "Fold", "All In"]
  const rounds = ["preFlop", "flop", "turn", "river"]
  const [roundI, setRoundI] = useState(0);
  const [pot, setPot] = useState(0);
  const [sidePot, setSidePot] = useState([-1]);
  const [minBet, setMinBet] = useState(0);
  const [prevRaise, setPrevRaise] = useState(0);
  
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

  const resetGame = (winner) => {
    setRows((prevRows) => {
      const result = resetGameUtil(prevRows, {winner, pot, SB, BB, bigBlind, smallBlind});

      setPot(result.pot);
      setSB(result.SB);
      setBB(result.BB);
      setHasAction(result.hasAction);
      return result.rows;

    });
  };

  const resetAction = () => {
    const nextStart = nextEligible(rows, SB)
    console.log("Ressetting action, next player to start", nextStart);
    setHasAction(nextStart);
    setRows(prevRows => {
      return prevRows.map((row, i) => {
        if (i === nextStart) return { ...row, toMove: true, hasAction: true}
        else return { ...row, toMove: true, hasAction: false}
      })
    })

  }

  const incrementAction = () => {
    const nextHasAction = nextEligible(rows, (hasAction + 1) % totalPlayers);
    if (rows[nextHasAction].toMove) {
      setRows((prevRows) => {
        return prevRows.map((row, i) => {
          if (i === nextHasAction) return { ...row, hasAction: true};
          return { ...row, hasAction: false};
        })
      });
      setHasAction(nextHasAction);
    } else {
      resetAction();
      nextRound();
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

    setRows(
      players.map((name) => ({
        "name": name,
        "position": "",
        "stillPlaying": true,
        "hasAction": false,
        "toMove": true,
        "chips": Number(buyIn),
        "currentBet": 0,
        "preFlop": 0,
        "flop": 0,
        "turn": 0,
        "river": 0,
        "actions": [1, 2, 3, 4],
        "message": "",
      }))
    );

    const initialBuy = async() => {
      for (const name of players) {
        await playerBuy(name, buyIn);
      }
    };
    
    initialBuy();
    resetGame(0);
    setMinBet(bigBlind)
    setPrevRaise(bigBlind)

  }, [players, buyIn]);

  useEffect(() => {
    setRows(prevRows => {
      return prevRows.map((row, i) => {
        if (row.currentBet === minBet) return { ...row, actions: [0, 2, 3, 4]}
        if (row.chips + row.currentBet < minBet) return { ...row, actions: [3, 4]}
        return { ...row, actions: [1, 2, 3, 4]}
      })
    })
  }, [minBet, hasAction]);

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

  const updateBet = (i, amount) => {
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

  const setBet = (i, amount) => {
    setRows(prevRows => {
      return prevRows.map((row, index) => {
        if (index != i) return row;
        const prev = row
        return { ...prev,  
          chips: prev.chips + prev.currentBet - amount, 
          currentBet: amount, 
          [rounds[roundI]]: 0};
      })  
    })
  }

  const setMessage = (i, message) => {
    setRows(prevRows => {
      return prevRows.map((row, index) => {
        if (index != i) return row;
        return { ...row, "message": message}
      })
    })
  }

  const resetMoveButI = (i) => {
    for (let j = 0; j < totalPlayers; j++) {
      if (i !== j) rows[j].toMove = true;
    }
  }

  const handleAction = (i, action) => {
    console.log(rows)
    if (!rows[i].hasAction) {
      setMessage(i, "not your turn yet");
      return;
    }
    if (action === "Check") {
      rows[i].toMove = false;
      incrementAction();
    }
    if (action === "Call") {
      if (rows[i].chips + rows[i].currentBet < minBet) setMessage(i, "not enough chips");
      else {
        rows[i].toMove = false;
        setPot(pot + minBet - rows[i].currentBet);
        setBet(i, minBet);
        incrementAction();
      }
    }
    if (action === "Raise") {
      const addition = Number(rows[i][rounds[roundI]])
      /* bro why did I need to use Number() here???
      console.log(addition + 1)
      console.log(rows[i].currentBet + 1)
      console.log(prevRaise + minBet)
      console.log(rows[i].currentBet + addition)
      console.log(prevRaise + minBet)
      console.log((rows[i].currentBet + addition) < (prevRaise + minBet))
      */
      if ((rows[i].currentBet + addition) < (prevRaise + minBet)) setMessage(i, "smaller than Min Raise")
      else {
        rows[i].toMove = false;
        resetMoveButI(i);
        setBet(i, rows[i].currentBet + addition)
        setPrevRaise(rows[i].currentBet + addition - minBet)
        setMinBet(rows[i].currentBet + addition)
        setPot(pot + addition)
        incrementAction();
      }
    }

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
        <h1 className="messagePots">Minimum Bet: {minBet}</h1>
        <h1 className="messagePots">Minimum Raise: {minBet + prevRaise}</h1>
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
            <th className="chips borderTable">Bet</th>
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
              <td className="borderTable">
                <span className="centerText">{row.name}</span>
                <span className="rightText">{row.position}</span>
                {
                  row.hasAction ? (
                    <h1>your turn</h1>
                  ) : (
                    <h1>not turn</h1>
                  )
                }
                {
                  row.toMove ? (
                    <h1>to Move</h1>
                  ) : (
                    <h1>no Move</h1>
                  )
                }
              </td>
              <td className="borderTable centerText">{row.chips}</td>
              <td className="borderTable centerText">{row.currentBet}</td>
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
                      onChange={event => updateBet(i, event.target.value)}
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
              <td className="borderTable centerText">{row.message}</td>
            </tr>
          ))}
        </tbody>

      </table>
      <br></br>
      <div className="row">
        <h1 className="messagePots">Buy In: {buyIn}</h1>
        <h1 className="messagePots">Small Blind: {smallBlind}</h1>
        <h1 className="messagePots">Big Blind: {bigBlind}</h1>
      </div>
      {
      //change to button that submits, but only when round is finished
      }
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
}