import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import ErrorPage from "./Core/ErrorPage";
import ApplicationError from "./Core/ApplicationError";
import Landing from "./Landing";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorPage />,
      },
      {
        path: "login",
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
        errorElement: <ErrorPage />,
      },
    ],
  },

  {
    path: "*",
    element: (
      <ApplicationError title="Error...!" description="Something went wrong." />
    ),
    errorElement: <ErrorPage />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
