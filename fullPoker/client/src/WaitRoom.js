

import { useParams } from "react-router-dom";
import { useState, useEffect, useId } from "react";
import './CSS/Home.css';
import './CSS/WaitRoom.css';

export default function WaitRoom(){
  const { numPlayers } = useParams();
  const N = Number(decodeURIComponent(numPlayers));
  const [players, setPlayers] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchPlayers = async() => {
      const res = await fetch('/api/getPlayers');
      const data = await res.json();
      if (data) {
        setPlayers(data);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    setRows(Array.from({ length: N }, () => ({ player: "", locked: false , message: "" })));
  }, [N]);

  const names = players.map(player => (player.name));

  const updateRow = (i, patch) =>
    setRows(prev => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

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

  return (
    <div className="home">
      <h2 className="Title">Lobby</h2>

      <datalist id="playerList">
        {names.map(name => (<option key={name} value={name} />))}
      </datalist>

      <table>
        {rows.map((row, i) => (
          <tr key={i}>
            <td className="centerCol">
              <input
                list="playerList"
                placeholder="Select player"
                value={row.player}
                onChange={event => updateRow(i, { player: event.target.value })}
                disabled={row.locked}
              />
            </td>
            <td className="centerCol">
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
    </div>
  );
}