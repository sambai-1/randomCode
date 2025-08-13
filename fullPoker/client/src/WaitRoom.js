

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useId } from "react";
import './CSS/Home.css';
import './CSS/WaitRoom.css';

export default function WaitRoom(){
  const { numPlayers } = useParams();
  const N = Number(decodeURIComponent(numPlayers));
  const [players, setPlayers] = useState([]);
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [buyIn, setBuyIn] = useState("");
  const [smallBlind, setSmallBlind] = useState("");
  const [bigBlind, setBigBlind] = useState("");
  const [player2Id, setPlayer2Id] = useState({});

  useEffect(() => {
    const fetchPlayers = async() => {
      const res = await fetch('/api/getPlayers');
      const data = await res.json();
      if (data) {
        setPlayers(data);
      }
    };

    fetchPlayers();

    const fetchDefaults = async() => {
      const res = await fetch('/api/getGameDefaults');
      const data = await res.json();
      if (data) {
        setBuyIn(data["buyIn"])
        setSmallBlind(data["smallBlind"])
        setBigBlind(data["bigBlind"])
        setMessage("set")
      } else {
        // BROO WHY IS THIS NOT WORKING???? TS PMO
        // jk it worked
        setMessage("error")
      }
    };

    fetchDefaults();

    const fetchDict = async() => {
      const res = await fetch('/api/getPlayerIdDict');
      const data = await res.json();
      if (data) {
        setPlayer2Id(data);
      }
    };

    fetchDict();
  }, []);

  useEffect(() => {
    setRows(Array.from({ length: N }, () => ({ player: "", locked: false , message: "" })));
  }, [N]);

  const names = players.map(player => (player.name));

  const updateRow = (i, patch) => {
    setRows(prevRows => {
      return prevRows.map((row, index) => {
        if (index !== i) return row;
        else return { ...row, ...patch}
      })
    })
  }

  const toggleLock = (i) => {
    /*
    some react state function form
    [count, setCount] = useState("")
    setCount(prevCount => prevCount + 1);
    the code will automatically pass count into the function as prevCount
    */
    setRows(prevRows => {
      return prevRows.map((row, index) => {
        if (index !== i) return row;

        if (row.locked) {
          return { ...row, locked: false, message: "" };
        }

        if (names.includes(row.player)) {
          return { ...row, locked: true, message: "" };
        } else {
          return { ...row, message: "Invalid player selection" };
        }
      });
    });
  };

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  }

  const trySubmit = async event => {
    event.preventDefault();
    let toPlay = [];

    for (const row of rows) {
      //console.log(row.locked)
      if (row.locked == false) {
        setMessage("not everyone set")
        return
      } else {
        //console.log(row.player)
        //console.log(player2Id[row.player])
        toPlay.push(player2Id[row.player])
        //console.log("toPlay:", toPlay); 
      }
    }


    const big = Number(bigBlind)
    const small = Number(smallBlind)
    const buy = Number(buyIn)
    let toSend = {}
    if (big > small && small >= 0 && buy >= big) {
      // the source of my error is toPlay is (3) [1, 2, 3] for example
      // however, this next step creates {"toPlay" : Array(3), instead of "toPlay" : [1, 2, 3]}
      // console.log("toPlay value:", toPlay);
      // console.log("payload:", JSON.stringify({ toPlay })); 
      toSend = { "buyIn": buy, "bigBlind": big, "smallBlind": small, "toPlay": toPlay}
      // console.log("thingies", toSend["toPlay"])
    } else {
      setMessage("must buy in > big blind > small blind >= 0")
      return
    }
    
    console.log(toSend)
    try {
      const createGame = await fetch("/api/createGame", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(toSend)
      });

      const body = await createGame.json();

      if (!body.success){
        console.error("Create failed: ", body.error);
      }
      else {
        navigate('/in-game')  
      }
    } catch (err) {
      console.error("error occored: ", err);
    }

  }

  return (
    <div className="home">
      <h2 className="Title">Lobby</h2>

      <datalist id="playerList">
        {names.map(name => (<option key={name} value={name} />))}
      </datalist>

      <table>
        {rows.map((row, i) => (
          <tr key={i}>
            <td>
              <input
                list="playerList"
                placeholder="Select player"
                value={row.player}
                onChange={event => updateRow(i, { player: event.target.value })}
                disabled={row.locked}
              />
            </td>
            <td>
              <img
                src={row.locked ? "../public/locked_in.png" : "../public/lock_in.png"}
                alt={row.locked ? "locked" : "unlocked"}
                width={48}
                height={24}
                style={{ cursor: "pointer" }}
                onClick={() => toggleLock(i)} // toggle lock
              />
            </td>
            <td>
              {row.message}
            </td>
          </tr>
        ))}
      </table>
      
      <br></br>
      <div className="blind">
        <h2 className="message blind2">Buy In</h2>
        <h2 className="message blind3">Small Blind</h2>
        <h2 className="message">Big Blind</h2>
      </div>
      <form className="row">
        <input
          type="number"
          placeholder="Buy In"
          value={buyIn}
          min="0"
          step="1"
          onKeyDown={e => {
            const blocked = ['e', 'E', '-', '+'];
            if (blocked.includes(e.key)) e.preventDefault();
          }}
          onChange={event => setBuyIn(event.target.value)}
        />
        <input
          type="number"
          placeholder="Small Blind"
          value={smallBlind}
          min="0"
          step="1"
          onKeyDown={e => {
            const blocked = ['e', 'E', '-', '+'];
            if (blocked.includes(e.key)) e.preventDefault();
          }}
          onChange={event => setSmallBlind(event.target.value)}
        />
        <input
          type="number"
          placeholder="Big Blind"
          value={bigBlind}
          min="0"
          step="1"
          onKeyDown={e => {
            const blocked = ['e', 'E', '-', '+'];
            if (blocked.includes(e.key)) e.preventDefault();
          }}
          onChange={event => setBigBlind(event.target.value)}
        />
        <div>
          <button onClick={trySubmit}>Submit</button>
        </div>
      </form>

      {message && (
        <div className="row">
          <h2 className="message">{message}</h2>
        </div>
      )}
      
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>

    </div>
  );
}