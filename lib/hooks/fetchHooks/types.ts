import { AppError } from "@/lib/utils/errors.ts";
import { AnyFn } from "softkave-js-utils";

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
