import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import NicknameForm from './NicknameForm';
import Game from './Game';

export default function App() {
  const [googleId, setGoogleId] = useState('');
  const [nickname, setNickname] = useState('');
  const [user, setUser] = useState('');

  // Watch for changes in the nickname state
  useEffect(() => {
    // Check if the nickname is not empty and the user is logged in
    if (nickname && user && googleId) {
      // Save the UserRecord to the server
      saveUserRecordToServer(googleId, nickname);
    }
  }, [nickname, user, googleId]);

  const handleLogin = async (user) => {
    if (user && user.uid) {
      setGoogleId(user.uid);

      try {
        const response = await axios.get(
          `https://endtoend-405500.uw.r.appspot.com/findByUserGoogleId?userGoogleId=${user.uid}`
        );

        if (!response.data.isEmpty) {
          setNickname(response.data[0].userHandle);
        } else {
          // Create a userRecord object with user.uid and user.displayName
          const userRecord = {
            userGoogleId: user.uid,
            userHandle: "oof", // You can set this to a default value or user.displayName
          };

          // Use axios.post to save the user record
          await axios.post(
            'https://endtoend-405500.uw.r.appspot.com/saveUserRecord',
            userRecord
          );
        }
      } catch (error) {
        console.error('Error checking for user record:', error);
      }
    } else {
      console.error('Invalid user object:', user);
    }
  };

  const saveUserRecordToServer = async (userId, userNickname) => {
    try {
      // Make an API call to save the UserRecord
      const response = await axios.post(
        'https://endtoend-405500.uw.r.appspot.com/saveUserRecord',
        {
          userGoogleId: googleId,
          userHandle: userNickname,
        }
      );

      if (response.status === 200) {
        console.log('UserRecord saved successfully.');
      } else {
        console.error('Failed to save UserRecord:', response.data);
      }
    } catch (error) {
      console.error('Error saving UserRecord:', error);
    }
  };

  return (
    <div>
      {!user ? (
        <LoginForm setGoogleId={setGoogleId} setUser={setUser} />
      ) : nickname ? (
        <Game googleId={googleId} />
      ) : (
        <NicknameForm
          googleId={googleId}
          setNickname={setNickname}
          setLoggedUser={setUser}
        />
      )}
    </div>
  );
}
