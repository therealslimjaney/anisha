import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import NicknameForm from './NicknameForm';
import Game from './Game';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

export default function App() {
  const [googleId, setGoogleId] = useState('');
  const [nickname, setNickname] = useState('');
  const [user, setUser] = useState('');
  const [userRecordExists, setUserRecordExists] = useState(false);





  const checkForUserRecord = async () => {
    try {
      const response = await fetch(`http://endtoend-405500.uw.r.appspot.com/findByUserGoogleId?userGoogleId=${googleId}`);
      const data = await response.json();
      const exists = data && data.id;
      setUserRecordExists(exists);
    } catch (error) {
      console.error('Error checking for user record:', error);
      // Handle the error
    }
  };

  useEffect(() => {
    // Check for the user record when the component mounts
    if (googleId) {
      checkForUserRecord();
    }
  }, [googleId]);



  async function getUserNickname(userGoogleId) {
    const response = await fetch(`http://endtoend-405500.uw.r.appspot.com/getUserNickname?userGoogleId=${userGoogleId}`);
    const nickname = await response.text();
    return nickname;
  }




  return (
    <div>
      {!user ? (
        <LoginForm setGoogleId={setGoogleId} setUser={setUser} />
      ) : userRecordExists ? (
        (() => {
          // Call getUserNickname and set the nickname using setNickname
          getUserNickname(googleId)
            .then(nickname => setNickname(nickname))
          return <Game googleId={googleId} />;
        })
      ) : (
        <NicknameForm
          setNickname={setNickname}
          googleId={googleId}
        />
      )
      }
    </div >
  );
}
