"use client";

import { AnyFn } from "softkave-js-utils";
import { makeFetchSingleResourceGetFn } from "../fetchHooks/makeFetchSingleResourceGetFn.ts";
import {
  FetchSingleResourceData,
  FetchSingleResourceReturnedData,
} from "../fetchHooks/types.ts";
import { ResourceZustandStore } from "../makeResourceListStore.tsx";
import { makeFetchResourceStoreHook } from "../fetchHooks/makeFetchResourceStoreHook.ts";

export function makeSingleFetchStore<
  TResource extends { resourceId: string },
  TOther = any
>(
  storeName: string,
  useResourceListStore: ResourceZustandStore<TResource>,
  comparisonFn?: AnyFn<[any, any], boolean>
) {
  const getFn = makeFetchSingleResourceGetFn<TResource, TOther>(
    useResourceListStore
  );
  const useFetchStore = makeFetchResourceStoreHook<
    FetchSingleResourceData<TOther>,
    FetchSingleResourceReturnedData<TResource, TOther>,
    any
  >(storeName, getFn, comparisonFn);

  return { useFetchStore, getFn };
}
