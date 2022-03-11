import { useResponsive } from "ahooks/lib/useResponsive";
import { IUseResponsiveResult } from "../definitions/types";

export default function useAppResponsive() {
  return useResponsive() as unknown as IUseResponsiveResult;
}
