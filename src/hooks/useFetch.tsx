import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { BASE_URL } from "../constant";

import useSession from "./useSession";
import ApplicationError from "../pages/Core/ApplicationError";

type Action = null | "reset_password" | "refresh";

type FetchContextType = {
  action: Action;
  setAction: (action: Action) => void;
};

const initialContext: FetchContextType = {
  action: null,
  setAction: () => {
    throw new Error("Fetch not working properly");
  },
};

const FetchContext = createContext<FetchContextType>(initialContext);

export default function useFetch() {
  const context = useContext(FetchContext);

  const { token, storage } = useSession();

  return useCallback(
    async (
      path: string,
      method: "POST" | "GET" | "DELETE" = "GET",
      body?: any,
      isForm?: boolean
    ) => {
      if (body && typeof body !== "string" && "set" in body && !isForm)
        return Promise.reject("Are you trying to send a form? Toggle isForm!");
      try {
        const headers: any = {};
        if (token) headers["Authorization"] = `Token ${token}`;
        if (!isForm) headers["Content-Type"] = "application/json";

        const response = await fetch(`${BASE_URL}${path}`, {
          method: method,
          body: method === "GET" ? undefined : body,
          headers: headers,
        });

        if (response.status === 403 || response.status === 401) {
          storage.clear();
          return response;
        }

        if (response.status === 406) {
          const result = await response.json();
          if (result.action) context.setAction(result.action);
        }

        if (response.status === 500) {
          return Promise.reject("An internal server error occurred");
        }

        return response;
      } catch (error: any) {
        if (error.message === "Failed to fetch")
          throw new Error("Something went wrong, please refresh try again.");
        throw error;
      }
    },
    [token]
  );
}

export const FetchProvider = ({ children }: React.PropsWithChildren) => {
  const [action, setAction] = useState<FetchContextType["action"]>(null);

  const value = useMemo<FetchContextType>(
    () => ({
      action,
      setAction: (action) => setAction(action),
    }),
    [action]
  );

  if (action === "reset_password")
    return (
      <ApplicationError
        title="Reset password"
        description="You need to reset your password before continuing"
        navigate_to="/reset_password"
        button="Go back"
        onBack={() => setAction(null)}
      />
    );

  return (
    <FetchContext.Provider value={value}>{children}</FetchContext.Provider>
  );
};
