import { useState } from "react";

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
  const [playerHand, setPlayerHand] = useState([]); // Hand des Spielers
  const [aiHand, setAiHand] = useState([]); // Hand der AI
  const [roundsLeft, setRoundsLeft] = useState(5); // Anzahl der Runden
  const [currentRound, setCurrentRound] = useState(0); // Aktuelle Runde
  const [playerPlayedCards, setPlayerPlayedCards] = useState([]); // Karten, die der Spieler gelegt hat
  const [aiPlayedCards, setAiPlayedCards] = useState([]); // Karten, die die AI gelegt hat

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

  // Initialer Spielablauf: Beide Spieler erhalten 7 Karten
  const startGame = () => {
    if (currentRound === 0) {
      drawPlayerCards();
      drawAiCards();
      setCurrentRound(currentRound + 1);
      setRoundsLeft(roundsLeft - 1);
    }
  };

  // Funktion zum Karten spielen (Spieler)
  const playPlayerCard = (card) => {
    if (playerPlayedCards.length >= 5) {
      return;
    }
    const newPlayerHand = playerHand.filter((c) => c !== card);
    setPlayerHand(newPlayerHand);
    setPlayerPlayedCards([...playerPlayedCards, card]);
  };

  // Funktion zum Karten spielen (AI)
  // const playAiCard = () => {
  //   const randomCard = aiHand[Math.floor(Math.random() * aiHand.length)];
  //   const newAiHand = aiHand.filter((c) => c !== randomCard);
  //   setAiHand(newAiHand);
  //   setAiPlayedCards([...aiPlayedCards, randomCard]);
  // };

  // Funktion zum Auswerten der Runde (vorerst Zufall)
  const evaluateRound = () => {
    // AI spielt 5 zufällige Karten
    const aiCards = [...aiHand].sort(() => 0.5 - Math.random()).slice(0, 5);
    const newAiHand = aiHand.filter((c) => !aiCards.includes(c));
    setAiHand(newAiHand);

    // Karten nacheinander anzeigen
    let aiCardsPlayed = [];
    aiCards.forEach((card, index) => {
      setTimeout(() => {
        aiCardsPlayed.push(card);
        setAiPlayedCards([...aiCardsPlayed]); // Karten nach und nach anzeigen
      }, 1000 * (index + 1)); // Verzögerung für jede Karte
    });

    // Auswertung nach einer Verzögerung (nachdem alle Karten gespielt wurden)
    setTimeout(() => {
      const playerCardValue = values.indexOf(playerPlayedCards[0]?.value);
      const aiCardValue = values.indexOf(aiCards[0]?.value);

      if (playerCardValue > aiCardValue) {
        alert("Spieler gewinnt diese Runde!");
      } else if (playerCardValue < aiCardValue) {
        alert("AI gewinnt diese Runde!");
      } else {
        alert("Unentschieden!");
      }
    }, 1500 * aiCards.length); // Warte, bis alle Karten gespielt wurden
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
  };

  return (
    <div className="game-page">
      <button className="border p-2 m-4" onClick={startGame}>
        Spiel Starten
      </button>
      <h3 className="border p-2 m-2">Runde: {currentRound}</h3>
      <h3 className="border p-2 m-2">Verbleibende Runden: {roundsLeft}</h3>

      <h3 className="border p-2 m-2">Deine Hand:</h3>
      <ul className="flex gap-4 border p-2 m-2">
        {playerHand.map((card, index) => (
          <li
            key={index}
            className="border p-2 cursor-pointer"
            onClick={() => playPlayerCard(card)} // Spieler kann Karte spielen
          >
            {card.value} of {card.suit}
          </li>
        ))}
      </ul>

      <h3 className="border p-2 m-2">AI Hand:</h3>
      <ul className="flex gap-4 border p-2 m-2">
        {aiHand.map((card, index) => (
          <li key={index} className="border p-2">
            {card.value} of {card.suit}
          </li>
        ))}
      </ul>

      {/* Anzeige für die gespielten Karten */}
      <h3 className="border p-2 m-2">Gespielte Karten:</h3>
      <div className="flex gap-8 border p-2 m-2">
        <div>
          <h4 className="border p-2 m-2">Spieler:</h4>
          {playerPlayedCards.map((card, index) => (
            <div key={index} className="border p-2 m-1">
              {card.value} of {card.suit}
            </div>
          ))}
        </div>
        <div>
          <h4 className="border p-2 m-2">AI:</h4>
          {aiPlayedCards.map((card, index) => (
            <div key={index} className="border p-2 m-1">
              {card.value} of {card.suit}
            </div>
          ))}
        </div>
      </div>

      {/* Button zum nächsten Runde starten */}
      {playerPlayedCards.length > 0 && (
        <div className="border p-2 m-2">
          <button className="border p-2 m-2" onClick={evaluateRound}>
            Runde auswerten
          </button>
          <button className="border p-2 m-2" onClick={nextRound}>
            Nächste Runde
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
