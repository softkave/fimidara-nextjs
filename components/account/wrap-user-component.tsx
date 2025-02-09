"use client";

import { kAppAccountPaths } from "@/lib/definitions/paths/account.ts";
import { kClientPaths } from "@/lib/definitions/paths/clientPath.ts";
import assert from "assert";
import { redirect, usePathname } from "next/navigation";
import { Fragment, useEffect } from "react";
import { IOAuthUser } from "../../lib/definitions/user.ts";
import { useOAuthSession } from "../../lib/hooks/session/useOAuthSession.ts";
import PageError from "../utils/page/PageError.tsx";
import PageLoading from "../utils/page/PageLoading.tsx";

interface IWrapUserComponentProps {
  render?: React.ReactNode | ((user: IOAuthUser) => React.ReactNode);
  children?: React.ReactNode;
}

export function WrapUserComponent({
  render,
  children,
}: IWrapUserComponentProps) {
  const { status, user } = useOAuthSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect(
        kClientPaths.withURL(kAppAccountPaths.loginWithReturnPath(pathname))
      );
    }
  }, [status, pathname]);

  if (status === "loading") {
    return <PageLoading />;
  } else if (status === "unauthenticated") {
    return <PageError message="Unauthorized. Redirecting..." />;
  }

  assert(user, "User is not authenticated");

  const content =
    children || (typeof render === "function" ? render(user) : render);

  return <Fragment>{content}</Fragment>;
}
