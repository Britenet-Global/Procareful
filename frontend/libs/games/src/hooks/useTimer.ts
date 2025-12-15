import { useEffect, useRef, useState } from 'react';

export const useTimer = () => {
  const [timer, setTimer] = useState(0); // time in seconds
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<unknown | null>(null);

  const increaseTimer = () => setTimer(prevTime => prevTime + 1);

  const resetTimer = () => {
    setTimer(0);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const timeInterval = setInterval(increaseTimer, 1000);
    intervalRef.current = timeInterval;

    return () => clearInterval(timeInterval);
  }, [isPaused]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer - minutes * 60;
  const formattedSeconds = seconds.toString().length < 2 ? `0${seconds}` : seconds;
  const timeToDisplay = `${minutes}:${formattedSeconds}`;

  return {
    timer,
    timeToDisplay,
    startTimer: () => setIsPaused(false),
    stopTimer: () => setIsPaused(true),
    resetTimer,
  };
};
