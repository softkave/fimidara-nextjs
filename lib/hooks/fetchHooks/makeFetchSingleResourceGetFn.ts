import { ResourceZustandStore } from "../makeResourceListStore.tsx";
import {
  FetchSingleResourceData,
  FetchSingleResourceReturnedData,
  FetchState,
} from "./types.ts";

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
