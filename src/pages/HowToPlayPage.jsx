import { Link } from "react-router-dom";

export default function HowToPlayPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8 text-center gap-8">
      <h1 className="text-5xl font-bold tracking-tight mb-12">
        How to Play KARDIKON
      </h1>
      <div className="max-w-lg">
        <p className="mb-6 text-xl font-semibold">
          Welcome to <span className="text-red-500">KARDIKON</span>!
        </p>
        <p className="mb-6 text-lg">The rules are straightforward:</p>
        <div className="mb-8">
          <p className="text-xl font-semibold mb-2">Objective:</p>
          <p className="text-lg">
            Achieve the highest score over 9 rounds of play.
          </p>
        </div>
        <div className="mb-8">
          <p className="text-xl font-semibold mb-2">Playing Each Round:</p>
          <ol className="list-decimal list-inside text-lg">
            <li className="mb-2">
              <span className="font-semibold">Your Hand:</span> At the start of
              each round, you'll have 7 cards.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Your Move:</span> Choose and play
              your best 5-card hand.
            </li>
            <li className="mb-2">
              <span className="font-semibold">AI's Move:</span> The AI will then
              play its best 5-card hand.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Round Outcome:</span> The player
              with the stronger poker hand wins the round and earns 1 point.
            </li>
            <li>
              <span className="font-semibold">New Hand:</span> After each round,
              both you and the AI draw new cards to return to a hand of 7.
            </li>
          </ol>
        </div>
        <div>
          <p className="text-xl font-semibold mb-4">Winning the Game:</p>
          <p className="text-lg mb-8">
            After all 9 rounds have been played, the player with the most points
            wins <span className="text-red-500">KARDIKON</span>!
          </p>
          <Link
            to="/"
            className="bg-white text-black font-semibold rounded-full px-8 py-3 hover:bg-red-500 hover:text-white  transition duration-300 ease-in-out text-center"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
