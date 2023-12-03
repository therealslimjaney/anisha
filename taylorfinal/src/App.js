import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import NicknameForm from './NicknameForm';
import Game from './Game';
import './App.css';

export default function App() {
  const [googleId, setGoogleId] = useState('');
  const [nickname, setNickname] = useState('');
  const [userRecordExists, setUserRecordExists] = useState(false);


  useEffect(() => {
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

