import {
  AgentToken,
  CollaborationRequestForUser,
  CollaborationRequestForWorkspace,
  Collaborator,
  File,
  Folder,
  GetAgentTokenEndpointParams,
  GetCollaborationRequestEndpointParams,
  GetCollaboratorEndpointParams,
  GetFileDetailsEndpointParams,
  GetFolderEndpointParams,
  GetPermissionGroupEndpointParams,
  GetUsageCostsEndpointResult,
  GetUserCollaborationRequestsEndpointParams,
  GetUserWorkspacesEndpointParams,
  GetWorkspaceAgentTokensEndpointParams,
  GetWorkspaceCollaborationRequestsEndpointParams,
  GetWorkspaceCollaboratorsEndpointParams,
  GetWorkspaceEndpointParams,
  GetWorkspacePermissionGroupsEndpointParams,
  GetWorkspaceSummedUsageEndpointParams,
  ListFolderContentEndpointParams,
  PermissionGroup,
  PublicUser,
  UsageRecord,
  Workspace,
} from "fimidara";
import { identity } from "lodash";
import { getPublicFimidaraEndpointsUsingUserToken } from "../api/fimidaraEndpoints";
import { AnyFn } from "../utils/types";
import {
  FetchPaginatedResourceListGetFnParams02,
  FetchPaginatedResourceListReturnedData,
  FetchSingleResourceFetchFnData,
  makeFetchPaginatedResourceListFetchFn,
  makeFetchPaginatedResourceListGetFn,
  makeFetchPaginatedResourceListOnMountFn,
  makeFetchPaginatedResourceListSetFn,
  makeFetchResourceHook,
  makeFetchResourceStoreHook,
  makeFetchSingleResourceFetchFn,
  makeFetchSingleResourceGetFn,
  makeFetchSingleResourceOnMountFn,
} from "./fetchHookUtils";
import {
  ResourceZustandStore,
  makeResourceListStore,
} from "./makeResourceListStore";

export const useUsersStore = makeResourceListStore<PublicUser | Collaborator>();
export const useUserCollaborationRequestsStore =
  makeResourceListStore<CollaborationRequestForUser>();
export const useWorkspaceCollaborationRequestsStore =
  makeResourceListStore<CollaborationRequestForWorkspace>();
export const useWorkspaceAgentTokensStore = makeResourceListStore<AgentToken>();
export const useWorkspaceFilesStore = makeResourceListStore<File>();
export const useWorkspaceFoldersStore = makeResourceListStore<Folder>();
export const useWorkspacePermissionGroupsStore =
  makeResourceListStore<PermissionGroup>();
export const useWorkspaceUsageRecordsStore =
  makeResourceListStore<UsageRecord>();
export const useWorkspacesStore = makeResourceListStore<Workspace>();

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

async function userWorkspaceInputFetchFn(
  params: GetWorkspaceEndpointParams
): Promise<FetchSingleResourceFetchFnData<Workspace>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.workspaces.getWorkspace({
    body: params,
  });
  return { resource: data.body.workspace };
}
async function userCollaborationRequestInputFetchFn(
  params: GetCollaborationRequestEndpointParams
): Promise<FetchSingleResourceFetchFnData<CollaborationRequestForUser>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getUserRequest({
    body: params,
  });
  return { resource: data.body.request };
}
async function workspaceCollaborationRequestInputFetchFn(
  params: GetCollaborationRequestEndpointParams
): Promise<FetchSingleResourceFetchFnData<CollaborationRequestForWorkspace>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getWorkspaceRequest({
    body: params,
  });
  return { resource: data.body.request };
}
async function workspaceCollaboratorInputFetchFn(
  params: GetCollaboratorEndpointParams
): Promise<FetchSingleResourceFetchFnData<Collaborator>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborators.getCollaborator({
    body: params,
  });
  return { resource: data.body.collaborator };
}
async function workspaceAgentTokenInputFetchFn(
  params: GetAgentTokenEndpointParams
): Promise<FetchSingleResourceFetchFnData<AgentToken>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.agentTokens.getToken({
    body: params,
  });
  return { resource: data.body.token };
}
async function workspaceFolderInputFetchFn(
  params: GetFolderEndpointParams
): Promise<FetchSingleResourceFetchFnData<Folder>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.folders.getFolder({
    body: params,
  });
  return { resource: data.body.folder };
}
async function workspaceFileInputFetchFn(
  params: GetFileDetailsEndpointParams
): Promise<FetchSingleResourceFetchFnData<File>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.files.getFileDetails({
    body: params,
  });
  return { resource: data.body.file };
}
async function workspacePermissionGroupInputFetchFn(
  params: GetPermissionGroupEndpointParams
): Promise<FetchSingleResourceFetchFnData<PermissionGroup>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.permissionGroups.getPermissionGroup({
    body: params,
  });
  return { resource: data.body.permissionGroup };
}

function makePaginatedFetchHookAndStore<
  TResource extends { resourceId: string },
  Fn extends AnyFn<
    Array<FetchPaginatedResourceListGetFnParams02>,
    Promise<FetchPaginatedResourceListReturnedData<TResource>>
  >
>(useResourceListStore: ResourceZustandStore<TResource>, inputFetchFn: Fn) {
  const getFn =
    makeFetchPaginatedResourceListGetFn<TResource>(useResourceListStore);
  const useFetchStore = makeFetchResourceStoreHook(getFn);
  const fetchFn = makeFetchPaginatedResourceListFetchFn(
    inputFetchFn,
    useResourceListStore
  );
  const setFn = makeFetchPaginatedResourceListSetFn<TResource>();
  const onMountFn = makeFetchPaginatedResourceListOnMountFn(
    useResourceListStore,
    useFetchStore
  );
  const useFetchHook = makeFetchResourceHook(
    fetchFn,
    useFetchStore,
    setFn,
    onMountFn
  );

  return { useFetchStore, useFetchHook };
}

function makeSingleFetchHookAndStore<
  TResource extends { resourceId: string },
  Fn extends AnyFn<any, Promise<FetchSingleResourceFetchFnData<TResource>>>
>(useResourceListStore: ResourceZustandStore<TResource>, inputFetchFn: Fn) {
  const getFn = makeFetchSingleResourceGetFn<TResource>(useResourceListStore);
  const useFetchStore = makeFetchResourceStoreHook(getFn);
  const fetchFn = makeFetchSingleResourceFetchFn(
    inputFetchFn,
    useResourceListStore
  );
  const onMountFn = makeFetchSingleResourceOnMountFn(
    useResourceListStore,
    useFetchStore
  );
  const useFetchHook = makeFetchResourceHook(
    fetchFn,
    useFetchStore,
    identity,
    onMountFn
  );

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
  useUsersStore,
  workspaceCollaboratorsInputFetchFn
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

export const {
  useFetchStore: useUserWorkspaceFetchStore,
  useFetchHook: useUserWorkspaceFetchHook,
} = makeSingleFetchHookAndStore(useWorkspacesStore, userWorkspaceInputFetchFn);
export const {
  useFetchStore: useUserCollaborationRequestFetchStore,
  useFetchHook: useUserCollaborationRequestFetchHook,
} = makeSingleFetchHookAndStore(
  useUserCollaborationRequestsStore,
  userCollaborationRequestInputFetchFn
);
export const {
  useFetchStore: useWorkspaceCollaborationRequestFetchStore,
  useFetchHook: useWorkspaceCollaborationRequestFetchHook,
} = makeSingleFetchHookAndStore(
  useWorkspaceCollaborationRequestsStore,
  workspaceCollaborationRequestInputFetchFn
);
export const {
  useFetchStore: useWorkspaceCollaboratorFetchStore,
  useFetchHook: useWorkspaceCollaboratorFetchHook,
} = makeSingleFetchHookAndStore(
  useUsersStore,
  workspaceCollaboratorInputFetchFn
);
export const {
  useFetchStore: useWorkspaceAgentTokenFetchStore,
  useFetchHook: useWorkspaceAgentTokenFetchHook,
} = makeSingleFetchHookAndStore(
  useWorkspaceAgentTokensStore,
  workspaceAgentTokenInputFetchFn
);
export const {
  useFetchStore: useWorkspaceFolderFetchStore,
  useFetchHook: useWorkspaceFolderFetchHook,
} = makeSingleFetchHookAndStore(
  useWorkspaceFoldersStore,
  workspaceFolderInputFetchFn
);
export const {
  useFetchStore: useWorkspaceFileFetchStore,
  useFetchHook: useWorkspaceFileFetchHook,
} = makeSingleFetchHookAndStore(
  useWorkspaceFilesStore,
  workspaceFileInputFetchFn
);
export const {
  useFetchStore: useWorkspacePermissionGroupFetchStore,
  useFetchHook: useWorkspacePermissionGroupFetchHook,
} = makeSingleFetchHookAndStore(
  useWorkspacePermissionGroupsStore,
  workspacePermissionGroupInputFetchFn
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
