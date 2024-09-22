import "@mantine/core/styles.css";
import { Center, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import LandingPage from "./pages/ListAuctionsPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { NavBar } from "./components/NavBar";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import MyAuctionsPage from "./pages/MyAuctionsPage";
import NewAuctionPage from "./pages/NewAuctionPage";
import AboutUsPage from "./pages/AboutUsPage";

export default function App() {
  return <MantineProvider theme={theme}>
    <>
    <NavBar/>
    <Center mx='30'>
      <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auction/:id" element={<AuctionDetailPage />} />
            <Route path="my_auctions" element={<MyAuctionsPage />} />
            <Route path="new_auction" element={<NewAuctionPage />} />
            <Route path="about_us" element={<AboutUsPage />} />
          </Routes>
        </Router>
    </Center>
    </>
  </MantineProvider>;
}
