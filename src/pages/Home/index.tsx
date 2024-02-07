import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import OuterLayout from "../../coremodules/OuterLayout";
import ProfileMenu from "./ProfileMenu";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <OuterLayout
      onNavigateToHome={() => navigate("/gbm-crm/")}
      EndComponent={<ProfileMenu />}
    >
      <Outlet />
    </OuterLayout>
  );
};

export default Home;
