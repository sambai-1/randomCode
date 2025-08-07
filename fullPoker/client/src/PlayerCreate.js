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
    
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
    
  );
}