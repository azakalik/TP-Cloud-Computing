import React from 'react';
import { Auth } from 'aws-amplify';

const AuthPage: React.FC = () => {
  const handleSignIn = () => {
    Auth.federatedSignIn(); // This will redirect to the Hosted UI
  };

  const handleSignOut = () => {
    Auth.signOut(); // This will sign out the user
  };

  return (
    <div>
      <h2>Hosted UI Auth</h2>
      <button onClick={handleSignIn}>Sign In with Hosted UI</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default AuthPage;
