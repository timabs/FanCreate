import { useCallback, useRef } from "react";

export const useDebounce = (func, delay) => {
  const timeoutRef = useRef();

  const debouncedFunction = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    },
    [func, delay]
  );

  return debouncedFunction;
};
