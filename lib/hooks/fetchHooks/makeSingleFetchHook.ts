"use client";

import { AnyFn } from "@/lib/utils/types.ts";
import {
  fetchHookDefaultSetFn,
  makeFetchResourceHook,
  makeFetchSingleResourceFetchFn,
  singleResourceShouldFetchFn,
} from "../fetchHookUtils.tsx";
import { ResourceZustandStore } from "../makeResourceListStore.tsx";
import { FetchResourceZustandStore } from "./makeFetchResourceStoreHook.ts";
import {
  FetchSingleResourceFetchFnData,
  FetchSingleResourceData,
  GetFetchSingleResourceFetchFnOther,
  FetchSingleResourceReturnedData,
  FetchReturnedState,
} from "./types.ts";

export function makeSingleFetchHook<
  TResource extends { resourceId: string },
  Fn extends AnyFn<any, Promise<FetchSingleResourceFetchFnData<TResource>>>
>(
  useResourceListStore: ResourceZustandStore<TResource>,
  useFetchStore: FetchResourceZustandStore<
    FetchSingleResourceData<GetFetchSingleResourceFetchFnOther<Fn>>,
    FetchSingleResourceReturnedData<
      TResource,
      GetFetchSingleResourceFetchFnOther<Fn>
    >,
    any
  >,
  inputFetchFn: Fn,
  shouldLoadFn?: AnyFn<
    [
      boolean,
      FetchSingleResourceData<GetFetchSingleResourceFetchFnOther<Fn>>,
      (
        | FetchReturnedState<
            FetchSingleResourceReturnedData<
              TResource,
              GetFetchSingleResourceFetchFnOther<Fn>
            >
          >
        | undefined
      )
    ],
    boolean
  >
) {
  const fetchFn = makeFetchSingleResourceFetchFn(
    inputFetchFn,
    useResourceListStore
  );
  const useFetchHook = makeFetchResourceHook(
    fetchFn,
    useFetchStore,
    fetchHookDefaultSetFn,
    shouldLoadFn ?? singleResourceShouldFetchFn
  );

  return { useFetchHook, fetchFn };
}
