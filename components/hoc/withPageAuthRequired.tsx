import { useRouter } from "next/router";
import React from "react";
import { appAccountPaths } from "../../lib/definitions/system";
import useUserLoggedIn from "../../lib/hooks/useUserLoggedIn";

const defaultOnRedirecting = (): React.ReactElement => <></>;

export interface WithPageAuthRequiredOptions {
  returnTo?: string;
  onRedirecting?: () => React.ReactElement;
}

const withPageAuthRequired = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithPageAuthRequiredOptions = {}
) => {
  const withPageAuthRequired: React.FC<P> = (props) => {
    const { returnTo, onRedirecting = defaultOnRedirecting } = options;
    const router = useRouter();
    const isLoggedIn = useUserLoggedIn();
    React.useEffect(() => {
      if (isLoggedIn) return;
      if (!returnTo) {
        router.push(appAccountPaths.login);
      } else {
        router.push(appAccountPaths.loginWithReturnPath(returnTo));
      }
    }, [isLoggedIn, router]);

    if (isLoggedIn) return <Component {...(props as any)} />;
    return onRedirecting();
  };

  return withPageAuthRequired;
};

export default withPageAuthRequired;
