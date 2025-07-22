// Example: src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth'; // Import Firebase auth

const GRAPHQL_API_URL = 'http://localhost:4000/graphql';

const Dashboard = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the currently logged-in user

  const [protectedMessage, setProtectedMessage] = useState('');
  const [error, setError] = useState('');

  // Use useEffect to fetch data when the component loads
  useEffect(() => {
    if (!user) {
      // If there's no user, don't even try to fetch
      setError('No user is logged in.');
      return;
    }

    const fetchProtectedData = async () => {
      try {
        // --- THIS IS THE CRUCIAL PART ---
        // 1. Get the ID token from the currently logged-in Firebase user.
        const token = await user.getIdToken();

        const query = `
          query GetProtectedData {
            protectedData
          }
        `;

        const response = await fetch(GRAPHQL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 2. Add the Authorization header with the token.
            // This is how the backend knows who you are.
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        // Set the secret message from the server to display it
        setProtectedMessage(result.data.protectedData);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchProtectedData();

  }, [user]); // Rerun this effect if the user object changes

  if (!user) {
    return <div>Loading user information or user is not logged in...</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.email}!</h2>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      
      <hr />

      <h3>Protected Server Data:</h3>
      {protectedMessage && <div style={{ color: 'green' }}>{protectedMessage}</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};

export default Dashboard;