import React, { useState } from 'react';
import './App.css';

export default function NicknameForm({ setNickname, googleId, setUserRecordExists }) {
  const [newNickname, setNewNickname] = useState('');

  const handleNicknameSubmit = () => {
    // Send a POST request to save the user record
    setNickname(newNickname);
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
  };

  return (
    <div>
      <label>
        <input
          type="text"
          className="input-field"
          onChange={(e) => setNewNickname(e.target.value)}
        />
      </label>
      <button style={{
        backgroundColor: '#3e3967', // Set the background color
        color: 'white',              // Set the text color
        fontSize: '24px',
        fontFamily: 'Love'
        // Add more styles as needed
      }} onClick={handleNicknameSubmit}>Set player handle:</button>
    </div>
  );
}

