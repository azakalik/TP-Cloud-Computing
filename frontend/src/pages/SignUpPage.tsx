import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Flex, Paper, Stack, Title, TextInput, Button, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email, // Required for Cognito to send verification code
        },
      });
      navigate(`/verification?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      setError(error.message || JSON.stringify(error));
    }
  };

  return (
    <Flex justify="center" align="center" direction="column" style={{height: '100vh', width: '100vw'}}>
      <Title mb="10">Sign Up</Title>
      <Paper w={"60%"} shadow="md" p="lg" mb="lg" withBorder>
        <Stack>
          {error && <Text color="red">{error}</Text>}
          {message && <Text color="green">{message}</Text>}

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
            <Button onClick={handleSignUp} mt="md">
              Sign Up
            </Button>
          </Flex>

          <Flex justify="center" mt="md">
            <Text>
              Already have an account?{' '}
              <Link to="/signin" style={{ textDecoration: 'none', color: '#1c7ed6' }}>
                Back to Sign In
              </Link>
            </Text>
          </Flex>
        </Stack>
      </Paper>
    </Flex>
  );
};

export default SignUpPage;
