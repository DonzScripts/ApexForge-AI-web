import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "../pages/Home";
import CheckIn from "../pages/CheckIn";
import Plans from "../pages/Plans";
import Progress from "../pages/Progress";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "checkin", element: <CheckIn /> },
      { path: "plans", element: <Plans /> },
      { path: "progress", element: <Progress /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);