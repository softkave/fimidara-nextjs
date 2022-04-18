import { useRouter } from "next/router";
import React from "react";
import { SWRConfiguration } from "swr";
import { IUserLoginResult } from "../../lib/api/endpoints/user";
import { appAccountPaths } from "../../lib/definitions/system";
import useUser from "../../lib/hooks/useUser";

const defaultOnRedirecting = (): React.ReactElement => <></>;
const defaultOnError = (): React.ReactElement => <></>;

export interface WithPageAuthRequiredOptions {
  returnTo?: string;
  onRedirecting?: () => React.ReactElement;
  onError?: (error: Error) => React.ReactElement;
  swrConfig?: SWRConfiguration;
}

const withPageAuthRequired = <P extends object>(
  Component: React.ComponentType<P & IUserLoginResult>,
  options: WithPageAuthRequiredOptions = {}
) => {
  const withPageAuthRequired: React.FC<P> = (props) => {
    const {
      // returnTo,
      onRedirecting = defaultOnRedirecting,
      onError = defaultOnError,
    } = options;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error, isLoading } = useUser(options.swrConfig);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if ((data && !error) || isLoading) return;

      // TODO: support returnTo

      // if (!returnTo) {
      //   router.push(appAccountPaths.login);
      // } else {
      //   router.push(
      //     `${appAccountPaths.login}?returnTo=${encodeURIComponent(returnTo)}`
      //   );
      // }

      router.push(appAccountPaths.login);
    }, [data, error, isLoading, router]);

    if (error) return onError(error);
    if (data) return <Component {...data} {...(props as any)} />;

    return onRedirecting();
  };

  return withPageAuthRequired;
};

export default withPageAuthRequired;
