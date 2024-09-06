import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return <MantineProvider theme={theme}>
    <LandingPage />
  </MantineProvider>;
}