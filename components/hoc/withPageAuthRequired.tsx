import { useRouter } from "next/router";
import React, { ComponentType, useEffect } from "react";
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

export interface IWithPageAuthRequiredProps {
  [key: string]: any;
}

export type WithPageAuthRequired = <P extends IWithPageAuthRequiredProps>(
  Component: ComponentType<P & IUserLoginResult>,
  options?: WithPageAuthRequiredOptions
) => React.FC<P>;

const withPageAuthRequired: WithPageAuthRequired = (
  Component,
  options = {}
) => {
  return function withPageAuthRequired(props): React.ReactElement {
    const {
      // returnTo,
      onRedirecting = defaultOnRedirecting,
      onError = defaultOnError,
    } = options;

    const router = useRouter();
    const { data, error, isLoading } = useUser(options.swrConfig);

    useEffect(() => {
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
    }, [data, error, isLoading]);

    if (error) return onError(error);
    if (data) return <Component {...data} {...(props as any)} />;

    return onRedirecting();
  };
};

export default withPageAuthRequired;
