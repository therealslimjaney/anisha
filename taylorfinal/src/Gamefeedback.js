import React from 'react';

/**
 * Gamefeedback component renders feedback based on the game state.
 * @param {number} guesses - The remaining attempts in the game.
 * @param {number} score - The player's score.
 * @param {boolean} hasWon - Indicates if the player has won the game.
 * @param {string} secretCode - The secret code for the game.
 * @returns {JSX.Element} - Rendered feedback based on game state.
 */
export default function Gamefeedback({ guesses, score, hasWon, secretCode }) {
  // Default class for styling
  let feedbackClass = "Gamefeedback";

  // Add 'won' class and display winning message if the player has won
  if (hasWon) {
    feedbackClass += " won";
    return (
      <div>
        Congratulations, you have won!
        <br />
        Your Score: {score}
      </div>
    );
  }

  // Add 'lost' class and display losing message with secret code if no remaining attempts
  if (guesses === 0) {
    feedbackClass += " lost";
    return (
      <div>
        Sorry, you have no remaining attempts.
        <br />
        Secret code: <code>{secretCode}</code>
      </div>
    );
  }

  // Display remaining attempts and player's score
  return (
    <div>
      Remaining attempts: {guesses}
      <br />
      Your Score: {score}
    </div>
  );
}
