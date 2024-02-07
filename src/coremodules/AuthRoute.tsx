import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import useSession from "../hooks/useSession";

const AuthRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useSession();

  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default AuthRoute;
