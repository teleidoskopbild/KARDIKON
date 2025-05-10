import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StatsPage from "./pages/StatsPage";
import GamePage from "./pages/GamePage";
import MenuPage from "./pages/MenuPage";
import HowToPlayPage from "./pages/HowToPlayPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />}></Route>
        <Route path="/game" element={<GamePage />}></Route>
        <Route path="/stats" element={<StatsPage />}></Route>
        <Route path="/how-to-play" element={<HowToPlayPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
