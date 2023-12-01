import React from 'react';
import './Guesses.css';
// Guesses Component
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