import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Button } from '@mantine/core';

export function SignOutButton() {
  const navigate = useNavigate();


  const handleSignOut = async () => {
    try {
      await Auth.signOut(); // Sign out the user
      navigate('/signin'); // Redirect to sign-in page after sign-out
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  return (
      <Button onClick={handleSignOut}>Sign out</Button>
  );
}