import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Guesses from './Guesses';
import Gamefeedback from './Gamefeedback';
import MyGames from './MyGames';
import TopScores from './TopScores';

export default function Game({ googleId }) {
  const secretCode = generateCode();
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [guessesLeft, setGuessesLeft] = useState(10);
  const [score, setScore] = useState(100);
  const [exacts, setExacts] = useState(null);
  const [partials, setPartials] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [userScores, setUserScores] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newUsername, setNewUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [currentView, setCurrentView] = useState('game');

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

    for (let i = 0; i < 4; i++) {
      if (guessArray[i] === secretCodeArray[i]) {
        currentExacts++;
        guessArray[i] = '_';
        secretCodeArray[i] = '_';
      }
    }

    for (let i = 0; i < 4; i++) {
      if (guessArray[i] !== '_' && secretCodeArray.includes(guessArray[i])) {
        currentPartials++;
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
      date: 'a date',
    };

    try {
      await axios.post(
        'https://endtoend-405500.uw.r.appspot.com/saveGameRecord',
        gameData
      );
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
      const response = await axios.get(
        'https://endtoend-405500.uw.r.appspot.com/topOverallScores'
      );
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

      const { content } = response.data;

      setUserScores(content);
    } catch (error) {
      console.error('Error fetching user scores:', error);
    }
  }

  useEffect(() => {
    fetchUserScores();
  }, [googleId, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleUsernameChange = () => {
    setIsEditingUsername(true);
  };

  const handleSubmitUsername = async () => {
    try {
      await axios.post(
        'https://your-api-endpoint/updateUsername',
        { googleId, newUsername }
      );
      console.log('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
    }

    setNewUsername('');
    setIsEditingUsername(false);
  };

  const renderUsernameForm = () => (
    <div>
      <label>
        New Username:
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </label>
      <button type="button" onClick={handleSubmitUsername}>
        Submit
      </button>
      <button type="button" onClick={() => setIsEditingUsername(false)}>
        Cancel
      </button>
    </div>
  );

  const goToMyGames = () => {
    setCurrentView(currentView === 'myGames' ? 'game' : 'myGames');
  };

  const goToTopScores = () => {
    setCurrentView(currentView === 'topScores' ? 'game' : 'topScores');
  };

  const goBackToGame = () => {
    setCurrentView('game');
  };

  const renderTopScoresButtonText = currentView === 'topScores' ? 'Back to Play' : 'Top Scores';
  const renderMyGamesButtonText = currentView === 'myGames' ? 'Back to Play' : 'My Games';



  const renderView = () => {
    switch (currentView) {
      case 'game':
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
          </>
        );
      case 'myGames':
        return (
          <MyGames
            googleId={googleId}
            goBackToGame={goBackToGame}
          />
        );
      case 'topScores':
        return (
          <TopScores
            topScores={topScores}
            goBackToGame={goBackToGame}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <button type="button" onClick={goToTopScores}>
          {renderTopScoresButtonText}
        </button>
        <button type="button" onClick={goToMyGames}>
          {renderMyGamesButtonText}
        </button>
        <button type="button" onClick={handleUsernameChange}>
          Change Username
        </button>
      </div>
      {renderView()}
    </>
  );
}
  
    

