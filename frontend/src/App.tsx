import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import LandingPage from "./pages/LandingPage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/test",
    element: <div>Test</div>,
  }
]);

export default function App() {
  return <MantineProvider theme={theme}>
    <RouterProvider router={router} />
  </MantineProvider>;
}
