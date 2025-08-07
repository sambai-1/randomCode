import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './CSS/Home.css';
import './CSS/PlayerDirectory.css'

export default function Home(){
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/getPlayers")
      .then(res => res.json())
      .then(setPlayers)
      .catch(console.error);
  }, []);

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

  return (
    <div className="home">
      <h1 className="Title">Players</h1>
      <table>
        <tr>
          <th className="name">Name</th>
          <th className="chips">Chips</th>
          <th className="actions">Actions</th>
        </tr>
```````` # some sort of for loop wanted
            <tr key={player.id}>
              <td className="name">{player.name}</td>
              <td className="chips">{player.chips}</td>
              <td className="actions">
                <Link to={``}>History</Link><br/>
                <Link to={``}>Edit</Link>
              </td>
            </tr>

      </table>
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
}