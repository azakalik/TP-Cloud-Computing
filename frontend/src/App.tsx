import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { NavBar } from "./components/NavBar";
import BidDetail from "./pages/BidDetail";

export default function App() {
  return <MantineProvider theme={theme}>
    <>
    <NavBar/>
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/bid/:id" element={<BidDetail />} />
        </Routes>
      </Router>
    </>
  </MantineProvider>;
}
