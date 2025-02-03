"use client";

import { useSession } from "next-auth/react";
import { IOAuthUser } from "../definitions/user.ts";

export function useOAuthSession() {
  const data = useSession();

  const user = data.data?.user as IOAuthUser | null;
  const userId = user?.id;
  const expires = data.data?.expires;

  return { userId, expires, user, status: data.status };
}
