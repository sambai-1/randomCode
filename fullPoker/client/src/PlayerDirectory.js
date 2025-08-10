import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './CSS/Home.css';
import './CSS/PlayerDirectory.css'

export default function Home(){
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

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

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

  return (
    <div className="home">
      <h1 className="Title">Players</h1>
      <table className="borderTable">
        <tr>
          <th className="name borderTable">Name</th>
          <th className="chips borderTable">Chips</th>
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
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
}