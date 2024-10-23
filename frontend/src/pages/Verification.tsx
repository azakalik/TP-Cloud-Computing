import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flex, Paper, Stack, Title, TextInput, Button, Text } from '@mantine/core';

const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const userEmail = searchParams.get('email'); // Check if email is passed via query params

  const handleVerify = async () => {
    try {
      const currentEmail = userEmail || email;
      await Auth.confirmSignUp(currentEmail, code);
      setMessage('Verification successful! Redirecting to sign in page...');
      setTimeout(() => {
        navigate('/');
      }, 2000); // Redirect to home after a successful verification
    } catch (error: any) {
      setError(error.message || JSON.stringify(error));
    }
  };

  const handleResendCode = async () => {
    try {
      const currentEmail = userEmail || email;
      await Auth.resendSignUp(currentEmail);
      setMessage('A new verification code has been sent to your email.');
    } catch (error: any) {
      setError(error.message || JSON.stringify(error));
    }
  };

  return (
    <Flex justify="center" align="center" direction="column" style={{height: '100vh', width: '100vw'}}>
      <Title mb="10">Verify Your Account</Title>
      <Paper w={"60%"} shadow="md" p="lg" mb="lg" withBorder>
        <Stack>
          {userEmail && (
            <Text color="green">
              A verification code was sent to your email: {userEmail}
            </Text>
          )}
          {error && <Text color="red">{error}</Text>}
          {message && <Text color="green">{message}</Text>}

          {!userEmail && (
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
            />
          )}

          <TextInput
            label="Verification Code"
            placeholder="Enter verification code"
            value={code}
            onChange={(event) => setCode(event.currentTarget.value)}
            required
          />

          <Flex justify="center">
            <Button onClick={handleVerify} mt="md">
              Verify Account
            </Button>
          </Flex>

          <Flex justify="center" mt="md">
            <Text>
              Didn’t receive the code?{' '}
              <Button variant="link" onClick={handleResendCode} style={{ padding: 0 }}>
                Resend Code
              </Button>
            </Text>
          </Flex>
        </Stack>
      </Paper>
    </Flex>
  );
};

export default VerifyPage;
