import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate, Link } from 'react-router-dom';
import { Flex, Paper, Stack, Title, TextInput, Button, Text } from '@mantine/core';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      // Sign in the user
      await Auth.signIn(email, password);
      navigate('/'); // Redirect to home if the email is verified
    } catch (error: any) {
      if (error.code === 'UserNotFoundException') {
        setError('User does not exist. Please sign up.');
      } else {
        setError(error.message || JSON.stringify(error));
      }
    }
  };

  return (
    <Flex justify="center" align="center" direction="column" style={{height: '100vh', width: '100vw'}}>
      <Title mb="10">Sign In</Title>
      <Paper w={"60%"} shadow="md" p="lg" mb="lg" withBorder>
        <Stack>
          {error && <Text color="red">{error}</Text>}

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
          />

          <Flex justify="center">
            <Button onClick={handleSignIn} mt="md">
              Sign In
            </Button>
          </Flex>

          <Flex justify="space-between" mt="md">
            <Text>
              Don't have an account?{' '}
              <Link to="/signup" style={{ textDecoration: 'none', color: '#1c7ed6' }}>
                Create an Account
              </Link>
            </Text>
            <Text>
              Need to verify your account?{' '}
              <Link to="/verification" style={{ textDecoration: 'none', color: '#1c7ed6' }}>
                Verify Account
              </Link>
            </Text>
          </Flex>
        </Stack>
      </Paper>
    </Flex>
  );
};

export default SignInPage;
