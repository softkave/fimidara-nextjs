"use client";

import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { StyleableComponentProps } from "../utils/styling/types";
import WebHeader from "../web/WebHeader";
import AppHeader from "./AppHeader.tsx";

export interface IFimidaraHeaderProps extends StyleableComponentProps {}

export default function FimidaraHeader(props: IFimidaraHeaderProps) {
  const { isLoggedIn } = useUserLoggedIn();

  if (isLoggedIn === undefined) {
    return null;
  }

  if (isLoggedIn) {
    return <AppHeader {...props} />;
  }

  return <WebHeader {...props} />;
}
