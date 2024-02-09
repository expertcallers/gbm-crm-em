//This hook is used to interact with browser local storage

import { useCallback, useMemo, useState } from "react";

const useStorage = <T>(key: string, initial: T | null) => {
  //current value stored in the local storage
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    try {
      const value = window.localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      } else {
        return initial;
      }
    } catch (err) {
      console.log(`there is a error occured with the ${key}`, err);
      return initial;
    }
  });
  //to update the local storage value
  const setStorage = useCallback(
    (value: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return value;
      } catch (err) {
        console.log(
          `error created with the ${key} in browser local storage`,
          err
        );
      }
      setStoredValue(value);
    },
    [key]
  );

  //to remove the key from browser storage

  const clearStorage = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.log(`error created with the ${key} in browser local storage`);
    }
    setStoredValue(null);
  }, [key]);

  //for memorisation purpose
  return useMemo(
    () => ({ storedValue, setStorage, clearStorage }),
    [storedValue, clearStorage, setStorage]
  );
};

export default useStorage;
