import { Auth } from 'aws-amplify';
import React from 'react';

const AuthPage: React.FC = () => {

  const handleSignIn = () => {
    Auth.federatedSignIn();  // This redirects to the Hosted UI
  };

  return (
    <div>
      <h2>Please Sign In</h2>
      <button onClick={handleSignIn}>Sign In with Hosted UI</button>
    </div>
  );
};

export default AuthPage;
