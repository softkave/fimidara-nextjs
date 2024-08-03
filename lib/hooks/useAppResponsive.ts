"use client";

import { useResponsive } from "ahooks/lib/useResponsive";
import { IUseResponsiveResult } from "../definitions/types";
import { useRerunHook } from "./useRerunHook";

export default function useAppResponsive() {
  const responsive = useResponsive() as unknown as
    | IUseResponsiveResult
    | undefined;
  useRerunHook();
  return responsive;
}
