import { useEffect, useState } from "react";

export function useStateHistory<T>(params: {
  state: T;
  maxHistorySize?: number;
}) {
  const { maxHistorySize = 2 } = params;
  const [history, setHistory] = useState<T[]>([params.state]);

  useEffect(() => {
    setHistory((prevHistory) =>
      [...prevHistory, params.state].slice(-maxHistorySize)
    );
  }, [params.state, maxHistorySize]);

  const state = history[history.length - 1] as T | undefined;
  const previousState = history[history.length - 2] as T | undefined;

  return { state, previousState, history };
}
