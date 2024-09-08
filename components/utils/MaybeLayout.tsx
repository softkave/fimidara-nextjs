"use client";

import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { AppLayout } from "./AppLayout.tsx";
import { WebLayout } from "./WebLayout.tsx";

export interface IMaybeLayoutProps {
  children?: React.ReactNode;
}

export const MaybeLayout = (props: IMaybeLayoutProps) => {
  const { children } = props;
  const { isLoggedIn } = useUserLoggedIn();

  if (isLoggedIn === undefined) {
    return null;
  }

  return isLoggedIn ? (
    <AppLayout>{children}</AppLayout>
  ) : (
    <WebLayout>{children}</WebLayout>
  );
};
