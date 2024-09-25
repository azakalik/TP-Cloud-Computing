import { ReactNode } from "react";
import { NavBar } from "./components/NavBar";
import { Container } from "@mantine/core";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <NavBar />
      <Container p='30' size={'100%'}>
        {children}
      </Container>
    </div>
  );
};
