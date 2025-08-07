import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CSS/Home.css';

export default function Home(){
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const goBack = async event => {
    event.preventDefault();
    navigate(`/`);
  };

  const submitName = async event => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      const nameSent = await fetch("/api/createPlayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });

      if (!nameSent.ok) throw new Error(`Server error: ${nameSent.status}`);
      const body = await nameSent.json();
      if (body.success) {
        setName("");
        navigate("/");
      } else {
        console.error("Add failed:", body.error);
      }
    } catch (err) {
      console.error("Error adding player:", err);
    }
  };

  return (
    <form className="home" onSubmit={submitName}>
      <div className="row">
          <h2 className="title">
            Create Player
          </h2>
        </div>
        <div className="row">
          <input
            type="text"
            value={name}
            onChange={event=>setName(event.target.value)}
            placeholder="Name (First, Last)"
          />
          <button type="submit">Add</button>
        </div>
      <div className="row">
        <button onClick={goBack}>Go Back</button>
      </div>
    </form>
    
  );
}