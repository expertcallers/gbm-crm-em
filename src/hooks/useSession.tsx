import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../constant";
import useLocalStorage from "./useLocalStorage";
import util from "./util";

const USER_STORAGE_KEY = "gbm_u";
const TOKEN_STORAGE_KEY = "gbm_t";

type SessionType = {
  token: string | null;
  user: User | null;
  setUser: (callback: (prev: User | null) => User | null) => void;
  storage: {
    storeToken: (value: string) => void;
    storeUser: (value: User) => void;
    clear: () => void;
  };
};

const SessionContext = createContext<SessionType>({
  token: null,
  user: null,
  setUser: () => null,
  storage: {
    storeToken: () => {},
    storeUser: () => {},
    clear: () => {},
  },
});

const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const token = useLocalStorage<SessionType["token"]>(TOKEN_STORAGE_KEY, null);
  const user = useLocalStorage<SessionType["user"]>(USER_STORAGE_KEY, null);

  const setUser = (
    callback: (user: SessionType["user"]) => SessionType["user"]
  ) => {
    if (!user) return null;
    user.setStorage(callback(user.storage));
  };

  useQuery<any, string>({
    enabled: !!token.storage,
    queryKey: ["getMyTeam", token.storage],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/team/get_custom_my_team`, {
        headers: { Authorization: `Token ${token.storage}` },
      });
      const result: any = await response.json();
      if (![200, 201].includes(response.status))return util.handleError(result);
      if (user.storage)
        user.setStorage({ ...user.storage, my_team: result.my_team });
      return result;
    },
  });

  const value = useMemo(
    () => ({
      token: token.storage,
      user: user.storage,
      setUser,
      storage: {
        storeToken: (value: string) => {
          token.setStorage(value);
        },
        storeUser: (value: User) => {
          user.setStorage(value);
        },
        clear: () => {
          token.clearStorage();
          user.clearStorage();
        },
      },
    }),
    [token.storage, user.storage]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export default useSession;
