import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import LandingPage from "./pages/ListAuctionsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import '@mantine/dates/styles.css';

import { Layout } from "./layout";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import MyAuctionsPage from "./pages/MyAuctionsPage";
import NewAuctionPage from "./pages/NewAuctionPage";
import AboutUsPage from "./pages/AboutUsPage";

export default function App() {
  return (
    <MantineProvider theme={theme} >
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <LandingPage />
              </Layout>
            }
          />
          <Route
            path="/auction/:id"
            element={
              <Layout>
                <AuctionDetailPage />
              </Layout>
            }
          />
          <Route
            path="/my_auctions"
            element={
              <Layout>
                <MyAuctionsPage />
              </Layout>
            }
          />
          <Route
            path="/new_auction"
            element={
              <Layout>
                <NewAuctionPage />
              </Layout>
            }
          />
          <Route
            path="/about_us"
            element={
              <Layout>
                <AboutUsPage />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </MantineProvider>
  );
}
