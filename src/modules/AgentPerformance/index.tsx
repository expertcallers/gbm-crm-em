import { Outlet, RouteObject } from "react-router-dom";
import Overview from "./pages/Overview";
import AllCustomers from "./pages/AllCustomers";
import AllLeads from "./pages/AllLeads";

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
    {
      path: "all-leads",
      element: <AllLeads />,
    },
  ],
};

export default route;
