import { useCallback, useEffect, useRef } from "react";

/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */
export function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  // Return a memoized callback that will always call the latest callback
  return useCallback(((...args) => callbackRef.current?.(...args)) as T, []);
}
