import { isFunction, uniq } from "lodash";
import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware/devtools";
import { immer } from "zustand/middleware/immer";
import { systemConstants } from "../definitions/system";
import { AppError, toAppErrorList } from "../utils/errors";
import { AnyFn } from "../utils/types";
import { ResourceZustandStore } from "./makeResourceListStore";

/** Fetch resource store for storing fetch state. */
export type FetchResourceStoreWithoutFns<TData, TReturnedData, TGetFnParams> =
  Pick<
    FetchResourceStore<TData, TReturnedData, TGetFnParams>,
    "initialized" | "loading" | "error" | "data"
  >;

export type FetchResourceStore<TData, TReturnedData, TGetFnParams> = {
  loading: boolean;
  initialized: boolean;
  data?: TData;
  error?: AppError[];
  get(params: TGetFnParams): TReturnedData;
  clear(): void;
  set(
    state:
      | Partial<
          FetchResourceStoreWithoutFns<TData, TReturnedData, TGetFnParams>
        >
      | ((
          state: FetchResourceStoreWithoutFns<
            TData,
            TReturnedData,
            TGetFnParams
          >
        ) => Partial<
          FetchResourceStoreWithoutFns<TData, TReturnedData, TGetFnParams>
        >)
  ): void;
};

export type FetchHookOptions = {
  /** Don't fetch automatically if `true`. */
  manual?: boolean;
};

export function makeFetchResourceStoreHook<TData, TReturnedData, TGetFnParams>(
  getFn: AnyFn<[TData | undefined, TGetFnParams], TReturnedData>
) {
  const useFetchResourceStoreHook = create<
    FetchResourceStore<TData, TReturnedData, TGetFnParams>,
    [["zustand/immer", {}], ["zustand/devtools", {}]]
  >(
    immer(
      devtools((set, get) => ({
        data: undefined,
        loading: false,
        initialized: false,
        error: undefined,
        get(params) {
          const store = get();
          return getFn(store.data, params);
        },
        clear() {
          set((store) => {
            store.error = undefined;
            store.initialized = false;
            store.loading = false;
            store.data = undefined;
          });
        },
        set(state) {
          set((store) => {
            const pState = isFunction(state) ? state(store as any) : state;
            return { ...store, ...pState };
          });
        },
      }))
    )
  );

  return useFetchResourceStoreHook;
}

export type FetchResourceZustandStore<TData, TReturnedData, TGetFnParams> =
  ReturnType<
    typeof makeFetchResourceStoreHook<TData, TReturnedData, TGetFnParams>
  >;

/** Fetch hook defining general purpose fetch behaviour. */
export function makeFetchResourceHook<
  TData,
  TReturnedData,
  TGetFnParams,
  TFetchFn extends AnyFn<any, Promise<TData>>
>(
  inputFetchFn: TFetchFn,
  useStoreHook: FetchResourceZustandStore<TData, TReturnedData, TGetFnParams>,
  setFn: AnyFn<
    [
      FetchResourceStoreWithoutFns<TData, TReturnedData, TGetFnParams>,
      Partial<FetchResourceStoreWithoutFns<TData, TReturnedData, TGetFnParams>>,
      Parameters<TFetchFn>[0]
    ],
    Partial<FetchResourceStoreWithoutFns<TData, TReturnedData, TGetFnParams>>
  >,
  onMountFn?: AnyFn,
  onEndFn?: AnyFn
) {
  const fetchHook = (
    params: Parameters<TFetchFn>[0],
    options?: FetchHookOptions
  ) => {
    const store = useStoreHook();
    const fetchFn = React.useCallback(async () => {
      try {
        store.set({ loading: true, error: undefined });
        const result = await inputFetchFn(params);
        store.set((state) =>
          setFn(
            state,
            { loading: false, initialized: true, data: result },
            params
          )
        );
      } catch (error: unknown) {
        store.set({
          loading: false,
          initialized: true,
          error: toAppErrorList(error),
        });
      }
    }, [params]);

    React.useEffect(() => {
      if (
        !options?.manual &&
        !store.loading &&
        !store.initialized &&
        !store.error
      )
        fetchFn();
    }, [
      options?.manual,
      store.loading,
      store.initialized,
      store.error,
      fetchFn,
    ]);

    React.useEffect(() => {
      if (onMountFn) onMountFn();
      return onEndFn;
    }, [onMountFn, onEndFn]);

    return { store, fetchFn };
  };

  return fetchHook;
}

/** fetch hook defining behaviour for fetching a single resource. */
export type FetchSingleResourceData = { id: string };
export type FetchSingleResourceReturnedData<T extends { resourceId: string }> =
  { resource?: T };
export type FetchSingleResourceFetchFnData<T extends { resourceId: string }> = {
  resource: T;
};

export function makeFetchSingleResourceGetFn<T extends { resourceId: string }>(
  useResourceListStore: ResourceZustandStore<T>
) {
  const getFn = (
    data: FetchSingleResourceData | undefined
  ): FetchSingleResourceReturnedData<T> => {
    let resource: T | undefined = undefined;
    if (data) resource = useResourceListStore.getState().get(data.id);
    return { resource };
  };

  return getFn;
}

export function makeFetchSingleResourceFetchFn<
  T extends { resourceId: string },
  Fn extends AnyFn<any, Promise<FetchSingleResourceFetchFnData<T>>>
>(inputFetchFn: Fn, useResourceListStore: ResourceZustandStore<T>) {
  const fetchFn = async (
    ...params: Parameters<Fn>
  ): Promise<FetchSingleResourceData> => {
    const result = await inputFetchFn(...params);
    useResourceListStore
      .getState()
      .set(result.resource.resourceId, result.resource);
    return { id: result.resource.resourceId };
  };

  return fetchFn;
}

export function makeFetchSingleResourceOnMountFn<
  T extends { resourceId: string }
>(
  useResourceListStore: ResourceZustandStore<T>,
  useStoreHook: FetchResourceZustandStore<
    FetchSingleResourceData,
    FetchSingleResourceReturnedData<T>,
    undefined
  >
) {
  const onMountFn = () => {
    useResourceListStore.subscribe((state) => {
      const data = useStoreHook.getState().data;
      if (data && !state.items[data.id]) {
        useStoreHook.getState().clear();
      }
    });
  };

  return onMountFn;
}

/** Fetch hook defining behaviour for fetching paginated list. */
export type FetchPaginatedResourceListData = {
  idList: string[];
  count: number;
};
export type FetchPaginatedResourceListGetFnParams02 = {
  page?: number;
  pageSize?: number;
};
export type FetchPaginatedResourceListReturnedData<
  T extends { resourceId: string }
> = {
  resourceList: T[];
  count: number;
};
export type FetchPaginatedResourceListGetFn<T extends { resourceId: string }> =
  AnyFn<
    [FetchPaginatedResourceListData, FetchPaginatedResourceListGetFnParams02],
    FetchPaginatedResourceListReturnedData<T>
  >;

export function makeFetchPaginatedResourceListGetFn<
  T extends { resourceId: string }
>(useResourceListStore: ResourceZustandStore<T>) {
  const getFn = (
    data: FetchPaginatedResourceListData | undefined,
    params: FetchPaginatedResourceListGetFnParams02
  ): FetchPaginatedResourceListReturnedData<T> => {
    if (!data) return { resourceList: [], count: 0 };

    const page = params.page ?? 0;
    const pageSize = params.pageSize ?? systemConstants.maxPageSize;
    const pageIdList = data.idList.slice(
      page * pageSize,
      (page + 1) * pageSize
    );
    const items = useResourceListStore.getState().getList(pageIdList);
    return { resourceList: items, count: data.count };
  };

  return getFn;
}

export function makeFetchPaginatedResourceListFetchFn<
  T extends { resourceId: string },
  Fn extends AnyFn<
    Array<FetchPaginatedResourceListGetFnParams02>,
    Promise<FetchPaginatedResourceListReturnedData<T>>
  >
>(inputFetchFn: Fn, useResourceListStore: ResourceZustandStore<T>) {
  const fetchFn = async (
    ...params: Parameters<Fn>
  ): Promise<FetchPaginatedResourceListData> => {
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
    return { idList: pageFetchedIdList, count: result.count };
  };

  return fetchFn;
}

export function makeFetchPaginatedResourceListSetFn<
  T extends { resourceId: string }
>() {
  const setFn = (
    state: FetchResourceStoreWithoutFns<
      FetchPaginatedResourceListData,
      FetchPaginatedResourceListReturnedData<T>,
      FetchPaginatedResourceListGetFnParams02
    >,
    update: Partial<
      FetchResourceStoreWithoutFns<
        FetchPaginatedResourceListData,
        FetchPaginatedResourceListReturnedData<T>,
        FetchPaginatedResourceListGetFnParams02
      >
    >,
    params0: FetchPaginatedResourceListGetFnParams02
  ): Partial<
    FetchResourceStoreWithoutFns<
      FetchPaginatedResourceListData,
      FetchPaginatedResourceListReturnedData<T>,
      FetchPaginatedResourceListGetFnParams02
    >
  > => {
    if (!state.data || !update.data) return state;

    const presentIdList = state.data.idList;
    const page = params0.page ?? 0;
    const pageSize = params0.pageSize ?? systemConstants.maxPageSize;
    let newIdList = presentIdList
      .slice(0, page * pageSize)
      .concat(update.data.idList, presentIdList.slice(page * pageSize));
    newIdList = uniq(newIdList);

    return {
      ...state,
      ...update,
      data: { idList: newIdList, count: update.data.count },
    };
  };

  return setFn;
}

export function makeFetchPaginatedResourceListOnMountFn<
  T extends { resourceId: string }
>(
  useResourceListStore: ResourceZustandStore<T>,
  useStoreHook: FetchResourceZustandStore<
    FetchPaginatedResourceListData,
    FetchPaginatedResourceListReturnedData<T>,
    FetchPaginatedResourceListGetFnParams02
  >
) {
  const onMountFn = () => {
    useResourceListStore.subscribe((state) => {
      const data = useStoreHook.getState().data;
      if (data) {
        // TODO: use map instead because change can be additioon or update and
        // we don't want to run filter on every change. Another option is to
        // count the Object.values of currentState and prevState but that is not
        // conclusive cause an object could have been added and another removed
        const remainingIdList = data.idList.filter((id) => {
          return !!state.get(id);
        });
        const store = useStoreHook.getState();
        store.set({ data: { idList: remainingIdList, count: data.count - 1 } });
      }
    });
  };

  return onMountFn;
}

/** Fetch hook defining behaviour for fetching resource non-paginated list. */
export type FetchResourceListData = { idList: string[] };
export type FetchResourceListReturnedData<T extends { resourceId: string }> = {
  resourceList: T[];
};
export type FetchResourceListGetFn<T extends { resourceId: string }> = AnyFn<
  [FetchResourceListData],
  FetchResourceListReturnedData<T>
>;

export function makeFetchResourceListGetFn<T extends { resourceId: string }>(
  useResourceListStore: ResourceZustandStore<T>
) {
  const getFn = (
    data: FetchResourceListData | undefined
  ): FetchResourceListReturnedData<T> => {
    if (!data) return { resourceList: [] };
    const items = useResourceListStore.getState().getList(data.idList);
    return { resourceList: items };
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
    return { idList: pageFetchedIdList };
  };

  return fetchFn;
}

export function makeFetchResourceListOnMountFn<
  T extends { resourceId: string }
>(
  useResourceListStore: ResourceZustandStore<T>,
  useStoreHook: FetchResourceZustandStore<
    FetchResourceListData,
    FetchResourceListReturnedData<T>,
    undefined
  >
) {
  const onMountFn = () => {
    useResourceListStore.subscribe((state) => {
      const data = useStoreHook.getState().data;
      if (data) {
        // TODO: use map instead because change can be additioon or update and
        // we don't want to run filter on every change. Another option is to
        // count the Object.values of currentState and prevState but that is not
        // conclusive cause an object could have been added and another removed
        const remainingIdList = data.idList.filter((id) => {
          return !!state.get(id);
        });
        const store = useStoreHook.getState();
        store.set({ data: { idList: remainingIdList } });
      }
    });
  };

  return onMountFn;
}
