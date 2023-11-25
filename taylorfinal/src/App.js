import React from 'react';
import Game from './Game.js'
import {useState, useEffect} from 'react';
import axios from 'axios';

export default function App() {
  const [googleId, setGoogleId] = useState('JaneGoogleId');
  return (
    <div>
      <Game googleId={googleId}/>
    </div>
  )
}