import { useParams } from "react-router-dom";

export default function WaitRoom(){
  const { numPlayers } = useParams();
  return (
    <div>
      <h2>You entered:</h2>
      <p>{decodeURIComponent(numPlayers)}</p>
    </div>
  );
}