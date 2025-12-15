import { useCallback, useState } from 'react';

export const useToggle = (initialState = false) => {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prevVisible => !prevVisible);
  }, []);

  const setVisibility = useCallback((newVisibility: boolean) => {
    setIsVisible(newVisibility);
  }, []);

  return [isVisible, toggleVisibility, setVisibility] as const;
};
