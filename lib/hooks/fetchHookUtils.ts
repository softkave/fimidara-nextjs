import { isEqual, isFunction, uniq } from "lodash";
import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware/devtools";
import { systemConstants } from "../definitions/system";
import { AppError, toAppErrorList } from "../utils/errors";
import { AnyFn } from "../utils/types";
import { ResourceZustandStore } from "./makeResourceListStore";

/** Fetch resource store for storing fetch state. */
export type FetchState<TData> = {
  loading: boolean;
  data: TData | undefined;
  error: AppError[] | undefined;
};
export type FetchReturnedState<TData> = {
  loading: boolean;
  data: TData;
  error: AppError[] | undefined;
};

export type FetchResourceStore<TData, TReturnedData, TKeyParams> = {
  states: Array<[TKeyParams, FetchState<TData>]>;
  clear(params?: TKeyParams): void;
  getFetchState(
    params: TKeyParams
  ): FetchReturnedState<TReturnedData> | undefined;
  setFetchState(
    params: TKeyParams,
    state: (state: FetchState<TData> | undefined) => FetchState<TData>
  ): void;
};

export type FetchHookOptions = {
  /** Don't fetch automatically if `true`. */
  manual?: boolean;
};

export function makeFetchResourceStoreHook<TData, TReturnedData, TKeyParams>(
  getFn: AnyFn<[TKeyParams, FetchState<TData>], TReturnedData>,
  comparisonFn: AnyFn<[TKeyParams, TKeyParams], boolean> = isEqual
) {
  return create<
    FetchResourceStore<TData, TReturnedData, TKeyParams>,
    [["zustand/devtools", {}]]
  >(
    devtools((set, get) => ({
      states: [] as Array<[TKeyParams, FetchState<TData>]>,
      getFetchState(params) {
        const store = get();
        const entry = store.states.find(([entryParams]) =>
          comparisonFn(params, entryParams)
        );
        return entry
          ? {
              loading: entry[1].loading,
              error: entry[1].error,
              data: getFn(params, entry[1]),
            }
          : undefined;
      },

      clear(params) {
        set((store) => {
          if (params) {
            const states = store.states.filter(([entryParams]) =>
              comparisonFn(params, entryParams)
            );
            return { states };
          } else {
            return { states: [] };
          }
        });
      },

      setFetchState(params, update) {
        set((store) => {
          const index = store.states.findIndex(([entryParams]) =>
            comparisonFn(params, entryParams)
          );
          const states = [...store.states];
          const entryData = isFunction(update)
            ? update(index >= 0 ? states[index][1] : undefined)
            : update;

          if (index !== -1) {
            states[index] = [params, entryData];
          } else {
            store.states = [...store.states, [params, entryData]];
          }

          return { states };
        });
      },
    }))
  );
}

export type FetchResourceZustandStore<TData, TReturnedData, TKeyParams> =
  ReturnType<
    typeof makeFetchResourceStoreHook<TData, TReturnedData, TKeyParams>
  >;

/** Fetch hook defining general purpose fetch behaviour. */
export function makeFetchResourceHook<
  TData,
  TReturnedData,
  TFetchFn extends AnyFn<any, Promise<TData>>
>(
  inputFetchFn: TFetchFn,
  useStoreHook: FetchResourceZustandStore<
    TData,
    TReturnedData,
    Parameters<TFetchFn>[0]
  >,
  setFn: AnyFn<
    [Parameters<TFetchFn>[0], FetchState<TData> | undefined, TData],
    TData
  >,
  shouldLoadFn?: AnyFn<
    [boolean, FetchReturnedState<TReturnedData> | undefined],
    boolean
  >
) {
  const fetchHook = (
    params: Parameters<TFetchFn>[0],
    options?: FetchHookOptions
  ) => {
    const fetchState = useStoreHook((store) => store.getFetchState(params));
    const fetchFn = React.useCallback(async () => {
      try {
        useStoreHook.getState().setFetchState(params, (state) => ({
          loading: true,
          error: undefined,
          data: state?.data,
        }));
        const result = await inputFetchFn(params);
        useStoreHook.getState().setFetchState(params, (state) => ({
          data: setFn(params, state, result),
          loading: false,
          error: undefined,
        }));
      } catch (error: unknown) {
        useStoreHook.getState().setFetchState(params, (state) => ({
          loading: false,
          error: toAppErrorList(error),
          data: state?.data,
        }));
      }
    }, [params]);

    let willLoad =
      !options?.manual &&
      !fetchState?.loading &&
      !fetchState?.error &&
      !fetchState?.data;

    if (shouldLoadFn) willLoad = shouldLoadFn(willLoad, fetchState);

    React.useEffect(() => {
      if (willLoad) fetchFn();
    }, [willLoad, fetchFn]);

    return { fetchState, fetchFn };
  };

  return fetchHook;
}

/** fetch hook defining behaviour for fetching a single resource. */
export type FetchSingleResourceData<TOther = any> = {
  id: string;
  initialized: boolean;
  other?: TOther;
};
export type FetchSingleResourceReturnedData<
  T extends { resourceId: string },
  TOther = any
> = { resource?: T; other?: TOther; initialized: boolean };
export type FetchSingleResourceFetchFnData<
  T extends { resourceId: string },
  TOther = any
> = {
  resource: T;
  other?: TOther;
};
export type GetFetchSingleResourceFetchFnOther<TFn> = TFn extends AnyFn<
  any,
  Promise<FetchSingleResourceFetchFnData<any, infer TOther>>
>
  ? TOther
  : any;

export function makeFetchSingleResourceGetFn<
  T extends { resourceId: string },
  TOther = any,
  TKeyParams = any
>(useResourceListStore: ResourceZustandStore<T>) {
  const getFn = (
    params: TKeyParams,
    state: FetchState<FetchSingleResourceData> | undefined
  ): FetchSingleResourceReturnedData<T, TOther> => {
    if (!state?.data) {
      return {
        resource: undefined,
        other: undefined,
        initialized: false,
      };
    }

    const resource = useResourceListStore.getState().get(state.data.id);
    return {
      resource,
      other: state?.data?.other,
      initialized: state?.data?.initialized ?? false,
    };
  };

  return getFn;
}

export function makeFetchSingleResourceFetchFn<
  T extends { resourceId: string },
  Fn extends AnyFn<any, Promise<FetchSingleResourceFetchFnData<T>>>
>(inputFetchFn: Fn, useResourceListStore: ResourceZustandStore<T>) {
  const fetchFn = async (
    ...params: Parameters<Fn>
  ): Promise<
    FetchSingleResourceData<GetFetchSingleResourceFetchFnOther<Fn>>
  > => {
    const result = await inputFetchFn(...params);
    useResourceListStore
      .getState()
      .set(result.resource.resourceId, result.resource);
    return {
      id: result.resource.resourceId,
      other: result.other,
      initialized: true,
    };
  };

  return fetchFn;
}

export function singleResourceShouldFetchFn(
  willLoad: boolean,
  fetchState:
    | FetchReturnedState<FetchSingleResourceReturnedData<any>>
    | undefined
) {
  return willLoad || !fetchState?.data.resource;
}

/** Fetch hook defining behaviour for fetching paginated list. */
export type FetchPaginatedResourceListData<TOther = any> = {
  idList: string[];
  count: number;
  initialized: boolean;
  other?: TOther;
};
export type FetchPaginatedResourceListKeyParams = {
  page?: number;
  pageSize?: number;
};
export type FetchPaginatedResourceListReturnedData<
  T extends { resourceId: string },
  TOther = any
> = {
  resourceList: T[];
  count: number;
  other?: TOther;
};

export function makeFetchPaginatedResourceListGetFn<
  T extends { resourceId: string },
  TOther = any
>(useResourceListStore: ResourceZustandStore<T>) {
  const getFn = (
    params: FetchPaginatedResourceListKeyParams,
    state: FetchState<FetchPaginatedResourceListData> | undefined
  ): FetchPaginatedResourceListReturnedData<T, TOther> => {
    if (!state?.data) return { resourceList: [], count: 0 };

    const page = params.page ?? 0;
    const pageSize = params.pageSize ?? systemConstants.maxPageSize;
    const pageIdList = state.data.idList.slice(
      page * pageSize,
      (page + 1) * pageSize
    );
    const items = useResourceListStore.getState().getList(pageIdList);
    return {
      resourceList: items,
      count: state.data.count,
      other: state.data.other,
    };
  };

  return getFn;
}

export function makeFetchPaginatedResourceListFetchFn<
  T extends { resourceId: string },
  Fn extends AnyFn<
    Array<FetchPaginatedResourceListKeyParams>,
    Promise<FetchPaginatedResourceListReturnedData<T>>
  >
>(
  inputFetchFn: Fn,
  useResourceListStore: ResourceZustandStore<T>,
  getKey: (item: T) => string = (item) => item.resourceId
) {
  const fetchFn = async (
    ...params: Parameters<Fn>
  ): Promise<FetchPaginatedResourceListData> => {
    const result = await inputFetchFn(...params);
    const resourceList = result.resourceList;
    const pageFetchedIdList: string[] = [];
    useResourceListStore.getState().setList(
      resourceList.map((nextResource) => {
        const id = getKey(nextResource);
        pageFetchedIdList.push(id);
        return [id, nextResource];
      })
    );
    return {
      idList: pageFetchedIdList,
      count: result.count,
      other: result.other,
      initialized: true,
    };
  };

  return fetchFn;
}

export function makeFetchPaginatedResourceListSetFn() {
  const setFn = (
    params0: FetchPaginatedResourceListKeyParams,
    state: FetchState<FetchPaginatedResourceListData> | undefined,
    update: FetchPaginatedResourceListData
  ): FetchPaginatedResourceListData => {
    if (!state || !state.data) return update;

    const presentIdList = state.data.idList;
    const page = params0.page ?? 0;
    const pageSize = params0.pageSize ?? systemConstants.maxPageSize;
    let newIdList = presentIdList
      .slice(0, page * pageSize)
      .concat(update.idList, presentIdList.slice(page * pageSize));
    newIdList = uniq(newIdList);

    return {
      idList: newIdList,
      count: update.count,
      initialized: update.initialized,
    };
  };

  return setFn;
}

/** Fetch hook defining behaviour for fetching resource non-paginated list. */
export type FetchResourceListData<TOther = any> = {
  idList: string[];
  initialized: boolean;
  other?: TOther;
};
export type FetchResourceListReturnedData<
  T extends { resourceId: string },
  TOther = any
> = {
  resourceList: T[];
  initialized: boolean;
  other?: TOther;
};
export type FetchResourceListGetFn<T extends { resourceId: string }> = AnyFn<
  [FetchResourceListData],
  FetchResourceListReturnedData<T>
>;

export function makeFetchResourceListGetFn<
  T extends { resourceId: string },
  TOther = any
>(useResourceListStore: ResourceZustandStore<T>) {
  const getFn = (
    params: any,
    state: FetchState<FetchResourceListData> | undefined
  ): FetchResourceListReturnedData<T, TOther> => {
    if (!state?.data) return { resourceList: [], initialized: false };
    const items = useResourceListStore.getState().getList(state.data.idList);
    const initialized = !!items.length || state.loading || !!state.error;
    return { initialized, resourceList: items, other: state.data.other };
  };

  return getFn;
}

export function makeFetchResourceListFetchFn<
  T extends { resourceId: string },
  Fn extends AnyFn<any, Promise<FetchResourceListReturnedData<T>>>
>(inputFetchFn: Fn, useResourceListStore: ResourceZustandStore<T>) {
  const fetchFn = async (
    ...params: Parameters<Fn>
  ): Promise<FetchResourceListData> => {
    const result = await inputFetchFn(...params);
    const resourceList = result.resourceList;
    const pageFetchedIdList: string[] = [];
    useResourceListStore.getState().setList(
      resourceList.map((nextResource) => {
        const id = nextResource.resourceId;
        pageFetchedIdList.push(id);
        return [id, nextResource];
      })
    );
    return {
      idList: pageFetchedIdList,
      other: result.other,
      initialized: true,
    };
  };

  return fetchFn;
}

export function removeIdFromIdListOnDeleteResources<
  T extends { resourceId: string }
>(
  useResourceListStore: ResourceZustandStore<T>,
  useStoreHook: FetchResourceZustandStore<
    { idList: string[]; count: number },
    any,
    any
  >
) {
  useResourceListStore.subscribe((state) => {
    // TODO: use map instead because change can be additioon or update and
    // we don't want to run filter on every change. Another option is to
    // count the Object.values of currentState and prevState but that is not
    // conclusive cause an object could have been added and another removed
    const states = useStoreHook
      .getState()
      .states.map(([params, fetchState]) => {
        if (!fetchState.data) return [params, fetchState];
        const remainingIdList = fetchState.data.idList.filter((id) => {
          return !!state.get(id);
        });
        return [
          params,
          {
            ...fetchState.data,
            idList: remainingIdList,
            count: remainingIdList.length,
          },
        ];
      });

    useStoreHook.setState({ states: states as any });
  });
}

export function useFetchSingleResourceFetchState<
  T extends FetchSingleResourceReturnedData<any>
>(fetchState?: FetchReturnedState<T>) {
  const error = fetchState?.error;
  const isLoading = fetchState?.loading || !fetchState;
  const { resource, other, initialized } = (fetchState?.data ??
    {}) as Partial<T>;
  return { isLoading, error, resource, other, initialized };
}

export function useFetchPaginatedResourceListFetchState<
  T extends FetchPaginatedResourceListReturnedData<any>
>(fetchState?: FetchReturnedState<T>) {
  const error = fetchState?.error;
  const isLoading = fetchState?.loading || !fetchState;
  const { resourceList, other, count } = (fetchState?.data ?? {}) as Partial<T>;
  return {
    isLoading,
    error,
    other,
    count: count ?? 0,
    resourceList: resourceList ?? [],
  };
}

export function useFetchArbitraryFetchState<T>(
  fetchState?: FetchReturnedState<T>
) {
  const error = fetchState?.error;
  const isLoading = fetchState?.loading || !fetchState;
  return {
    isLoading,
    error,
    data: fetchState?.data,
  };
}
