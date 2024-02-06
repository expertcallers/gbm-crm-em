import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import OuterLayout from "../../coremodules/OuterLayout";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <OuterLayout onNavigateToHome={() => navigate("/gbm-crm")}>
      <Outlet />
    </OuterLayout>
  );
};

export default Home;
