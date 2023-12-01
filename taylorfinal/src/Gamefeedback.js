export default function Gamefeedback({ guesses, score, hasWon, secretCode }) {
  let feedbackClass = "Gamefeedback";
  if (hasWon) {
    feedbackClass += " won";
    return <div >Congratulations, you have won!</div>;
  }

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

  return (
    <div >
      Remaining attempts: {guesses}
      <br />
      Your Score: {score}
    </div>
  );
}