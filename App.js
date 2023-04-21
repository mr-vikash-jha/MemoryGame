import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import shuffle from 'lodash.shuffle';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const App = () => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffledLetters = shuffle([...LETTERS, ...LETTERS]);
    const shuffledCards = shuffledLetters.map((letter, index) => ({
      id: index,
      letter,
      flipped: false,
      matched: false,
    }));
    setCards(shuffledCards);
    setSelectedCards([]);
    setAttempts(0);
    setMatches(0);
  };

  const handleCardPress = (id) => {
    if (selectedCards.length === 2) return;
    const cardIndex = cards.findIndex((card) => card.id === id);
    const flippedCard = { ...cards[cardIndex], flipped: true };
    const updatedCards = [...cards];
    updatedCards[cardIndex] = flippedCard;
    setCards(updatedCards);
    setSelectedCards([...selectedCards, flippedCard]);
    if (selectedCards.length === 1) {
      setAttempts((prevAttempts) => prevAttempts + 1);
      if (selectedCards[0].letter === flippedCard.letter) {
        const matchedCards = [...updatedCards].map((card) =>
          card.letter === flippedCard.letter ? { ...card, matched: true } : card
        );
        setCards(matchedCards);
        setSelectedCards([]);
        setMatches((prevMatches) => prevMatches + 1);
      } else {
        setTimeout(() => {
          const unflippedCards = [...updatedCards].map((card) =>
            card.flipped && !card.matched ? { ...card, flipped: false } : card
          );
          setCards(unflippedCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Game</Text>
      <View style={styles.board}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              card.flipped && styles.cardFlipped,
              card.matched && styles.cardMatched,
            ]}
            onPress={() => handleCardPress(card.id)}
            disabled={card.flipped || card.matched}
          >
            <Text style={styles.cardText}>{card.flipped ? card.letter : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.stats}>
        <Text style={styles.statsText}>Attempts: {attempts}</Text>
        <Text style={styles.statsText}>Matches: {matches}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={shuffleCards}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8fcbbc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  board: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  cardFlipped: {
    backgroundColor: '#F5FCFF',
  },
  cardMatched: {
    backgroundColor: '#3CB371',
  },
  cardText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  statsText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#3CB371',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
