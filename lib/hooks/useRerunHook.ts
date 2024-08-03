"use client";

import React from "react";

export function useRerunHook() {
  const [random, setRandom] = React.useState<number | undefined>();
  React.useEffect(() => {
    setRandom(Math.random());
  }, []);
}
