import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NicknameForm({ setNickname }) {
  const [newNickname, setNewNickname] = useState('');
  const handleNicknameSubmit = () => {
    // Update the nickname state in your app
    setNickname(newNickname);
  };

  return (
    <div>
      <label>
        Set your nickname:
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
        />
      </label>
      <button onClick={handleNicknameSubmit}>Submit Nickname</button>
    </div>
  );
}

