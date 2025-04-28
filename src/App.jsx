import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AchievementsPage from "./pages/AchievementsPage";
import GamePage from "./pages/GamePage";
import MenuPage from "./pages/MenuPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />}></Route>
        <Route path="/game" element={<GamePage />}></Route>
        <Route path="/achievements" element={<AchievementsPage />}></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
