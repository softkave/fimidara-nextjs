import {
  AgentToken,
  CollaborationRequestForUser,
  CollaborationRequestForWorkspace,
  Collaborator,
  File,
  Folder,
  GetAgentTokenEndpointParams,
  GetCollaboratorEndpointParams,
  GetFileDetailsEndpointParams,
  GetFolderEndpointParams,
  GetPermissionGroupEndpointParams,
  GetUserCollaborationRequestEndpointParams,
  GetWorkspaceCollaborationRequestEndpointParams,
  GetWorkspaceEndpointParams,
  PermissionGroup,
  User,
  Workspace,
} from "fimidara";
import { identity } from "lodash";
import { getPublicFimidaraEndpointsUsingUserToken } from "../api/fimidaraEndpoints";
import { AnyFn } from "../utils/types";
import {
  FetchResourceZustandStore,
  FetchSingleResourceData,
  FetchSingleResourceFetchFnData,
  FetchSingleResourceReturnedData,
  GetFetchSingleResourceFetchFnOther,
  makeFetchResourceHook,
  makeFetchSingleResourceFetchFn,
  singleResourceShouldFetchFn,
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
import {
  UserSessionFetchStoreOther,
  useUserCollaborationRequestFetchStore,
  useUserSessionFetchStore,
  useUserWorkspaceFetchStore,
  useWorkspaceAgentTokenFetchStore,
  useWorkspaceCollaborationRequestFetchStore,
  useWorkspaceCollaboratorFetchStore,
  useWorkspaceFileFetchStore,
  useWorkspaceFolderFetchStore,
  useWorkspacePermissionGroupFetchStore,
} from "./singleResourceFetchStores";

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
  params: GetUserCollaborationRequestEndpointParams
): Promise<FetchSingleResourceFetchFnData<CollaborationRequestForUser>> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.collaborationRequests.getUserRequest({
    body: params,
  });
  return { resource: data.body.request };
}
async function workspaceCollaborationRequestInputFetchFn(
  params: GetWorkspaceCollaborationRequestEndpointParams
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
async function getUserDataInputFetchFn(): Promise<
  FetchSingleResourceFetchFnData<User, UserSessionFetchStoreOther>
> {
  const endpoints = getPublicFimidaraEndpointsUsingUserToken();
  const data = await endpoints.users.getUserData();
  return {
    resource: data.body.user,
    other: {
      userToken: data.body.token,
      clientToken: data.body.clientAssignedToken,
    },
  };
}

function makeSingleFetchHook<
  TResource extends { resourceId: string },
  Fn extends AnyFn<any, Promise<FetchSingleResourceFetchFnData<TResource>>>
>(
  useResourceListStore: ResourceZustandStore<TResource>,
  useFetchStore: FetchResourceZustandStore<
    FetchSingleResourceData<GetFetchSingleResourceFetchFnOther<Fn>>,
    FetchSingleResourceReturnedData<
      TResource,
      GetFetchSingleResourceFetchFnOther<Fn>
    >,
    any
  >,
  inputFetchFn: Fn
) {
  const fetchFn = makeFetchSingleResourceFetchFn(
    inputFetchFn,
    useResourceListStore
  );
  const useFetchHook = makeFetchResourceHook(
    fetchFn,
    useFetchStore,
    identity,
    singleResourceShouldFetchFn
  );

  return { useFetchHook, fetchFn };
}

export const { useFetchHook: useUserWorkspaceFetchHook } = makeSingleFetchHook(
  useWorkspacesStore,
  useUserWorkspaceFetchStore,
  userWorkspaceInputFetchFn
);
export const { useFetchHook: useUserCollaborationRequestFetchHook } =
  makeSingleFetchHook(
    useUserCollaborationRequestsStore,
    useUserCollaborationRequestFetchStore,
    userCollaborationRequestInputFetchFn
  );
export const { useFetchHook: useWorkspaceCollaborationRequestFetchHook } =
  makeSingleFetchHook(
    useWorkspaceCollaborationRequestsStore,
    useWorkspaceCollaborationRequestFetchStore,
    workspaceCollaborationRequestInputFetchFn
  );
export const { useFetchHook: useWorkspaceCollaboratorFetchHook } =
  makeSingleFetchHook(
    useWorkspaceCollaboratorsStore,
    useWorkspaceCollaboratorFetchStore,
    workspaceCollaboratorInputFetchFn
  );
export const { useFetchHook: useWorkspaceAgentTokenFetchHook } =
  makeSingleFetchHook(
    useWorkspaceAgentTokensStore,
    useWorkspaceAgentTokenFetchStore,
    workspaceAgentTokenInputFetchFn
  );
export const { useFetchHook: useWorkspaceFolderFetchHook } =
  makeSingleFetchHook(
    useWorkspaceFoldersStore,
    useWorkspaceFolderFetchStore,
    workspaceFolderInputFetchFn
  );
export const { useFetchHook: useWorkspaceFileFetchHook } = makeSingleFetchHook(
  useWorkspaceFilesStore,
  useWorkspaceFileFetchStore,
  workspaceFileInputFetchFn
);
export const { useFetchHook: useWorkspacePermissionGroupFetchHook } =
  makeSingleFetchHook(
    useWorkspacePermissionGroupsStore,
    useWorkspacePermissionGroupFetchStore,
    workspacePermissionGroupInputFetchFn
  );
export const { useFetchHook: useUserSessionFetchHook } = makeSingleFetchHook(
  useUsersStore,
  useUserSessionFetchStore,
  getUserDataInputFetchFn
);
