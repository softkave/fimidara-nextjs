import {
  AgentToken,
  CollaborationRequestForUser,
  CollaborationRequestForWorkspace,
  Collaborator,
  File,
  Folder,
  GetUsageCostsEndpointResult,
  GetUserCollaborationRequestsEndpointParams,
  GetUserWorkspacesEndpointParams,
  GetWorkspaceAgentTokensEndpointParams,
  GetWorkspaceCollaborationRequestsEndpointParams,
  GetWorkspaceCollaboratorsEndpointParams,
  GetWorkspacePermissionGroupsEndpointParams,
  GetWorkspaceSummedUsageEndpointParams,
  ListFolderContentEndpointParams,
  PermissionGroup,
  UsageRecord,
  Workspace,
} from "fimidara";
import { identity } from "lodash";
import { getPublicFimidaraEndpointsUsingUserToken } from "../api/fimidaraEndpoints";
import { AnyFn } from "../utils/types";
import {
  FetchPaginatedResourceListReturnedData,
  makeFetchPaginatedResourceListFetchFn,
  makeFetchPaginatedResourceListGetFn,
  makeFetchPaginatedResourceListSetFn,
  makeFetchResourceHook,
  makeFetchResourceStoreHook,
  removeIdFromIdListOnDeleteResources,
} from "./fetchHookUtils";
import { ResourceZustandStore } from "./makeResourceListStore";
import {
  getCollaboratorStoreKey,
  useUserCollaborationRequestsStore,
  useWorkspaceAgentTokensStore,
  useWorkspaceCollaborationRequestsStore,
  useWorkspaceCollaboratorsStore,
  useWorkspaceFilesStore,
  useWorkspaceFoldersStore,
  useWorkspacePermissionGroupsStore,
  useWorkspaceUsageRecordsStore,
  useWorkspacesStore,
} from "./resourceListStores";

async function userWorkspacesInputFetchFn(
  params: GetUserWorkspacesEndpointParams
): Promise<FetchPaginatedResourceListReturnedData<Workspace>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.workspaces.getUserWorkspaces({
    body: params,
  });
  const count = await endpoints.workspaces.countUserWorkspaces();
  return { count: count.body.count, resourceList: data.body.workspaces };
}
async function userCollaborationRequestsInputFetchFn(
  params: GetUserCollaborationRequestsEndpointParams
): Promise<
  FetchPaginatedResourceListReturnedData<CollaborationRequestForUser>
> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getUserRequests({
    body: params,
  });
  const count = await endpoints.collaborationRequests.countUserRequests();
  return { count: count.body.count, resourceList: data.body.requests };
}
async function workspaceCollaborationRequestsInputFetchFn(
  params: GetWorkspaceCollaborationRequestsEndpointParams
): Promise<
  FetchPaginatedResourceListReturnedData<CollaborationRequestForWorkspace>
> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getWorkspaceRequests({
    body: params,
  });
  const count = await endpoints.collaborationRequests.countWorkspaceRequests();
  return { count: count.body.count, resourceList: data.body.requests };
}
async function workspaceCollaboratorsInputFetchFn(
  params: GetWorkspaceCollaboratorsEndpointParams
): Promise<FetchPaginatedResourceListReturnedData<Collaborator>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborators.getWorkspaceCollaborators({
    body: params,
  });
  const count = await endpoints.collaborators.countWorkspaceCollaborators();
  return { count: count.body.count, resourceList: data.body.collaborators };
}
async function workspaceAgentTokensInputFetchFn(
  params: GetWorkspaceAgentTokensEndpointParams
): Promise<FetchPaginatedResourceListReturnedData<AgentToken>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.agentTokens.getWorkspaceTokens({
    body: params,
  });
  const count = await endpoints.agentTokens.countWorkspaceTokens();
  return { count: count.body.count, resourceList: data.body.tokens };
}
async function workspaceFoldersInputFetchFn(
  params: Omit<ListFolderContentEndpointParams, "contentType">
): Promise<FetchPaginatedResourceListReturnedData<Folder>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.folders.listFolderContent({
    body: { ...params, contentType: "folder" },
  });
  const count = await endpoints.folders.countFolderContent();
  return { count: count.body.foldersCount, resourceList: data.body.folders };
}
async function workspaceFilesInputFetchFn(
  params: Omit<ListFolderContentEndpointParams, "contentType">
): Promise<FetchPaginatedResourceListReturnedData<File>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.folders.listFolderContent({
    body: { ...params, contentType: "file" },
  });
  const count = await endpoints.folders.countFolderContent();
  return { count: count.body.filesCount, resourceList: data.body.files };
}
async function workspacePermissionGroupsInputFetchFn(
  params: GetWorkspacePermissionGroupsEndpointParams
): Promise<FetchPaginatedResourceListReturnedData<PermissionGroup>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.permissionGroups.getWorkspacePermissionGroups({
    body: params,
  });
  const count = await endpoints.permissionGroups.countWorkspacePermissionGroups(
    { body: { workspaceId: params.workspaceId } }
  );
  return { count: count.body.count, resourceList: data.body.permissionGroups };
}
async function workspaceUsageRecordsInputFetchFn(
  params: GetWorkspaceSummedUsageEndpointParams
): Promise<FetchPaginatedResourceListReturnedData<UsageRecord>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.usageRecords.getWorkspaceSummedUsage({
    body: params,
  });
  const count = await endpoints.usageRecords.countWorkspaceSummedUsage();
  return { count: count.body.count, resourceList: data.body.records };
}

async function usageCostsInputFetchFn() {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.usageRecords.getUsageCosts();
  return data.body;
}

function makePaginatedFetchHookAndStore<
  TResource extends { resourceId: string },
  Fn extends AnyFn<
    any,
    Promise<FetchPaginatedResourceListReturnedData<TResource>>
  >
>(
  useResourceListStore: ResourceZustandStore<TResource>,
  inputFetchFn: Fn,
  getKey?: (item: TResource) => string
) {
  const getFn =
    makeFetchPaginatedResourceListGetFn<TResource>(useResourceListStore);
  const useFetchStore = makeFetchResourceStoreHook(getFn);
  const fetchFn = makeFetchPaginatedResourceListFetchFn(
    inputFetchFn,
    useResourceListStore,
    getKey
  );
  removeIdFromIdListOnDeleteResources(useResourceListStore, useFetchStore);
  const setFn = makeFetchPaginatedResourceListSetFn();
  const useFetchHook = makeFetchResourceHook(fetchFn, useFetchStore, setFn);

  return { useFetchStore, useFetchHook };
}

export const {
  useFetchStore: useUserWorkspacesFetchStore,
  useFetchHook: useUserWorkspacesFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspacesStore,
  userWorkspacesInputFetchFn
);
export const {
  useFetchStore: useUserCollaborationRequestsFetchStore,
  useFetchHook: useUserCollaborationRequestsFetchHook,
} = makePaginatedFetchHookAndStore(
  useUserCollaborationRequestsStore,
  userCollaborationRequestsInputFetchFn
);
export const {
  useFetchStore: useWorkspaceCollaborationRequestsFetchStore,
  useFetchHook: useWorkspaceCollaborationRequestsFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceCollaborationRequestsStore,
  workspaceCollaborationRequestsInputFetchFn
);
export const {
  useFetchStore: useWorkspaceCollaboratorsFetchStore,
  useFetchHook: useWorkspaceCollaboratorsFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceCollaboratorsStore,
  workspaceCollaboratorsInputFetchFn,
  getCollaboratorStoreKey
);
export const {
  useFetchStore: useWorkspaceAgentTokensFetchStore,
  useFetchHook: useWorkspaceAgentTokensFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceAgentTokensStore,
  workspaceAgentTokensInputFetchFn
);
export const {
  useFetchStore: useWorkspaceFoldersFetchStore,
  useFetchHook: useWorkspaceFoldersFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceFoldersStore,
  workspaceFoldersInputFetchFn
);
export const {
  useFetchStore: useWorkspaceFilesFetchStore,
  useFetchHook: useWorkspaceFilesFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceFilesStore,
  workspaceFilesInputFetchFn
);
export const {
  useFetchStore: useWorkspacePermissionGroupsFetchStore,
  useFetchHook: useWorkspacePermissionGroupsFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspacePermissionGroupsStore,
  workspacePermissionGroupsInputFetchFn
);
export const {
  useFetchStore: useWorkspaceUsageRecordsFetchStore,
  useFetchHook: useWorkspaceUsageRecordsFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceUsageRecordsStore,
  workspaceUsageRecordsInputFetchFn
);

export const useUsageCostsFetchStore = makeFetchResourceStoreHook<
  GetUsageCostsEndpointResult,
  GetUsageCostsEndpointResult,
  undefined
>(identity);
export const useUsageCostsFetchHook = makeFetchResourceHook(
  usageCostsInputFetchFn,
  useUsageCostsFetchStore,
  identity
);

export function clearFetchResourceListStores() {
  useUserWorkspacesFetchStore.getState().clear();
  useUserCollaborationRequestsFetchStore.getState().clear();
  useWorkspaceCollaborationRequestsFetchStore.getState().clear();
  useWorkspaceCollaboratorsStore.getState().clear();
  useWorkspaceAgentTokensFetchStore.getState().clear();
  useWorkspaceFoldersFetchStore.getState().clear();
  useWorkspaceFilesFetchStore.getState().clear();
  useWorkspacePermissionGroupsFetchStore.getState().clear();
  useWorkspaceUsageRecordsFetchStore.getState().clear();
  useUsageCostsFetchStore.getState().clear();
}
