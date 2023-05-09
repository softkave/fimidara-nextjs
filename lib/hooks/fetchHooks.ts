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
import { identity, isEqual, omit } from "lodash";
import { getPublicFimidaraEndpointsUsingUserToken } from "../api/fimidaraEndpoints";
import { IPaginationQuery } from "../api/types";
import { AnyFn } from "../utils/types";
import {
  FetchPaginatedResourceListData,
  FetchPaginatedResourceListReturnedData,
  GetFetchPaginatedResourceListFetchFnOther,
  makeFetchPaginatedResourceListFetchFn,
  makeFetchPaginatedResourceListGetFn,
  makeFetchPaginatedResourceListSetFn,
  makeFetchResourceHook,
  makeFetchResourceStoreHook,
  paginatedResourceListShouldFetchFn,
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
  comparisonFn: AnyFn<[Parameters<Fn>[0], Parameters<Fn>[0]], boolean>,
  getIdFromResource?: (item: TResource) => string
) {
  const getFn =
    makeFetchPaginatedResourceListGetFn<TResource>(useResourceListStore);
  const useFetchStore = makeFetchResourceStoreHook<
    FetchPaginatedResourceListData,
    FetchPaginatedResourceListReturnedData<
      TResource,
      GetFetchPaginatedResourceListFetchFnOther<Fn>
    >,
    Parameters<Fn>[0]
  >(getFn, comparisonFn);
  const fetchFn = makeFetchPaginatedResourceListFetchFn(
    inputFetchFn,
    useResourceListStore,
    getIdFromResource
  );
  removeIdFromIdListOnDeleteResources(useResourceListStore, useFetchStore);
  const setFn = makeFetchPaginatedResourceListSetFn();
  const useFetchHook = makeFetchResourceHook(
    fetchFn,
    useFetchStore,
    setFn,
    paginatedResourceListShouldFetchFn
  );

  return { useFetchStore, useFetchHook };
}

export const {
  useFetchStore: useUserWorkspacesFetchStore,
  useFetchHook: useUserWorkspacesFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspacesStore,
  userWorkspacesInputFetchFn,
  checkIsEqualOmittingPageAndPageSize
);
export const {
  useFetchStore: useUserCollaborationRequestsFetchStore,
  useFetchHook: useUserCollaborationRequestsFetchHook,
} = makePaginatedFetchHookAndStore(
  useUserCollaborationRequestsStore,
  userCollaborationRequestsInputFetchFn,
  checkIsEqualOmittingPageAndPageSize
);
export const {
  useFetchStore: useWorkspaceCollaborationRequestsFetchStore,
  useFetchHook: useWorkspaceCollaborationRequestsFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceCollaborationRequestsStore,
  workspaceCollaborationRequestsInputFetchFn,
  checkIsEqualOmittingPageAndPageSize
);
export const {
  useFetchStore: useWorkspaceCollaboratorsFetchStore,
  useFetchHook: useWorkspaceCollaboratorsFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceCollaboratorsStore,
  workspaceCollaboratorsInputFetchFn,
  checkIsEqualOmittingPageAndPageSize,
  getCollaboratorStoreKey
);
export const {
  useFetchStore: useWorkspaceAgentTokensFetchStore,
  useFetchHook: useWorkspaceAgentTokensFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceAgentTokensStore,
  workspaceAgentTokensInputFetchFn,
  checkIsEqualOmittingPageAndPageSize
);
export const {
  useFetchStore: useWorkspaceFoldersFetchStore,
  useFetchHook: useWorkspaceFoldersFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceFoldersStore,
  workspaceFoldersInputFetchFn,
  checkIsEqualOmittingPageAndPageSize
);
export const {
  useFetchStore: useWorkspaceFilesFetchStore,
  useFetchHook: useWorkspaceFilesFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceFilesStore,
  workspaceFilesInputFetchFn,
  checkIsEqualOmittingPageAndPageSize
);
export const {
  useFetchStore: useWorkspacePermissionGroupsFetchStore,
  useFetchHook: useWorkspacePermissionGroupsFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspacePermissionGroupsStore,
  workspacePermissionGroupsInputFetchFn,
  checkIsEqualOmittingPageAndPageSize
);
export const {
  useFetchStore: useWorkspaceUsageRecordsFetchStore,
  useFetchHook: useWorkspaceUsageRecordsFetchHook,
} = makePaginatedFetchHookAndStore(
  useWorkspaceUsageRecordsStore,
  workspaceUsageRecordsInputFetchFn,
  checkIsEqualOmittingPageAndPageSize
);

function checkIsEqualOmittingPageAndPageSize(
  p0: IPaginationQuery,
  p1: IPaginationQuery
) {
  const omitKeys: Array<keyof IPaginationQuery> = ["page", "pageSize"];
  return isEqual(omit(p0, omitKeys), omit(p1, omitKeys));
}

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
