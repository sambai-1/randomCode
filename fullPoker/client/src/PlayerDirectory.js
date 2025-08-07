import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CSS/Home.css';

export default function Home(){
  const [numPlayer, setPlayer] = useState("");
  const navigate = useNavigate();

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

  return (
    <div className="home">
      <h1 className="Title">Players</h1>
      <table>
        <tr>
          <th>Name</th>
          <th>Chips</th>
          <th>Actions</th>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>
            <a href="">History</a>
            <br></br>
            <a href="">Edit</a>
          </td>
        </tr>
      </table>
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
}