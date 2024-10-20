import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Link, useNavigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // To programmatically navigate between pages

  const handleSignIn = async () => {
    try {
      await Auth.signIn(email, password);
      navigate('/'); // Redirect to home or another page after successful login
    } catch (error: any) {
      if (error.code === 'UserNotFoundException') {
        setError('User does not exist. Please sign up.');
      } else {
        setError(error.message || JSON.stringify(error));
      }
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
      <button onClick={handleSignIn}>Sign In</button>
      <p>
        Don't have an account?{' '}
        <Link to="/signup">
          <button>Create an Account</button>
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
