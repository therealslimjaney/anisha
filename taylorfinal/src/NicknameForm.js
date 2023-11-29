import React, { useState } from 'react';

export default function NicknameForm({ setNickname, googleId, setUserRecordExists }) {
  const [newNickname, setNewNickname] = useState('');

  const handleNicknameSubmit = () => {
      // Send a POST request to save the user record
    fetch('http://endtoend-405500.uw.r.appspot.com/saveUserRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userGoogleId: googleId, // Replace with actual user Google ID
        userHandle: newNickname,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save user record');
        }
        // Handle success if needed
      })
      .catch(error => {
        console.error('Error saving user record:', error);
        // Handle error if needed
      });
      setUserRecordExists(true);
      setNickname(newNickname);
  };

  return (
    <div>
      <label>
        Set your nickname:
        <input
          type="text"
          onChange={(e) => setNewNickname(e.target.value)}
        />
      </label>
      <button onClick={handleNicknameSubmit}>Submit Nickname</button>
    </div>
  );
}

