import { Link } from "react-router-dom";

export default function MenuPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-6xl font-bold tracking-tight mb-8">KARDIKON</h1>
      <div className="flex flex-col space-y-4">
        <Link
          to="/game"
          className="bg-white text-black font-semibold rounded-full px-8 py-3 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out text-center"
        >
          PLAY
        </Link>
        <Link
          to="/achievements"
          className="bg-white text-black font-semibold rounded-full px-8 py-3 hover:bg-red-500 hover:text-white  transition duration-300 ease-in-out text-center"
        >
          ACHIEVEMENTS
        </Link>
        <Link
          to="/how-to-play"
          className="bg-white text-black font-semibold rounded-full px-8 py-3 hover:bg-red-500 hover:text-white  transition duration-300 ease-in-out text-center"
        >
          HOW TO PLAY
        </Link>
      </div>
    </div>
  );
}
