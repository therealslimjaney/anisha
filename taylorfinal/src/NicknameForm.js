import React, { useState } from 'react';

export default function NicknameForm({ setNickname, saveUserRecord, googleId }) {
  const [newNickname, setNewNickname] = useState('');

  const handleNicknameSubmit = () => {
    // Perform any validation or additional logic if needed

    // Update the nickname state in the parent component (App.js)
    setNickname(newNickname);

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

