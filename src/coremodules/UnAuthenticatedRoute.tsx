import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import useSession from "../hooks/useSession";
import { BASE_ROUTE } from "../constant";

const UnAuthenticatedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useSession();

  if (token) {
    return <Navigate to={BASE_ROUTE} />;
  }

  return <>{children}</>;
};

export default UnAuthenticatedRoute;
