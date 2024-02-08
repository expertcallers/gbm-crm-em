import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import useLocalStorage from "./useLocalStorage";

const USER_STORAGE_KEY = "gbm_u";
const TOKEN_STORAGE_KEY = "gbm_t";

type User = {
  emp_id: any;
};

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
  const token = useLocalStorage<string | null>(TOKEN_STORAGE_KEY, null);
  const user = useLocalStorage<User | null>(USER_STORAGE_KEY, null);

  const setUser = (callback: (user: User | null) => User | null) => {
    if (!user) return null;
    user.setStorage(callback(user.storage));
  };

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
