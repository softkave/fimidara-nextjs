"use client";

import useAppResponsive from "@/lib/hooks/useAppResponsive.ts";
import { isUndefined } from "lodash-es";
import React, { useEffect } from "react";
import { KeyValueKeys, useKvStore } from "../../lib/hooks/kvStore.ts";

export function useAppMenu() {
  const responsive = useAppResponsive();
  const isLg = responsive?.lg;

  const isOpen = useKvStore((state) => {
    return state.get(KeyValueKeys.appMenuOpen);
  });
  const set = useKvStore((state) => {
    return state.set;
  });

  const toggleAppMenu = React.useCallback(() => {
    set(KeyValueKeys.appMenuOpen, !isOpen);
  }, [isOpen, set]);

  useEffect(() => {
    if (isUndefined(isOpen) && isLg) {
      toggleAppMenu();
    }
  }, [isOpen, isLg, toggleAppMenu]);

  return { isOpen, toggleAppMenu };
}
