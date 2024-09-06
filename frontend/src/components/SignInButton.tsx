import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import { AuthenticationForm } from './AuthenticationForm';

export function SignInButton() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} centered withCloseButton={false}>
        <AuthenticationForm />
      </Modal>

      <Button onClick={open}>Log in / Sign up</Button>
    </>
  );
}