import React from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "./Login.component";
import useLogin from "./useLogin";
import OuterLayout from "../../coremodules/OuterLayout";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  return (
    <OuterLayout title="Employee Login" onBack={() => navigate("/")}>
      <div className="mt-56">
        <LoginForm
          onSubmit={login}
          onForgotPassword={() => navigate("/forgot-password")}
          error={error}
          loading={loading}
        />
      </div>
    </OuterLayout>
  );
};

export default Login;
