import { ReactNode } from "react";
import { NavBar } from "./components/NavBar";
import { Container } from "@mantine/core";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{height:'100%'}}>
      <NavBar />
      <Container p='30' style ={{backgroundColor: '#f5f5f5'}} size={'100%'}>
        {children}
      </Container>
    </div>
  );
};
