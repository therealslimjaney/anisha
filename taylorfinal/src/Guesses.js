export default function Guesses({guesses, exacts, partials }) {
    return (
      <ul>
        {guesses.map((guessData, index) => (
          <li key={index}>
            {guessData.guess} - Exact matches: {exacts}, Partial matches: {partials}
          </li>
        ))}
      </ul>
    );
  }