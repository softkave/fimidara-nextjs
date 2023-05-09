import { User } from "fimidara";
import { AnyFn } from "../utils/types";
import {
  FetchSingleResourceData,
  FetchSingleResourceReturnedData,
  makeFetchResourceStoreHook,
  makeFetchSingleResourceGetFn,
} from "./fetchHookUtils";
import { ResourceZustandStore } from "./makeResourceListStore";
import {
  useUserCollaborationRequestsStore,
  useUsersStore,
  useWorkspaceAgentTokensStore,
  useWorkspaceCollaborationRequestsStore,
  useWorkspaceCollaboratorsStore,
  useWorkspaceFilesStore,
  useWorkspaceFoldersStore,
  useWorkspacePermissionGroupsStore,
  useWorkspacesStore,
} from "./resourceListStores";

function makeSingleFetchStore<
  TResource extends { resourceId: string },
  TOther = any
>(
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
  >(getFn);

  return { useFetchStore, getFn };
}

export type UserSessionFetchStoreOther = {
  userToken: string;
  clientToken: string;
};

export const { useFetchStore: useUserWorkspaceFetchStore } =
  makeSingleFetchStore(useWorkspacesStore);
export const { useFetchStore: useUserCollaborationRequestFetchStore } =
  makeSingleFetchStore(useUserCollaborationRequestsStore);
export const { useFetchStore: useWorkspaceCollaborationRequestFetchStore } =
  makeSingleFetchStore(useWorkspaceCollaborationRequestsStore);
export const { useFetchStore: useWorkspaceCollaboratorFetchStore } =
  makeSingleFetchStore(useWorkspaceCollaboratorsStore);
export const { useFetchStore: useWorkspaceAgentTokenFetchStore } =
  makeSingleFetchStore(useWorkspaceAgentTokensStore);
export const { useFetchStore: useWorkspaceFolderFetchStore } =
  makeSingleFetchStore(useWorkspaceFoldersStore);
export const { useFetchStore: useWorkspaceFileFetchStore } =
  makeSingleFetchStore(useWorkspaceFilesStore);
export const { useFetchStore: useWorkspacePermissionGroupFetchStore } =
  makeSingleFetchStore(useWorkspacePermissionGroupsStore);
export const { useFetchStore: useUserSessionFetchStore } = makeSingleFetchStore<
  User,
  UserSessionFetchStoreOther
>(
  useUsersStore,
  // There should be only one user session at a time, so return `true` for all
  // comparisons enforcing the single session. `set` calls to update a session
  // entry will always update the one session.
  () => true
);

export function clearFetchSingleResourceStores() {
  useUserSessionFetchStore.getState().clear();
  useUserWorkspaceFetchStore.getState().clear();
  useUserCollaborationRequestFetchStore.getState().clear();
  useWorkspaceCollaborationRequestFetchStore.getState().clear();
  useWorkspaceCollaboratorFetchStore.getState().clear();
  useWorkspaceAgentTokenFetchStore.getState().clear();
  useWorkspaceFolderFetchStore.getState().clear();
  useWorkspaceFileFetchStore.getState().clear();
  useWorkspacePermissionGroupFetchStore.getState().clear();
}
