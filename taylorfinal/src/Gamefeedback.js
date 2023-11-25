export default function Gamefeedback({ guesses, score, hasWon, secretCode }) {
    if (hasWon) {
      return <div>Congratulations, you have won!</div>;
    }
  
    if (guesses === 0) {
      return (
        <div>
          Sorry, you have no remaining attempts.
          <br />
          Secret code: {secretCode}
        </div>
      );
    }
  
    return (
      <div>
        Remaining attempts: {guesses}
        <br />
        Your Score: {score}
      </div>
    );
  }