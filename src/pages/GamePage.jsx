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
  const [roundsLeft, setRoundsLeft] = useState(7); // Anzahl der Runden
  const [currentRound, setCurrentRound] = useState(0); // Aktuelle Runde
  const [playerPlayedCards, setPlayerPlayedCards] = useState([]); // Karten, die der Spieler gelegt hat
  const [aiPlayedCards, setAiPlayedCards] = useState([]); // Karten, die die AI gelegt hat
  const [roundEvaluated, setRoundEvaluated] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [playerHandStrength, setPlayerHandStrength] = useState(""); // Zum Speichern der Handbewertung

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

      const playerRank = rankHand(playerHandStrength);
      const aiRank = rankHand(aiHandStrength);

      if (playerRank > aiRank) {
        setPlayerScore((prev) => prev + 1);
        alert(`Spieler gewinnt die Runde mit: ${playerHandStrength}`);
      } else if (playerRank < aiRank) {
        setAiScore((prev) => prev + 1);
        alert(`AI gewinnt die Runde mit: ${aiHandStrength}`);
      } else {
        alert(`Unentschieden! Beide hatten: ${playerHandStrength}`);
      }
    }, 500);
    setRoundEvaluated(true);
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

  return (
    <div className="game-page bg-black text-white min-h-screen">
      <button className="border p-2 m-4" onClick={startGame}>
        Spiel Starten
      </button>
      <h3 className="border p-2 m-2">Runde: {currentRound}</h3>
      <h3 className="border p-2 m-2">Verbleibende Runden: {roundsLeft}</h3>
      <h3 className="border p-2 m-2">Spieler: {playerScore} Punkte</h3>
      <h3 className="border p-2 m-2">AI: {aiScore} Punkte</h3>

      <h3 className="border p-2 m-2">AI Hand:</h3>
      <ul className="flex  border p-2 m-2 justify-center">
        {aiHand.map((card, index) => (
          <li key={index} className=" p-0">
            <img
              className="w-[100px]"
              src={`images/${card.value}_${card.suit}.svg`}
              alt={`${card.value} of ${card.suit}`}
            />
          </li>
        ))}
      </ul>

      <h3 className="border p-2 m-2">Deine Hand:</h3>
      <ul className="flex  border p-2 m-2 justify-center">
        {playerHand.map((card, index) => (
          <li
            key={index}
            className=" p-0 cursor-pointer"
            onClick={() => playPlayerCard(card)} // Spieler kann Karte spielen
          >
            <img
              className="w-[100px]"
              src={`images/${card.value}_${card.suit}.svg`}
              alt={`${card.value} of ${card.suit}`}
            />
          </li>
        ))}
      </ul>

      {/* Anzeige für die gespielten Karten */}
      <h3 className="border p-2 m-2">Gespielte Karten:</h3>
      <div className="flex gap-8 border p-2 m-2">
        <div>
          <h3 className="border p-2 m-2">
            Deine Handbewertung: {playerHandStrength}
          </h3>

          <h4 className="border p-2 m-2">Spieler:</h4>
          <div className="flex">
            {playerPlayedCards.map((card, index) => (
              <div key={index} className=" p-0 m-1">
                <img
                  className="w-[100px]"
                  src={`images/${card.value}_${card.suit}.svg`}
                  alt={`${card.value} of ${card.suit}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="border p-2 m-2">AI</h3>
          <h4 className="border p-2 m-2">AI:</h4>
          <div className="flex">
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
        </div>
      </div>

      {/* Button zum nächsten Runde starten */}
      {playerPlayedCards.length === 5 && !roundEvaluated && (
        <button onClick={evaluateRound}>Runde auswerten</button>
      )}

      {roundEvaluated && <button onClick={nextRound}>Nächste Runde</button>}
    </div>
  );
};

export default GamePage;
