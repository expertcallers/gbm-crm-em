import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "./Login.component";
import useLogin from "./useLogin";
import OuterLayout from "../../coremodules/OuterLayout";
import useSession from "../../hooks/useSession";

const Login: React.FC = () => {
  const { token } = useSession();
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  if (token) return <Navigate to={"/gbm-crm"} />;
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
