"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useSetCookie } from "../../api/account/index.ts";
import { IOAuthUser } from "../../definitions/user.ts";

export function useOAuthSession() {
  const data = useSession();
  const setCookieHook = useSetCookie();
  const setCookieHookTrigger = useRef<typeof setCookieHook.trigger>(
    setCookieHook.trigger.bind(setCookieHook)
  );

  const user = data.data?.user as IOAuthUser | null;
  const expires = data.data?.expires;

  useEffect(() => {
    if (user?.jwtToken) {
      setCookieHookTrigger.current({
        jwtToken: user.jwtToken,
        userId: user.user.resourceId,
      });
    }
  }, [user?.jwtToken, user?.user.resourceId]);

  return { expires, user, status: data.status };
}
