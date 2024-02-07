import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import modules from "../modules";
import ErrorPage from "./Core/ErrorPage";
import ApplicationError from "./Core/ApplicationError";
import Landing from "./Landing";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Home from "./Home";
import InnerLayout from "../coremodules/InnerLayout";
import Menu from "./Home/Menu";
import AuthRoute from "../coremodules/AuthRoute";
import UnAuthenticatedRoute from "../coremodules/UnAuthenticatedRoute";

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
        element: (
          <UnAuthenticatedRoute>
            <Login />,
          </UnAuthenticatedRoute>
        ),
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
    path: "/",
    element: (
      <AuthRoute>
        <Home />
      </AuthRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "gbm-crm",
        element: (
          <InnerLayout Menu={Menu}>
            <Outlet />
          </InnerLayout>
        ),
        errorElement: <ErrorPage />,
        children: [modules.dashboardModule, modules.agentPerformanceModule],
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
