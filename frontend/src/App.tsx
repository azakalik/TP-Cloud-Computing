import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import LandingPage from "./pages/BiddingPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { NavBar } from "./components/NavBar";
import BidDetail from "./pages/BidDetail";
import MyBidsPage from "./pages/MyBids";
import { AboutUs } from "./pages/AboutUs";
import NewBid from "./pages/NewBid";

export default function App() {
  return <MantineProvider theme={theme}>
    <>
    <NavBar/>
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/bid/:id" element={<BidDetail />} />
          <Route path="my_bids" element={<MyBidsPage />} />
          <Route path="new_bid" element={<NewBid />} />
          <Route path="about_us" element={<AboutUs />} />
        </Routes>
      </Router>
    </>
  </MantineProvider>;
}
