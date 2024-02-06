import { useMemo, useState } from "react";

/**
 * It returns an object with a `storage` property that is the value of the local storage item, a
 * `setStorage` function that sets the value of the local storage item, and a `clearStorage` function
 * that removes the local storage item
 * @param {string} key - The key to use in localStorage.
 * @param {T | null} initial - The initial value of the storage.
 * @returns An object with three properties: storage, setStorage, and clearStorage.
 */
const useLocalStorage = <T>(key: string, initial: T | null) => {
	const [storage, setStoredValue] = useState<T | null>(() => {
		try {
			const value = window.localStorage.getItem(key);
			if (value) { return JSON.parse(value); }
			window.localStorage.setItem(key, JSON.stringify(initial));
			return initial;
		}
		catch (err) { return initial; }
	});

	const setStorage = (value: T) => {
		try { window.localStorage.setItem(key, JSON.stringify(value)); }
		catch (err) { }
		setStoredValue(value);
	};

	const clearStorage = () => {
		try { window.localStorage.removeItem(key); }
		catch (err) { }
		setStoredValue(null);
	}

	return useMemo(() => ({ storage, setStorage, clearStorage }), [storage]);
};

export default useLocalStorage;