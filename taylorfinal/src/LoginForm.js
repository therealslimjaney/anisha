/**
 * LoginForm component handles user authentication using Firebase.
 * @param {function} setGoogleId - Callback function from parent component to set Google ID.
 * @returns {JSX.Element} - Rendered login form with Google sign-in button.
 */
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import './App.css';

function LoginForm({ setGoogleId }) {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCPuHAVpGtTiz4LwApdWVSJIFJPF2dieLQ",
    authDomain: "taylor-e20bf.firebaseapp.com",
    projectId: "taylor-e20bf",
    storageBucket: "taylor-e20bf.appspot.com",
    messagingSenderId: "211296375786",
    appId: "1:211296375786:web:e35b697c58eb3bee995893",
    measurementId: "G-S5H931JN91"
  };

  // Initialize Firebase app
  initializeApp(firebaseConfig);

  // State for current user
  const [user, setUser] = useState(null);

  // Function to sign in with Google
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithRedirect(auth, provider)
      .then(() => {
        // Nothing to do here, result is handled by onAuthStateChanged
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
  };

  // useEffect to handle authentication state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setGoogleId(user.uid);
        console.log(user.uid);
      } else {
        console.log("No user is signed in.");
      }
    });

    // Call the callback manually to handle the initial state
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setGoogleId(currentUser.uid);
    }

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [setGoogleId]);

  // Render the login form with Google sign-in button
  return (
    <div>
      {!user && (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
}

export default LoginForm;
