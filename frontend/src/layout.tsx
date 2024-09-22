import { ReactNode } from "react";
import { NavBar } from "./components/NavBar";
import { Container } from "@mantine/core";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <NavBar />
      <Container mx='30' fluid>
        {children}
      </Container>
    </>
  );
};
