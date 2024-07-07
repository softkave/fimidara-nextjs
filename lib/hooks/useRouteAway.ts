import { isFunction } from "lodash-es";
import { useRouter } from "next/router";
import React from "react";

export default function useRouteAway(
  to: string,
  condition?: (() => boolean) | boolean
) {
  const router = useRouter();
  React.useEffect(() => {
    const routeAway = isFunction(condition) ? condition() : !!condition;
    if (routeAway) {
      router.push(to);
    }
  }, [condition, to, router]);
}
