import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import NicknameForm from './NicknameForm';
import Game from './Game';
import './App.css';

/**
 * App component manages user authentication and renders appropriate components based on the user's state.
 */
export default function App() {
  const [googleId, setGoogleId] = useState('');
  const [nickname, setNickname] = useState('');
  const [userRecordExists, setUserRecordExists] = useState(false);

  /**
   * useEffect hook to check for user record and fetch user nickname when the Google ID changes.
   */
  useEffect(() => {
    /**
     * Checks if a user record exists for the given Google ID.
     */
    const checkForUserRecord = async () => {
      try {
        const response = await fetch(`https://endtoend-405500.uw.r.appspot.com/findByUserGoogleId?userGoogleId=${googleId}`);
        const data = await response.json();
        const exists = data && data.id;
        setUserRecordExists(exists);
      } catch (error) {
        console.error('Error checking for user record:', error);
        // Handle the error
      }
    };

    /**
     * Fetches the user nickname for the given Google ID.
     */
    const getUserNickname = async (userGoogleId) => {
      try {
        const response = await fetch(`https://endtoend-405500.uw.r.appspot.com/getUserNickname?userGoogleId=${userGoogleId}`);
        const nickname = await response.text();
        setNickname(nickname);
      } catch (error) {
        console.error('Error getting user nickname:', error);
        // Handle the error
      }
    };

    if (googleId) {
      checkForUserRecord();
      getUserNickname(googleId);
    }
  }, [googleId]);

  /**
   * Renders components based on the user's state.
   */
  return (
    <div>
      {googleId && !userRecordExists && (
        <NicknameForm
          setNickname={setNickname}
          googleId={googleId}
          setUserRecordExists={setUserRecordExists}
        />
      )}

      {googleId && userRecordExists && nickname && (
        <Game googleId={googleId} setGoogleId={setGoogleId} nickname={nickname} setNickname={setNickname} />
      )}

      {!googleId && (
        <LoginForm setGoogleId={setGoogleId} />
      )}
    </div>
  );
}


