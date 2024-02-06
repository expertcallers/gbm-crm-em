import React from "react";
import { useNavigate } from "react-router-dom";
import OuterLayout from "../../coremodules/OuterLayout";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const onLogin = () => navigate("/login");

  return (
    <>
      <OuterLayout
        rootClassName="flex flex-col flex-1 gap-1 m-1"
        containerClassName="relative rounded-md overflow-hidden "
        EndComponent={
          <button
            onClick={onLogin}
            type="button"
            className="hover:underline text-white font-semibold cursor-pointer highlight-none mr-4"
          >
            Login
          </button>
        }
      ></OuterLayout>
      <div className="mt-5"></div>
    </>
  );
};

export default Landing;
