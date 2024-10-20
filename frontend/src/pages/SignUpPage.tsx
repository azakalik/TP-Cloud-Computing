import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email, // Required for Cognito to send verification code
        },
      });
      setMessage('Sign-up successful! Please check your email for the verification code.');
    } catch (error: any) {
      setError(error.message || JSON.stringify(error));
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUpPage;
