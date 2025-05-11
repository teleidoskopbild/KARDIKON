import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StatsPage = () => {
  const allHandCategories = [
    "High Card",
    "Pair",
    "Two Pair",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Full House",
    "Four of a Kind",
    "Straight Flush",
    "Royal Flush",
  ];

  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesTied: 0,
    handsPlayed: 0,
    handsWon: 0,
    handsLost: 0,
    handsTied: 0,
    handWins: Object.fromEntries(
      allHandCategories.map((category) => [category, 0])
    ),
    handLosses: Object.fromEntries(
      allHandCategories.map((category) => [category, 0])
    ),
    handTies: Object.fromEntries(
      allHandCategories.map((category) => [category, 0])
    ),
  });

  useEffect(() => {
    const loadedStats = JSON.parse(localStorage.getItem("gameStats")) || {};
    setStats((prevStats) => ({
      ...prevStats,
      gamesPlayed: loadedStats.gamesPlayed || 0,
      gamesWon: loadedStats.gamesWon || 0,
      gamesLost: loadedStats.gamesLost || 0,
      gamesTied: loadedStats.gamesTied || 0,
      handsPlayed: loadedStats.handsPlayed || 0,
      handsWon: loadedStats.handsWon || 0,
      handsLost: loadedStats.handsLost || 0,
      handsTied: loadedStats.handsTied || 0,
      handWins: { ...prevStats.handWins, ...loadedStats.handWins },
      handLosses: { ...prevStats.handLosses, ...loadedStats.handLosses },
      handTies: { ...prevStats.handTies, ...loadedStats.handTies },
    }));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 mx-auto text-center space-y-6">
      <h1 className="text-2xl font-bold">Your Statistics</h1>
      <p className="text-gray-300 text-sm">
        Here are the collected statistics from the game.
      </p>
      {/* 
      <div className="space-y-1 border-t border-gray-700 pt-4">
        <h2 className="text-lg font-semibold">Game Statistics</h2>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <p>Games Played: {stats.gamesPlayed}</p>
          <p>Games Won: {stats.gamesWon}</p>
          <p>Games Lost: {stats.gamesLost}</p>
          <p>Games Tied: {stats.gamesTied}</p>
        </div>
      </div> */}

      <div>
        <h3 className="font-medium mb-1 text-sm mb-6">
          Hand Outcomes by Category
        </h3>
        <div className="grid grid-cols-4 gap-y-1 text-sm font-semibold border-b border-gray-600 pb-2 mb-2">
          <p>Total</p>
          <p className="text-green-400">{stats.handsWon}</p>
          <p className="text-red-400">{stats.handsLost}</p>
          <p className="text-yellow-400">{stats.handsTied}</p>
        </div>

        <div className="grid grid-cols-4 gap-y-1 text-sm font-semibold border-b border-gray-600 pb-2 mb-2">
          <p>Hand</p>
          <p className="text-green-400">Win</p>
          <p className="text-red-400">Loss</p>
          <p className="text-yellow-400">Draw</p>
        </div>
        <div className="grid grid-cols-4 gap-y-1 text-sm">
          {allHandCategories.map((category) => [
            <p key={`${category}-name`}>{category}</p>,
            <p key={`${category}-win`} className="text-green-400">
              {stats.handWins[category] || 0}
            </p>,
            <p key={`${category}-loss`} className="text-red-400">
              {stats.handLosses[category] || 0}
            </p>,
            <p key={`${category}-draw`} className="text-yellow-400">
              {stats.handTies[category] || 0}
            </p>,
          ])}
        </div>
      </div>

      <div>
        <Link
          to="/"
          className="inline-block mt-6 px-4 py-2 rounded-full bg-white text-black hover:bg-red-500 hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default StatsPage;
