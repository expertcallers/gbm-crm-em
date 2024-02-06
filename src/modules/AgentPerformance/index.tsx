import React, { Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import Overview from "./pages/Overview";

const route: RouteObject = {
  path: "/gbm-crm/agent-performance/",
  element: <Outlet />,

  children: [
    {
      index: true,
      element: <Overview />,
    },
  ],
};

export default route;
