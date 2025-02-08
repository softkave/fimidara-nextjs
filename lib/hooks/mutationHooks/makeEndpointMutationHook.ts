import { useRequest } from "ahooks";
import type { Options as UseRequestOptions } from "ahooks/lib/useRequest/src/types";
import { compact, over } from "lodash-es";
import React from "react";
import { AnyFn } from "softkave-js-utils";
import { useHandleServerRecommendedActions } from "../useHandleServerRecommendedActions.tsx";

type GetEndpointFn<TEndpoints, TFn> = TFn extends AnyFn<
  [TEndpoints],
  infer TEndpointFn
>
  ? TEndpointFn
  : never;

export function makeEndpointMutationHook<
  TEndpoints,
  TFn extends AnyFn<[TEndpoints], AnyFn>,
  TData = Awaited<ReturnType<GetEndpointFn<TEndpoints, TFn>>>,
  TParams extends any[] = Parameters<GetEndpointFn<TEndpoints, TFn>>
>(
  getEndpoints: AnyFn<[], TEndpoints>,
  getFn: TFn,
  baseOnSuccess?: AnyFn<[TData, TParams]>,
  baseOnError?: AnyFn<[Error, TParams]>
) {
  return function (requestOptions?: UseRequestOptions<TData, TParams>) {
    const { handleServerRecommendedActions } =
      useHandleServerRecommendedActions();
    const mutationFn = React.useCallback(
      async (...data: TParams): Promise<TData> => {
        const endpoints = getEndpoints();
        const fn = getFn(endpoints);
        const result = await fn(...data);
        return result;
      },
      []
    );
    const onSuccessFn = (data: TData, params: TParams) => {
      const fn = over(compact([baseOnSuccess, requestOptions?.onSuccess]));
      fn(data, params);
    };
    const onErrorFn = (e: Error, params: TParams) => {
      const fn = over(
        compact([
          baseOnError,
          requestOptions?.onError,
          handleServerRecommendedActions,
        ])
      );
      fn(e, params);
    };

    const request = useRequest(mutationFn, {
      manual: true,
      ...requestOptions,
      onSuccess: onSuccessFn,
      onError: onErrorFn,
    });

    return request;
  };
}
