import { Outlet, RouteObject } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

const route: RouteObject = {
  path: "/gbm-crm",
  element: <Outlet />,

  children: [
    {
      index: true,
      element: <Dashboard/>,
    },
  ],
};

export default route;
