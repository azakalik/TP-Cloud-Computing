import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import LandingPage from "./pages/ListAuctionsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import necessary styles
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

import './styles.css';

import { Layout } from "./layout";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import MyAuctionsPage from "./pages/MyAuctionsPage";
import NewAuctionPage from "./pages/NewAuctionPage";
import AboutUsPage from "./pages/AboutUsPage";

import { Amplify } from 'aws-amplify';
import awsconfig from "./configuration/awsconfig";
import PrivateRoute from "./components/PrivateRoute";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyPage from "./pages/Verification";

Amplify.configure(awsconfig);

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Route for Authentication */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verification" element={<VerifyPage />} />

          {/* Private Routes */ }
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/auction/:id" element={<Layout><AuctionDetailPage /></Layout>} />
            <Route path="/my_auctions" element={<Layout><MyAuctionsPage /></Layout>} />
            <Route path="/new_auction" element={<Layout><NewAuctionPage /></Layout>} />
            <Route path="/about_us" element={<Layout><AboutUsPage /></Layout>} />
          </Route>
        </Routes>
      </Router>
    </MantineProvider>
  );
}
