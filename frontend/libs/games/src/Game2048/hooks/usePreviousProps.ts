import { useEffect, useRef } from 'react';

export const usePreviousProps = <T>(value: T) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
