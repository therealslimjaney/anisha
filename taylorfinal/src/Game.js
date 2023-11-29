import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Guesses from './Guesses';
import Gamefeedback from './Gamefeedback';

export default function Game({ googleId }) {
  const secretCode = generateCode();
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]); // Initialize as an empty array
  const [guessesLeft, setGuessesLeft] = useState(10);
  const [score, setScore] = useState(100);
  const [exacts, setExacts] = useState(null);
  const [partials, setPartials] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [userScores, setUserScores] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  function generateCode() {
    const colours = ['R', 'G', 'B', 'Y', 'O', 'P'];
    colours.sort(() => Math.random() - 0.5);
    const code = colours.slice(0, 4).join('');
    return 'ROBY';
  }

  useEffect(() => {
    if (exacts === 4) {
      setHasWon(true);
      setShowOptions(true);
    } else if (guessesLeft === 0) {
      setShowOptions(true);
    }
  }, [exacts, guessesLeft]);

  function resetGame() {
    // Reset all the state variables to their initial values
    setGuesses([]);
    setGuessesLeft(10);
    setScore(100);
    setExacts(null);
    setPartials(null);
    setHasWon(false);
    setShowOptions(false);
    setCurrentGuess('');
  }

  function handleGuess(e) {
    e.preventDefault();

    if (guessesLeft > 0) {
      setGuessesLeft((prevGuessesLeft) => prevGuessesLeft - 1);

      countMatches();

      // Update the guesses array
      setGuesses([...guesses, { guess: currentGuess, exacts, partials }]);

      if (exacts === 4) {
        setHasWon(true);
        setShowOptions(true);
      } else if (guessesLeft === 0) {
        setShowOptions(true);
      } else {
        setScore(score - 10);
      }
    }

    setCurrentGuess('');
  }

  function countMatches() {
    let currentPartials = 0;
    let currentExacts = 0;
    const secretCodeArray = secretCode.split('');
    const guessArray = currentGuess.split('');

    // Count exact matches
    for (let i = 0; i < 4; i++) {
      if (guessArray[i] === secretCodeArray[i]) {
        currentExacts++;
        // Mark the matched elements to avoid double counting
        guessArray[i] = '_';
        secretCodeArray[i] = '_';
      }
    }

    // Count partial matches
    for (let i = 0; i < 4; i++) {
      if (guessArray[i] !== '_' && secretCodeArray.includes(guessArray[i])) {
        currentPartials++;
        // Mark the matched element to avoid double counting
        const secretIndex = secretCodeArray.indexOf(guessArray[i]);
        secretCodeArray[secretIndex] = '_';
      }
    }

    setExacts(currentExacts);
    setPartials(currentPartials);
  }

  const saveGameToDatabase = async () => {
    const gameData = {
      googleId: googleId,
      score: score,
      date: 'a date', // Save the date as a Date object
    };

    try {
      await axios.post(
        'https://endtoend-405500.uw.r.appspot.com/saveGameRecord',
        gameData);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    fetchTopScores();
  }, []);

  async function fetchTopScores() {
    try {
      const response = await axios.get('https://endtoend-405500.uw.r.appspot.com/topOverallScores');
      setTopScores(response.data);
    } catch (error) {
      console.error('Error fetching top scores:', error);
    }
  }

  async function fetchUserScores() {
    try {
      const response = await axios.get(
        `https://endtoend-405500.uw.r.appspot.com/findByGoogleId?googleId=${googleId}&page=${currentPage}&size=10`
      );
  
      // Assuming the response structure includes a 'content' property containing the array of GameRecord
      const { content } = response.data;
  
      setUserScores(content);
    } catch (error) {
      console.error('Error fetching user scores:', error);
    }
  }

  useEffect(() => {
    fetchUserScores();
  }, [googleId, currentPage]);
  
  // Add a function to handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div>You are in game view.</div>
      <label>
        <input
          type="text"
          maxLength={4}
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
        />
        <button onClick={handleGuess} type="button">
          Submit Guess
        </button>
      </label>
      <Gamefeedback guesses={guessesLeft} score={score} hasWon={hasWon} secretCode={secretCode} />
      <Guesses guesses={guesses} exacts={exacts} partials={partials} />
      {showOptions && (
        <div>
          <button type="button" onClick={resetGame}>
            Play Again
          </button>
          <button type="button" onClick={saveGameToDatabase}>
            Save Game
          </button>
        </div>
      )}
      <br />
    </>
  );
}
