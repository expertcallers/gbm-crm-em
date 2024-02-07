import React, { Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import Overview from "./pages/Overview";
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
      path: "all-leads",
      element: <AllLeads />,
    },
  ],
};

export default route;
