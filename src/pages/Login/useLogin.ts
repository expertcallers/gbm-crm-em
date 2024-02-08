import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";

type LoginResponse = {
  action?: string;
  error?: string;
  token?: string;
  user?: User;
};

const useLogin = () => {
  const navigate = useNavigate();
  const { storage } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const empId = data.get("empId") as string | null;
    const password = data.get("password") as string | null;

    if (!empId || !password) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api-token-auth/`, {
        method: "POST",
        body: JSON.stringify({ username: empId, password }),
        headers: { "content-type": "application/json" },
      });
      const result: LoginResponse = await response.json();
      if (response.status === 406 && result?.action === "reset_password") {
        navigate("/forgot-password", {
          state: { title: "Reset Password", empId },
        });
        return;
      }
      if (![200, 201].includes(response.status)) {
        return setError(result?.error ? result.error : "Something went wrong.");
      }
      if (response.status === 200 && result?.token)
        storage.storeToken(result.token);
      if (response.status === 200 && result?.user)
        storage.storeUser(result.user);
      // window.location.reload();
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
