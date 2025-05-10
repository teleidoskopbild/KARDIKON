import { Link } from "react-router-dom";

const StatsPage = () => {
  // This is where the statistics will be displayed
  return (
    <div className="min-h-screen bg-black text-white p-6  mx-auto text-center space-y-6">
      <h1 className="text-2xl font-bold">Your Statistics</h1>
      <p className="text-gray-300 text-sm">
        Here are the collected statistics from the game.
      </p>

      <div className="space-y-1 border-t border-gray-700 pt-4">
        <h2 className="text-lg font-semibold">Game Statistics</h2>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <p>Games Played: [Number]</p>
          <p>Games Won: [Number]</p>
          <p>Games Lost: [Number]</p>
          <p>Games Tied: [Number]</p>
        </div>
      </div>

      <div className="space-y-4 border-t border-gray-700 pt-4">
        <h2 className="text-lg font-semibold">Hand Statistics</h2>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <p>Hands Played: [Number]</p>
          <p>Hands Won: [Number]</p>
          <p>Hands Lost: [Number]</p>
          <p>Hands Tied: [Number]</p>
        </div>

        <div>
          <h3 className="font-medium mb-1 text-sm">Hand Category Wins</h3>
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            <p>High Card: [Number]</p>
            <p>Pair: [Number]</p>
            <p>Two Pair: [Number]</p>
            <p>Three of a Kind: [Number]</p>
            <p>Straight: [Number]</p>
            <p>Flush: [Number]</p>
            <p>Full House: [Number]</p>
            <p>Four of a Kind: [Number]</p>
            <p>Straight Flush: [Number]</p>
            <p>Royal Flush: [Number]</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-1 text-sm">Hand Category Losses</h3>
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            <p>High Card: [Number]</p>
            <p>Pair: [Number]</p>
            <p>Two Pair: [Number]</p>
            <p>Three of a Kind: [Number]</p>
            <p>Straight: [Number]</p>
            <p>Flush: [Number]</p>
            <p>Full House: [Number]</p>
            <p>Four of a Kind: [Number]</p>
            <p>Straight Flush: [Number]</p>
            <p>Royal Flush: [Number]</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-1 text-sm">Hand Category Ties</h3>
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            <p>High Card: [Number]</p>
            <p>Pair: [Number]</p>
            <p>Two Pair: [Number]</p>
            <p>Three of a Kind: [Number]</p>
            <p>Straight: [Number]</p>
            <p>Flush: [Number]</p>
            <p>Full House: [Number]</p>
            <p>Four of a Kind: [Number]</p>
            <p>Straight Flush: [Number]</p>
            <p>Royal Flush: [Number]</p>
          </div>
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
