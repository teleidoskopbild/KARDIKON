import { Link } from "react-router-dom";

export default function MenuPage() {
  return (
    <div>
      <h1>Menu Page</h1>
      <Link to="/game">Game</Link>
      <Link to="/achievements">Achievements</Link>
      <Link to="/settings">Settings</Link>
    </div>
  );
}
