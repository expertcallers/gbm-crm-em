import { useState, useEffect, useRef } from "react";

interface Countdown {
	timeRemaining: number;
	isRunning: boolean;
	start: () => void;
	pause: () => void;
	reset: () => void;
}

const useCountdown = (initialTime: number, interval = 1000): Countdown => {
	const [timeRemaining, setTimeRemaining] = useState(initialTime);
	const [isRunning, setIsRunning] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (isRunning && timeRemaining > 0) {
			intervalRef.current = setInterval(() => {
				setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
			}, interval);
		}
		return () => clearInterval(intervalRef.current);
	}, [isRunning, timeRemaining, interval]);

	const start = () => {
		setIsRunning(true);
	};

	const pause = () => {
		setIsRunning(false);
	};

	const reset = () => {
		setIsRunning(false);
		setTimeRemaining(initialTime);
	};

	return {
		timeRemaining,
		isRunning,
		start,
		pause,
		reset,
	};
};

export default useCountdown;