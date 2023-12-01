import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Guesses from './Guesses';
import Gamefeedback from './Gamefeedback';
import MyGames from './MyGames';
import TopScores from './TopScores';
import { format } from 'date-fns';

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
  const [isGameSaved, setIsGameSaved] = useState(false); // New state to track game save status

  const renderViewButtons = () => (
    <div>
    <button
      type="button"
      onClick={goBackToGame}
      className={currentView === 'game' ? 'active' : ''}
    >
      Play Mastermind
    </button>
    <button
      type="button"
      onClick={goToTopScores}
      className={currentView === 'topScores' ? 'active' : ''}
    >
      Top Scores
    </button>
    <button
      type="button"
      onClick={goToMyGames}
      className={currentView === 'myGames' ? 'active' : ''}
    >
      My Scores
    </button>
    <button
      type="button"
      onClick={() => setCurrentView('changeUsername')}
      className={currentView === 'changeUsername' ? 'active' : ''}
    >
      Change User Handle
    </button>
  </div>
  );

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
    setIsGameSaved(false); // Reset save status when resetting the game
  }

  function handleGuess(e) {
    e.preventDefault();
  
    if (guessesLeft > 0) {
      countMatches();
      setGuesses([...guesses, { guess: currentGuess, exacts, partials }]);
  
      if (exacts === 4) {
        setHasWon(true);
        setShowOptions(true);
      } else if (guessesLeft === 1) {
        setShowOptions(true);
      }
  
      // Deduct points only if the guess is incorrect
      if (exacts !== 4) {
        setScore(score - 10);
      }
  
      setGuessesLeft((prevGuessesLeft) => prevGuessesLeft - 1);
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

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd-MM-yyyy');
    const gameData = {
      googleId: googleId,
      score: score,
      Date: formattedDate,
    };

    try {
      await axios.post(
        'https://endtoend-405500.uw.r.appspot.com/saveGameRecord',
        gameData
      );
      setIsGameSaved(true); // Update save status after successful save
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
        'https://endtoend-405500.uw.r.appspot.com/updateUserNickname',
        null, // pass null as the request body
        {
          params: {
            userGoogleId: googleId,
            userHandle: newUsername
          }
        }
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

  const renderTopScoresButtonText = 'Top Scores';
  const renderMyGamesButtonText = 'My Scores';



  const renderView = () => {
    switch (currentView) {
      case 'game':
        return (
          <>
          {renderViewButtons()}
            <div>You are in game view.</div>
            <label>
              <input
                type="text"
                maxLength={4}
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                disabled={hasWon || guessesLeft === 0} // Disable input when game is won or lost
              />
              <button
                onClick={handleGuess}
                type="button"
                disabled={hasWon || guessesLeft === 0} // Disable button when game is won or lost
              >
                Submit Guess
              </button>
            </label>
            <Gamefeedback
              guesses={guessesLeft}
              score={score}
              hasWon={hasWon}
              secretCode={secretCode}
            />
            <Guesses guesses={guesses} exacts={exacts} partials={partials} />
            {showOptions && (
              <div>
                <button type="button" onClick={resetGame}>
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={saveGameToDatabase}
                  disabled={isGameSaved} // Disable the button if the game is already saved
                >
                  {isGameSaved ? 'Game Saved ✓' : 'Save Game'}
                </button>
              </div>
            )}
          </>
        );
        case 'myGames':
          return (
            <>
              {renderViewButtons()}
              <MyGames googleId={googleId} goBackToGame={goBackToGame} />
            </>
          );
        case 'topScores':
          return (
            <>
              {renderViewButtons()}
              <TopScores topScores={topScores} goBackToGame={goBackToGame} />
            </>
          );
        case 'changeUsername':
          return (
            <>
              {renderViewButtons()}
              {renderUsernameForm()}
            </>
          );
      default:
        return null;
    }
  };

  return (
    <>
      {renderView()}
    </>
  );
}




