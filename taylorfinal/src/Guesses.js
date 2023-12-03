/**
 * Guesses component renders a list of guesses with their exact and partial matches.
 * @param {Array} guesses - Array of guess objects containing guess data.
 * @param {number} exacts - Number of exact matches for each guess.
 * @param {number} partials - Number of partial matches for each guess.
 * @returns {JSX.Element} - Rendered list of guesses with match information.
 */
export default function Guesses({ guesses, exacts, partials }) {
  return (
    <ul className="Guesses">
      {guesses.map((guessData, index) => (
        <li key={index}>
          <span className="guess-text">{guessData.guess}</span> - Exact matches: <span className="matches">{exacts}</span>, Partial matches: <span className="matches">{partials}</span>
        </li>
      ))}
    </ul>
  );
}
