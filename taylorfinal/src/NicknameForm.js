/**
 * NicknameForm component allows users to set their nickname and saves it to the server.
 * @param {function} setNickname - Callback function to set the user's nickname.
 * @param {string} googleId - Google ID of the user.
 * @param {function} setUserRecordExists - Callback function to set if user record exists.
 * @returns {JSX.Element} - Rendered form to set the user's nickname.
 */
import React, { useState } from 'react';
import './App.css';

export default function NicknameForm({ setNickname, googleId, setUserRecordExists }) {
  // State for the new nickname
  const [newNickname, setNewNickname] = useState('');

  // Function to handle nickname submission
  const handleNicknameSubmit = () => {
    // Send a POST request to save the user record
    setNickname(newNickname);
    fetch('https://endtoend-405500.uw.r.appspot.com/saveUserRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userGoogleId: googleId,
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

  // Render the input field and submit button for setting the nickname
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
        backgroundColor: '#3e3967', 
        color: 'white',              
        fontSize: '24px',
        fontFamily: 'Love'
        // Add more styles as needed
      }} onClick={handleNicknameSubmit}>Set player handle:</button>
    </div>
  );
}


