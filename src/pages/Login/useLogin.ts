import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../constant";
import useSession from "../../hooks/useSession";

type LoginResponse = {
  action?: string;
  error?: string;
  token?: string;
  user?: User;
};

const useLogin = () => {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  const { storage } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");

    const data = new FormData(e.currentTarget);
    const empId = data.get("empId") as string | null;
    const password = data.get("password") as string | null;
    const hasPolicyAccepted = data.get("policy_accepted") !== null;
    const policy_accepted = String(
      (data.get("policy_accepted") as string | null) === "on"
    );

    if (!empId || !password) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/mapping/login`, {
        method: "POST",
        body: JSON.stringify(
          !hasPolicyAccepted
            ? { username: empId, password }
            : { username: empId, password, policy_accepted }
        ),
        headers: { "content-type": "application/json" },
      });
      const result: LoginResponse = await response.json();
      if (response.status === 406 && result?.action === "accept_policy") {
        setSearchParams("?policy=na");
        setError(result.error);
        return;
      }
      if (response.status === 406 && result?.action === "reset_password") {
        navigate("/forgot-password", {
          state: { title: "Reset Password", empId },
        });
        return;
      }
      if (response.status !== 200) {
        return setError(result?.error ? result.error : "Something went wrong.");
      }
      if (response.status === 200 && result?.token)
        storage.storeToken(result.token);
      if (response.status === 200 && result?.user)
        storage.storeUser(result.user);
      window.location.reload();
      return result;
    } catch (e) {
      setError("Something went wrong, try again later.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return useMemo(
    () => ({
      login,
      error,
      loading,
    }),
    [loading, error]
  );
};

export default useLogin;
