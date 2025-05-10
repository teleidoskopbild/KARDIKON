import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./gamepage.css";

// Erstelle das Deck
const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

// Funktion, um ein Deck zu erstellen
const createDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck;
};

// Funktion, um das Deck zu mischen
const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const GamePage = () => {
  const [deck, setDeck] = useState(shuffleDeck(createDeck())); // Deck für den Spieler
  const [aiDeck, setAiDeck] = useState(shuffleDeck(createDeck())); // Deck für die AI
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [roundsLeft, setRoundsLeft] = useState(10);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerPlayedCards, setPlayerPlayedCards] = useState([]);
  const [aiPlayedCards, setAiPlayedCards] = useState([]);
  const [roundEvaluated, setRoundEvaluated] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [playerHandStrength, setPlayerHandStrength] = useState(""); // Zum Speichern der Handbewertung
  const [gameStarted, setGameStarted] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [stats, setStats] = useState(() => {
    // zum Speichern der Stats
    const saved = localStorage.getItem("gameStats");
    return saved
      ? JSON.parse(saved)
      : {
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          gamesTied: 0,
          handsPlayed: 0,
          handsWon: 0,
          handsLost: 0,
          handsTied: 0,
          handWins: {}, // z.B. { "Pair": 3 }
          handLosses: {},
          handTies: {},
        };
  });

  useEffect(() => {
    localStorage.setItem("gameStats", JSON.stringify(stats));
  }, [stats]);

  // Funktion zum Ziehen von 7 Karten für den Spieler
  const drawPlayerCards = () => {
    const neededCards = 7 - playerHand.length;
    const newCards = deck.slice(0, neededCards);
    setPlayerHand([...playerHand, ...newCards]);
    setDeck(deck.slice(neededCards));
  };

  // Funktion zum Ziehen von 7 Karten für die AI
  const drawAiCards = () => {
    const neededCards = 7 - aiHand.length;
    const newCards = aiDeck.slice(0, neededCards);
    setAiHand([...aiHand, ...newCards]);
    setAiDeck(aiDeck.slice(neededCards));
  };

  const rankHand = (handStrength) => {
    const ranks = {
      // Definiert ein Objekt namens 'ranks'.
      "High Card": 0, // Schlüssel "High Card" hat den Wert 0.
      Pair: 1, // Schlüssel "Pair" hat den Wert 1.
      "Two Pair": 2,
      "Three of a Kind": 3,
      Straight: 4,
      Flush: 5,
      "Full House": 6,
      "Four of a Kind": 7,
      "Straight Flush": 8,
      "Royal Flush": 9,
    };
    return ranks[handStrength]; // Gibt den Wert zurück, der zum Schlüssel 'handStrength' in 'ranks' gehört.
    // Wenn 'handStrength' kein Schlüssel in 'ranks' ist, wird -1 zurückgegeben.
  };

  // Initialer Spielablauf: Beide Spieler erhalten 7 Karten
  const startGame = () => {
    if (currentRound === 0) {
      drawPlayerCards();
      drawAiCards();
      setCurrentRound(currentRound + 1);
      setRoundsLeft(roundsLeft - 1);
    }
  };

  const startGameHandler = () => {
    startGame(); // Rufe deine bestehende startGame-Funktion auf
    setGameStarted(true);
  };

  // Funktion zum Karten spielen (Spieler)
  const playPlayerCard = (card) => {
    if (playerPlayedCards.length >= 5) {
      return;
    }

    // Neue Hand des Spielers nach der gespielten Karte
    const newPlayerHand = playerHand.filter((c) => c !== card);
    setPlayerHand(newPlayerHand);

    // Füge die Karte zur Liste der gespielten Karten hinzu
    setPlayerPlayedCards([...playerPlayedCards, card]);

    // Bewerte die Hand des Spielers, wenn die Karten gespielt werden
    const handStrength = evaluateHand([...playerPlayedCards, card]); // Spielerhand + die neue Karte
    setPlayerHandStrength(handStrength); // Setze die Handbewertung
  };

  const determineBestAiHand = (aiHand) => {
    const allCombinations = get5CardCombos(aiHand);
    let bestHand = null;
    let bestRank = -1;

    for (const hand of allCombinations) {
      const handStrength = evaluateHand(hand);
      const rank = rankHand(handStrength);

      if (rank > bestRank) {
        bestRank = rank;
        bestHand = hand;
      }
    }
    bestHand.sort((a, b) => {
      const valueA = values.indexOf(a.value);
      const valueB = values.indexOf(b.value);
      return valueA - valueB;
    });
    return bestHand;
  };

  const evaluateRound = () => {
    // AI wählt die beste Hand
    const bestAiHandToPlay = determineBestAiHand(aiHand);
    setAiPlayedCards(bestAiHandToPlay);

    // Entferne die gespielten Karten aus der AI-Hand
    const newAiHand = aiHand.filter((card) => !bestAiHandToPlay.includes(card));
    setAiHand(newAiHand);

    // Zeige die gespielten Karten der AI (jetzt alle auf einmal)
    setAiPlayedCards(bestAiHandToPlay);

    // Auswertung der Runde (Vergleich der Handstärken)
    setTimeout(() => {
      const playerHandStrength = evaluateHand(playerPlayedCards);
      const aiHandStrength = evaluateHand(bestAiHandToPlay);
      let resultMessage = "";

      const playerRank = rankHand(playerHandStrength);
      const aiRank = rankHand(aiHandStrength);

      if (playerRank > aiRank) {
        setPlayerScore((prev) => prev + 1);
        resultMessage = `You win the round with a: ${playerHandStrength}!`;

        // Update Stats - Spieler gewinnt die Hand
        setStats((prevStats) => ({
          ...prevStats,
          handsWon: prevStats.handsWon + 1,
          handsPlayed: prevStats.handsPlayed + 1,
          handWins: {
            ...prevStats.handWins,
            [playerHandStrength]:
              (prevStats.handWins[playerHandStrength] || 0) + 1,
          },
        }));
      } else if (playerRank < aiRank) {
        setAiScore((prev) => prev + 1);
        resultMessage = `The AI wins the round with a: ${aiHandStrength}!`;

        // Update Stats - AI gewinnt die Hand
        setStats((prevStats) => ({
          ...prevStats,
          handsLost: prevStats.handsLost + 1,
          handsPlayed: prevStats.handsPlayed + 1,
          handLosses: {
            ...prevStats.handLosses,
            [aiHandStrength]: (prevStats.handLosses[aiHandStrength] || 0) + 1,
          },
        }));
      } else {
        resultMessage = `Draw! Both players have a: ${playerHandStrength}.`;

        // Update Stats - Unentschieden bei der Hand
        setStats((prevStats) => ({
          ...prevStats,
          handsTied: prevStats.handsTied + 1,
          handsPlayed: prevStats.handsPlayed + 1,
          handTies: {
            ...prevStats.handTies,
            [playerHandStrength]:
              (prevStats.handTies[playerHandStrength] || 0) + 1,
          },
        }));
      }

      setRoundResult(resultMessage); // Setze die Runden-Nachricht
      setRoundEvaluated(true);
      if (currentRound === 10) {
        // Da currentRound bei 0 startet und wir 10 Runden spielen
        setGameOver(true);
      }
    }, 500);
  };

  // Funktion zum Starten der nächsten Runde
  const nextRound = () => {
    // Karten auffüllen
    drawPlayerCards();
    drawAiCards();

    // Leeren der gespielten Karten des Spielers und der AI
    setPlayerPlayedCards([]);
    setAiPlayedCards([]);

    setCurrentRound(currentRound + 1); // Nächste Runde
    setRoundsLeft(roundsLeft - 1); // Verbleibende Runden reduzieren
    setRoundEvaluated(false);
    setRoundResult(null); // Leere die Runden-Nachricht für die nächste Runde
  };

  const evaluateHand = (hand) => {
    const valuesCount = {};
    const suitsCount = {};

    hand.forEach((card) => {
      valuesCount[card.value] = (valuesCount[card.value] || 0) + 1;
      suitsCount[card.suit] = (suitsCount[card.suit] || 0) + 1;
    });

    // Überprüfe, ob ein Paar, Drilling oder Vierling vorhanden ist
    const valueCounts = Object.values(valuesCount);
    const isPair = valueCounts.includes(2);
    const isTwoPair = valueCounts.filter((count) => count === 2).length === 2;
    const isThreeOfAKind = valueCounts.includes(3);
    const isFourOfAKind = valueCounts.includes(4);

    // Überprüfe auf Flush (gleiche Farbe)
    const isFlush = Object.values(suitsCount).includes(5);

    // Überprüfe auf Straight (folgende Reihenfolge der Werte)
    const sortedValues = hand
      .map((card) => values.indexOf(card.value))
      .sort((a, b) => a - b);
    const isStraight =
      sortedValues[4] - sortedValues[0] === 4 &&
      new Set(sortedValues).size === 5;

    // überprüfe auf FullHouse
    const isFullHouse = valueCounts.includes(3) && valueCounts.includes(2);

    // Berechne die Handkategorie
    if (isFlush && isStraight) return "Straight Flush";
    if (isFourOfAKind) return "Four of a Kind";
    // if (isFullHouse(valueCounts)) return "Full House";
    if (isFullHouse) return "Full House";
    if (isFlush) return "Flush";
    if (isStraight) return "Straight";
    if (isThreeOfAKind) return "Three of a Kind";
    if (isTwoPair) return "Two Pair";
    if (isPair) return "Pair";
    return "High Card";
  };

  const get5CardCombos = (cards) => {
    const combos = [];
    for (let i = 0; i < cards.length - 4; i++) {
      for (let j = i + 1; j < cards.length - 3; j++) {
        for (let k = j + 1; k < cards.length - 2; k++) {
          for (let l = k + 1; l < cards.length - 1; l++) {
            for (let m = l + 1; m < cards.length; m++) {
              combos.push([cards[i], cards[j], cards[k], cards[l], cards[m]]);
            }
          }
        }
      }
    }
    return combos;
  };

  const determineGameWinner = () => {
    console.log("playerScore:", playerScore, "aiScore:", aiScore); // Log für playerScore und aiScore
    console.log("Previous Stats:", stats); // Log für die vorherigen stats
    if (playerScore > aiScore) {
      // setStats((prevStats) => ({
      //   ...prevStats,
      //   gamesWon: prevStats.gamesWon + 1,
      //   gamesPlayed: prevStats.gamesPlayed + 1,
      // }));
      return "You have won the game!";
    } else if (aiScore > playerScore) {
      // setStats((prevStats) => ({
      //   ...prevStats,
      //   gamesLost: prevStats.gamesLost + 1,
      //   gamesPlayed: prevStats.gamesPlayed + 1,
      // }));
      return "The Ai has won the game!";
    } else {
      // setStats((prevStats) => ({
      //   ...prevStats,
      //   gamesTied: prevStats.gamesTied + 1,
      //   gamesPlayed: prevStats.gamesPlayed + 1,
      // }));
      return "Draw!";
    }
  };

  const withdrawPlayerCard = (card) => {
    // Überprüfe, ob die Karte in den gespielten Karten vorhanden ist
    const cardIndex = playerPlayedCards.indexOf(card);
    if (cardIndex === -1) {
      return; // Karte nicht gefunden, tue nichts
    }

    // Erstelle neue Arrays für gespielte und aktuelle Hand
    const newPlayerPlayedCards = [...playerPlayedCards];
    const newPlayerHand = [...playerHand];

    // Entferne die Karte aus den gespielten Karten und füge sie der Hand hinzu
    newPlayerHand.push(newPlayerPlayedCards.splice(cardIndex, 1)[0]);

    // Aktualisiere den State
    setPlayerPlayedCards(newPlayerPlayedCards);
    setPlayerHand(newPlayerHand);
  };

  return (
    <div className="game-page bg-black text-white h-screen flex flex-col justify-center">
      {!gameStarted && (
        <button
          className="border p-4 m-6 rounded-full self-center cursor-pointer hover:scale-105 transition"
          onClick={startGameHandler}
        >
          Start Game
        </button>
      )}
      {gameStarted && (
        <div className="min-w-screen min-h-screen">
          {" "}
          <div className="flex justify-between">
            <h3 className="p-2 m-2 text-3xl">Round: {currentRound}</h3>
            <div className="flex mr-4">
              <h3 className=" p-2 m-2">Player: {playerScore} Points</h3>
              <h3 className=" p-2 m-2">AI: {aiScore} Points</h3>
            </div>
          </div>
          <h3 className="p-2 m-2 text-center">AI Hand:</h3>
          <ul className="flex   p-2 m-2 justify-center">
            {aiHand.map((card, index) => (
              <li key={index} className=" p-0">
                <img
                  className="w-[100px]"
                  src={`images/Backside.svg`}
                  alt={`${card.value} of ${card.suit}`}
                />
              </li>
            ))}
          </ul>
          <div className="flex justify-center h-[150px]">
            {aiPlayedCards.map((card, index) => (
              <div key={index} className=" p-0 m-1">
                <img
                  className="w-[100px]"
                  src={`images/${card.value}_${card.suit}.svg`}
                  alt={`${card.value} of ${card.suit}`}
                />
              </div>
            ))}
          </div>
          {/* gespielte Karten */}
          <div className="flex justify-center h-[150px]">
            {playerPlayedCards.map((card, index) => (
              <div
                key={index}
                className="p-0 m-1 cursor-pointer hover:animate-pulse" // cursor-pointer für besseres UX
                onClick={() => withdrawPlayerCard(card)} // Funktion hier aufrufen
              >
                <img
                  className="w-[100px]"
                  src={`images/${card.value}_${card.suit}.svg`}
                  alt={`${card.value} of ${card.suit}`}
                />
              </div>
            ))}
          </div>
          <h3 className="p-2 m-2 text-center">Your Hand:</h3>
          <ul className="flex p-2 m-2 justify-center">
            {playerHand.map((card, index) => (
              <li
                key={index}
                className=" p-0 cursor-pointer transform hover:translate-x-3 hover:rotate-1 transition duration-200 ease-in-out"
                onClick={() => playPlayerCard(card)} // Spieler kann Karte spielen
              >
                <img
                  className="w-[125px]"
                  src={`images/${card.value}_${card.suit}.svg`}
                  alt={`${card.value} of ${card.suit}`}
                />
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            {playerPlayedCards.length === 5 && !roundEvaluated && (
              <div>
                {" "}
                <button
                  className="font-bold uppercase border m-4 p-4 text-2xl hover:scale-105 transition  cursor-pointer"
                  onClick={evaluateRound}
                >
                  Play Hand
                </button>
                <p className="text-center mt-4">
                  You have a: {playerHandStrength}
                </p>
              </div>
            )}
          </div>
          {roundEvaluated && (
            <div className="h-[125px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border p-4 m-4 rounded bg-gray-800 z-50 flex flex-col items-center">
              <p className="text-lg">{roundResult}</p>
              {!gameOver && (
                <button onClick={nextRound} className="border p-2 mt-6 rounded">
                  Next Round
                </button>
              )}
              {gameOver && (
                <div className="flex flex-col justify-between w-full h-[300px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border p-8 rounded bg-gray-800 text-center z-50">
                  <h2 className="text-2xl font-bold mb-4">
                    {determineGameWinner()}
                  </h2>
                  <p className="mb-4">You: {playerScore} Points</p>
                  <p>AI: {aiScore} Points</p>
                  <div className="mt-4">
                    <Link
                      to="/"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full mt-4 transition duration-300 ease-in-out"
                    >
                      Back to menu
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GamePage;
