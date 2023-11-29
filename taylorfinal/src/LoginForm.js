import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import React, { useState, useEffect } from 'react';

// LoginSuccessful is a function sent in by parent component
function LoginForm({ setGoogleId, user, setUser }) {
	const firebaseConfig = {
		apiKey: "AIzaSyCPuHAVpGtTiz4LwApdWVSJIFJPF2dieLQ",
		authDomain: "taylor-e20bf.firebaseapp.com",
		projectId: "taylor-e20bf",
		storageBucket: "taylor-e20bf.appspot.com",
		messagingSenderId: "211296375786",
		appId: "1:211296375786:web:e35b697c58eb3bee995893",
		measurementId: "G-S5H931JN91"
	};

	initializeApp(firebaseConfig);

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

	function logoutGoogle() {
		const auth = getAuth();
		auth.signOut();
		setUser(null);
		setGoogleId(null);
	}

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = auth.onAuthStateChanged((user) => {
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
	  
		return () => unsubscribe(); // Clean up the listener on component unmount
	  }, []);
	
	  return (
		<div>
		  {!user ? (
			<button onClick={signInWithGoogle}>Sign in with Google</button>
		  ) : (
			<>
			  <p>User: {user.uid}</p>
			  <button onClick={logoutGoogle}>Log out</button>
			</>
		  )}
		</div>
	  );
	}

export default LoginForm;