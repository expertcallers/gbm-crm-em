import { Outlet, RouteObject } from "react-router-dom";
import Overview from "./pages/Overview";
import AllCustomers from "./pages/AllCustomers";

const route: RouteObject = {
  path: "/gbm-crm/agent-performance/",
  element: <Outlet />,

  children: [
    {
      index: true,
      element: <Overview />,
    },

    {
      path: "all-customers",
      element: <AllCustomers />,
    },
  ],
};

export default route;
