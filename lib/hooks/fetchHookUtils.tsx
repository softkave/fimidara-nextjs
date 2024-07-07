import { isEqual, isFunction, uniq } from "lodash-es";
import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { systemConstants } from "../definitions/system";
import { AppError, toAppErrorList } from "../utils/errors";
import { calculatePageSize } from "../utils/fns";
import { AnyFn } from "../utils/types";
import { ResourceZustandStore } from "./makeResourceListStore";
import { useHandleServerRecommendedActions } from "./useHandleServerRecommendedActions";

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
    state: (state: FetchState<TData> | undefined) => FetchState<TData>,
    initialize?: boolean
  ): void;
  findFetchState(
    fn: AnyFn<[TKeyParams, FetchState<TData>], boolean>
  ): [TKeyParams, FetchState<TData>] | undefined;
  mapFetchState(
    fn: AnyFn<[TKeyParams, FetchState<TData>], FetchState<TData>>
  ): void;
};

export function makeFetchResourceStoreHook<TData, TReturnedData, TKeyParams>(
  storeName: string,
  getFn: AnyFn<[TKeyParams, FetchState<TData>], TReturnedData>,
  comparisonFn: AnyFn<[TKeyParams, TKeyParams], boolean> = isEqual
) {
  return create<
    FetchResourceStore<TData, TReturnedData, TKeyParams>,
    [["zustand/devtools", {}]]
  >(
    devtools(
      (set, get) => ({
        states: [] as Array<[TKeyParams, FetchState<TData>]>,
        getFetchState(params) {
          const store = get();
          const entry = store.states.find(([entryParams]) =>
            comparisonFn(params, entryParams)
          );

          if (entry) {
            const fetchState = entry[1];
            const data = getFn(params, fetchState);

            return {
              data,
              error: fetchState.error,
              loading: fetchState.loading,
            };
          }

          return undefined;
        },

        clear(params) {
          set((store) => {
            if (params) {
              const states = store.states.filter(([entryParams]) => {
                const matched = comparisonFn(params, entryParams);
                return !matched;
              });
              return { states };
            } else {
              return { states: [] };
            }
          });
        },

        setFetchState(params, update, initialize = true) {
          set((store) => {
            const index = store.states.findIndex(([entryParams]) =>
              comparisonFn(params, entryParams)
            );
            let states = [...store.states];
            const entryData = isFunction(update)
              ? update(index >= 0 ? states[index][1] : undefined)
              : update;

            if (index !== -1) {
              states[index] = [params, entryData];
            } else if (initialize) {
              states.push([params, entryData]);
            }

            return { states };
          });
        },

        findFetchState(fn) {
          return this.states.find(([params, state]) => fn(params, state));
        },

        mapFetchState(fn) {
          set((store) => {
            const states: Array<[TKeyParams, FetchState<TData>]> =
              store.states.map(([params, fetchState]) => [
                params,
                fn(params, fetchState),
              ]);
            return { states };
          });
        },
      }),
      { name: storeName }
    )
  );
}

type MakeFetchResourceStoreHookFn<TData, TReturnedData, TKeyParams> =
  typeof makeFetchResourceStoreHook<TData, TReturnedData, TKeyParams>;
export type FetchResourceZustandStore<TData, TReturnedData, TKeyParams> =
  ReturnType<MakeFetchResourceStoreHookFn<TData, TReturnedData, TKeyParams>>;

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
  setFn?: AnyFn<
    [Parameters<TFetchFn>[0], FetchState<TData> | undefined, TData],
    TData
  >,
  shouldLoadFn?: AnyFn<
    [
      boolean,
      Parameters<TFetchFn>[0],
      FetchReturnedState<TReturnedData> | undefined
    ],
    boolean
  >
) {
  const useFetchHook = (params: Parameters<TFetchFn>[0]) => {
    const { handleServerRecommendedActions } =
      useHandleServerRecommendedActions();

    let fetchState = useStoreHook((store) => store.getFetchState(params));

    const fetchFn = React.useCallback(
      async (inputParams: Parameters<TFetchFn>[0]) => {
        try {
          useStoreHook.getState().setFetchState(inputParams, (state) => ({
            loading: true,
            error: undefined,
            data: state?.data,
          }));

          const result = await inputFetchFn(inputParams);

          useStoreHook.getState().setFetchState(inputParams, (state) => {
            const savedData = setFn
              ? setFn(inputParams, state, result)
              : result;

            return { data: savedData, loading: false, error: undefined };
          });
        } catch (error: unknown) {
          useStoreHook.getState().setFetchState(inputParams, (state) => ({
            loading: false,
            error: toAppErrorList(error),
            data: state?.data,
          }));

          handleServerRecommendedActions(error);
        }
      },
      []
    );

    const clearFetchState = React.useCallback(() => {
      useStoreHook.getState().clear(params);
    }, [params]);

    React.useEffect(() => {
      // Get latest fetch state seeing more than one component can call the
      // fetch hook with the same params at a time leading to 2 different load
      // states which is not too bad. The issue is error handling with message
      // or notifications are showed twice which is not good UX.
      const currentFetchState = useStoreHook.getState().getFetchState(params);
      let shouldLoad =
        !currentFetchState ||
        (!currentFetchState?.loading &&
          !currentFetchState?.error &&
          !currentFetchState?.data);

      // TODO: should this be in a memo?
      if (shouldLoadFn) {
        shouldLoad = shouldLoadFn(shouldLoad, params, currentFetchState);
      }

      if (shouldLoad) {
        fetchFn(params);
      }
    }, [params, fetchFn]);

    return { fetchState, fetchFn, clearFetchState };
  };

  return useFetchHook;
}

export function makeManualFetchResourceHook<
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
  setFn?: AnyFn<
    [Parameters<TFetchFn>[0], FetchState<TData> | undefined, TData],
    TData
  >
) {
  const useFetchHook = () => {
    const { handleServerRecommendedActions } =
      useHandleServerRecommendedActions();

    const fetchFn = React.useCallback(
      async (inputParams: Parameters<TFetchFn>[0]) => {
        try {
          useStoreHook.getState().setFetchState(inputParams, (state) => ({
            loading: true,
            error: undefined,
            data: state?.data,
          }));
          const result = await inputFetchFn(inputParams);
          useStoreHook.getState().setFetchState(inputParams, (state) => {
            const savedData = setFn
              ? setFn(inputParams, state, result)
              : result;
            return { data: savedData, loading: false, error: undefined };
          });
        } catch (error: unknown) {
          useStoreHook.getState().setFetchState(inputParams, (state) => ({
            loading: false,
            error: toAppErrorList(error),
            data: state?.data,
          }));

          handleServerRecommendedActions(error);
        }
      },
      []
    );

    const getFetchStateFn = React.useCallback(
      async (inputParams: Parameters<TFetchFn>[0]) => {
        return useStoreHook.getState().getFetchState(inputParams);
      },
      []
    );

    return { fetchFn, getFetchStateFn };
  };

  return useFetchHook;
}

export function fetchHookDefaultSetFn(
  params: any,
  fetchState: FetchState<any> | undefined,
  data: any
) {
  return data;
}

/** fetch hook defining behaviour for fetching a single resource. */
export type FetchSingleResourceData<TOther = any> = {
  id: string;
  other?: TOther;
};
export type FetchSingleResourceReturnedData<
  T extends { resourceId: string },
  TOther = any
> = { resource?: T; other?: TOther };
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
      return { resource: undefined, other: undefined };
    }

    const resource = useResourceListStore.getState().get(state.data.id);
    return { resource, other: state?.data?.other };
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
    return { id: result.resource.resourceId, other: result.other };
  };

  return fetchFn;
}

export function singleResourceShouldFetchFn(
  willLoad: boolean,
  params: any,
  fetchState:
    | FetchReturnedState<FetchSingleResourceReturnedData<any>>
    | undefined
) {
  return (
    willLoad ||
    (!fetchState?.loading && !fetchState?.data.resource && !fetchState?.error)
  );
}

/** Fetch hook defining behaviour for fetching paginated list. */
export type FetchPaginatedResourceListData<TOther = any> = {
  idList: string[];
  count: number;
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

export type GetFetchPaginatedResourceListFetchFnOther<TFn> = TFn extends AnyFn<
  any,
  Promise<FetchPaginatedResourceListReturnedData<any, infer TOther>>
>
  ? TOther
  : any;

export function makeFetchPaginatedResourceListGetFn<
  T extends { resourceId: string },
  TOther = any
>(useResourceListStore: ResourceZustandStore<T>) {
  const getFn = (
    params: FetchPaginatedResourceListKeyParams,
    state: FetchState<FetchPaginatedResourceListData> | undefined
  ): FetchPaginatedResourceListReturnedData<T, TOther> => {
    if (!state?.data) {
      return { resourceList: [], count: 0 };
    }

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
  getIdFromResource: (item: T) => string = (item) => item.resourceId
) {
  const fetchFn = async (
    ...params: Parameters<Fn>
  ): Promise<FetchPaginatedResourceListData> => {
    const result = await inputFetchFn(...params);

    const resourceList = result.resourceList;
    const pageFetchedIdList: string[] = [];
    useResourceListStore.getState().setList(
      resourceList.map((nextResource) => {
        const id = getIdFromResource(nextResource);
        pageFetchedIdList.push(id);
        return [id, nextResource];
      })
    );

    return {
      idList: pageFetchedIdList,
      count: result.count,
      other: result.other,
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

    return { idList: newIdList, count: update.count };
  };

  return setFn;
}

export function paginatedResourceListShouldFetchFn(
  shouldLoad: boolean,
  params: FetchPaginatedResourceListKeyParams,
  fetchState:
    | FetchReturnedState<FetchPaginatedResourceListReturnedData<any>>
    | undefined
) {
  if (shouldLoad) {
    return true;
  }

  if (
    fetchState?.data &&
    params.pageSize &&
    params.page &&
    !fetchState.error &&
    !fetchState.loading
  ) {
    const expectedPageSize = calculatePageSize(
      fetchState.data.count,
      params.pageSize,
      params.page
    );

    if (fetchState.data.resourceList.length < expectedPageSize) {
      return true;
    }
  }

  return false;
}

/** Fetch hook defining behaviour for fetching resource non-paginated list. */
export type FetchResourceListData<TOther = any> = {
  idList: string[];
  other?: TOther;
};
export type FetchResourceListReturnedData<
  T extends { resourceId: string },
  TOther = any
> = {
  resourceList: T[];
  other?: TOther;
};
export type FetchResourceListGetFn<T extends { resourceId: string }> = AnyFn<
  [FetchResourceListData],
  FetchResourceListReturnedData<T>
>;
export type GetFetchResourceListFetchFnOther<TFn> = TFn extends AnyFn<
  any,
  Promise<FetchResourceListReturnedData<any, infer TOther>>
>
  ? TOther
  : any;

export function makeFetchResourceListGetFn<
  T extends { resourceId: string },
  TOther = any
>(useResourceListStore: ResourceZustandStore<T>) {
  const getFn = (
    params: any,
    state: FetchState<FetchResourceListData> | undefined
  ): FetchResourceListReturnedData<T, TOther> => {
    if (!state?.data) return { resourceList: [] };
    const items = useResourceListStore.getState().getList(state.data.idList);
    return { resourceList: items, other: state.data.other };
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
    return { idList: pageFetchedIdList, other: result.other };
  };

  return fetchFn;
}

export function subscribeAndRemoveIdOnDeleteResources<
  T extends { resourceId: string }
>(
  useResourceListStore: ResourceZustandStore<T>,
  useStoreHook: FetchResourceZustandStore<
    { idList: string[]; count?: number },
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

        if (remainingIdList.length === fetchState.data.idList.length) {
          return [params, fetchState];
        }

        return [
          params,
          {
            ...fetchState,
            data: {
              ...fetchState.data,
              idList: remainingIdList,
              count: remainingIdList.length,
            },
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
  const { resource, other } = (fetchState?.data ?? {}) as Partial<T>;

  return { isLoading, error, resource, other };
}

export function useFetchPaginatedResourceListFetchState<
  T extends FetchPaginatedResourceListReturnedData<any>
>(fetchState?: FetchReturnedState<T>) {
  const error = fetchState?.error;
  const isLoading = fetchState?.loading || !fetchState;
  const { resourceList, other, count } = (fetchState?.data ?? {}) as Partial<T>;

  return {
    error,
    other,
    isLoading,
    count: count ?? 0,
    resourceList: resourceList ?? ([] as T["resourceList"]),
    isDataFetched: !!resourceList,
  };
}

export function useFetchNonPaginatedResourceListFetchState<
  T extends FetchResourceListReturnedData<any>
>(fetchState?: FetchReturnedState<T>) {
  const error = fetchState?.error;
  const isLoading = fetchState?.loading || !fetchState;
  const { resourceList, other } = (fetchState?.data ?? {}) as Partial<T>;

  return {
    error,
    other,
    isLoading,
    resourceList: resourceList ?? ([] as T["resourceList"]),
    isDataFetched: !!resourceList,
  };
}

export function useFetchArbitraryFetchState<T>(
  fetchState?: FetchReturnedState<T>
) {
  const error = fetchState?.error;
  const isLoading = fetchState?.loading || !fetchState;

  return { isLoading, error, data: fetchState?.data };
}
