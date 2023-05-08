import { useRequest } from "ahooks";
import type { Options as UseRequestOptions } from "ahooks/lib/useRequest/src/types";
import { FimidaraEndpointResult, LoginResult } from "fimidara";
import { compact, over } from "lodash";
import React from "react";
import {
  getPrivateFimidaraEndpointsUsingUserToken,
  getPublicFimidaraEndpointsUsingUserToken,
} from "../api/fimidaraEndpoints";
import { AnyFn } from "../utils/types";
import { ResourceZustandStore } from "./makeResourceListStore";
import {
  getCollaboratorStoreKey,
  getFileByPath,
  getFolderByPath,
  useUsersStore,
  useWorkspaceAgentTokensStore,
  useWorkspaceCollaborationRequestsStore,
  useWorkspaceCollaboratorsStore,
  useWorkspaceFilesStore,
  useWorkspaceFoldersStore,
  useWorkspacePermissionGroupsStore,
  useWorkspaceUsageRecordsStore,
  useWorkspacesStore,
} from "./resourceListStores";
import { useUserSessionFetchStore } from "./singleResourceFetchStores";

type GetEndpointFn<TEndpoints, TFn> = TFn extends AnyFn<
  [TEndpoints],
  infer TEndpointFn
>
  ? TEndpointFn
  : any;

function makeEndpointMutationHook<
  TEndpoints,
  TFn extends AnyFn<[TEndpoints], AnyFn>,
  TData = Awaited<ReturnType<GetEndpointFn<TEndpoints, TFn>>>,
  TParams extends any[] = Parameters<GetEndpointFn<TEndpoints, TFn>>
>(
  getEndpoints: AnyFn<[], TEndpoints>,
  getFn: TFn,
  baseOnSuccess?: AnyFn<[TData, TParams]>,
  baseOnError?: AnyFn<[Error, TParams]>
) {
  return function (requestOptions?: UseRequestOptions<TData, TParams>) {
    const mutationFn = React.useCallback(
      async (...data: TParams): Promise<TData> => {
        const endpoints = getEndpoints();
        const fn = getFn(endpoints);
        const result = await fn(...data);
        return result;
      },
      []
    );
    const onSuccessFn = React.useCallback(
      (data: TData, params: TParams) => {
        const fn = over(compact([baseOnSuccess, requestOptions?.onSuccess]));
        fn(data, params);
      },
      [requestOptions?.onSuccess]
    );
    const onErrorFn = React.useCallback(
      (e: Error, params: TParams) => {
        const fn = over(compact([baseOnError, requestOptions?.onError]));
        fn(e, params);
      },
      [requestOptions?.onError]
    );

    const request = useRequest(mutationFn, {
      manual: true,
      ...requestOptions,
      onSuccess: onSuccessFn,
      onError: onErrorFn,
    });

    return request;
  };
}

function updateUserSessionWhenResultIsLoginResult(
  result: FimidaraEndpointResult<LoginResult>
) {
  const states = [...useUserSessionFetchStore.getState().states];
  useUsersStore.getState().set(result.body.user.resourceId, result.body.user);

  if (states[0]) {
    const [params, fetchState] = states[0];
    states[0] = [
      params,
      {
        ...fetchState,
        data: {
          id: result.body.user.resourceId,
          initialized: true,
          other: {
            clientToken: result.body.clientAssignedToken,
            userToken: result.body.token,
          },
        },
      },
    ];
  } else {
    states.push([
      // anything is allowed really because `useUserSessionFetchStore`'s
      // `comparisonFn` returns true always making there be only one session in
      // store.
      {},
      {
        loading: false,
        error: undefined,
        data: {
          id: result.body.user.resourceId,
          initialized: true,
          other: {
            clientToken: result.body.clientAssignedToken,
            userToken: result.body.token,
          },
        },
      },
    ]);
  }

  useUserSessionFetchStore.setState({ states });
}

export const useUserSignupMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.users.signup,
  updateUserSessionWhenResultIsLoginResult
);
export const useUserLoginMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.users.login,
  updateUserSessionWhenResultIsLoginResult
);
export const useUserForgotPasswordMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.users.forgotPassword
);
export const useUserChangePasswordWithTokenMutationHook =
  makeEndpointMutationHook(
    getPrivateFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.users.changePasswordWithToken,
    updateUserSessionWhenResultIsLoginResult
  );
export const useUserChangePasswordWithCurrentPasswordMutationHook =
  makeEndpointMutationHook(
    getPrivateFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.users.changePasswordWithCurrentPassword,
    updateUserSessionWhenResultIsLoginResult
  );
export const useUserSendEmailVerificationCodeMutationHook =
  makeEndpointMutationHook(
    getPrivateFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.users.sendEmailVerificationCode
  );
export const useUserConfirmEmailMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.users.confirmEmailAddress,
  updateUserSessionWhenResultIsLoginResult
);
export const useUserUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.users.updateUser
);
export const useUserCollaborationRequestResponseMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.respondToRequest
  );

export const useWorkspaceAgentTokenAddMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.agentTokens.addToken
);
export const useWorkspaceAgentTokenUpdateMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.agentTokens.updateToken
  );
export const useWorkspaceAgentTokenDeleteMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.agentTokens.deleteToken,
    (data, params) => {
      const body = params[0]?.body;
      let tokenId = body?.tokenId;

      if (!tokenId && body && body.workspaceId && body.providedResourceId) {
        const token = Object.values(
          useWorkspaceAgentTokensStore.getState().items
        ).find(
          (nextToken) =>
            nextToken.workspaceId === body.workspaceId &&
            nextToken.providedResourceId === body.workspaceId
        );

        tokenId = token?.resourceId;
      }

      if (tokenId) {
        useWorkspaceAgentTokensStore.getState().remove(tokenId);
      }
    }
  );
export const useWorkspaceCollaboratorDeleteMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborators.removeCollaborator,
    (data, params) => {
      const body = params[0]?.body;

      if (body?.collaboratorId && body.workspaceId) {
        const key = getCollaboratorStoreKey({
          workspaceId: body.workspaceId,
          resourceId: body.collaboratorId,
        });
        useWorkspaceCollaboratorsStore.getState().remove(key);
      }
    }
  );
export const useWorkspaceFileUploadMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.files.uploadFile
);
export const useWorkspaceFileUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.files.updateFileDetails
);
export const useWorkspaceFileDeleteMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.files.deleteFile,
  (data, params) => {
    const body = params[0]?.body;
    let fileId = body?.fileId;

    if (!fileId && body?.filepath) {
      fileId = getFileByPath(body.filepath, true)?.resourceId;
    }

    if (fileId) {
      useWorkspaceFilesStore.getState().remove(fileId);
    }
  }
);
export const useWorkspaceFolderAddMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.folders.addFolder
);
export const useWorkspaceFolderUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.folders.updateFolder
);
export const useWorkspaceFolderDeleteMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.folders.deleteFolder,
  (data, params) => {
    const body = params[0]?.body;
    let folderId = body?.folderId;

    if (!folderId && body?.folderpath) {
      folderId = getFolderByPath(body.folderpath, true)?.resourceId;
    }

    if (folderId) {
      deleteFolderChildren(folderId);
      useWorkspaceFoldersStore.getState().remove(folderId);
    }
  }
);
export const useWorkspacePermissionGroupAddMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.permissionGroups.addPermissionGroup
  );
export const useWorkspacePermissionGroupUpdateMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.permissionGroups.updatePermissionGroup
  );
export const useWorkspacePermissionGroupDeleteMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.permissionGroups.deletePermissionGroup,
    (data, params) => {
      const body = params[0]?.body;
      let resourceId = body?.permissionGroupId;

      if (resourceId) {
        useWorkspacePermissionGroupsStore.getState().remove(resourceId);
      }
    }
  );
export const useWorkspacePermissionGroupAssignMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.permissionGroups.assignPermissionGroups
  );
export const useWorkspaceCollaborationRequestUpdateMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.updateRequest
  );
export const useWorkspaceCollaborationRequestRevokeMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.revokeRequest
  );
export const useWorkspaceCollaborationRequestDeleteMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.deleteRequest,
    (data, params) => {
      const body = params[0]?.body;
      let resourceId = body?.requestId;

      if (resourceId) {
        useWorkspaceCollaborationRequestsStore.getState().remove(resourceId);
      }
    }
  );
export const useWorkspaceCollaborationRequestAddMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.sendRequest
  );
export const useWorkspaceAddMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.workspaces.addWorkspace
);
export const useWorkspaceUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.workspaces.updateWorkspace
);
export const useWorkspaceDeleteMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.workspaces.deleteWorkspace,
  (data, params) => {
    const body = params[0]?.body;
    let resourceId = body?.workspaceId;

    if (resourceId) {
      deleteWorkspaceChildren(resourceId);
      useWorkspacesStore.getState().remove(resourceId);
    }
  }
);

function deleteFolderChildren(folderId: string) {
  const folderList = Object.values(useWorkspaceFoldersStore.getState().items);
  const fileList = Object.values(useWorkspaceFilesStore.getState().items);
  const childrenFolderIdList = folderList
    .filter((nextFolder) => nextFolder.idPath.includes(folderId))
    .map((nextFolder) => nextFolder.resourceId);
  const childrenFileIdList = fileList
    .filter((nextFile) => nextFile.idPath.includes(folderId))
    .map((nextFile) => nextFile.resourceId);
  useWorkspaceFoldersStore.getState().remove(childrenFolderIdList);
  useWorkspaceFilesStore.getState().remove(childrenFileIdList);
}

function deleteWorkspaceChildren(workspaceId: string) {
  const isWorkspaceChild = (item: { workspaceId: string }) =>
    item.workspaceId === workspaceId;
  const deleteChildrenFromStore = (store: ResourceZustandStore<any>) => {
    const childrenIdList = Object.values(store.getState().items)
      .filter(isWorkspaceChild)
      .map((child) => child.resourceId);
    store.getState().remove(childrenIdList);
  };

  deleteChildrenFromStore(useWorkspaceAgentTokensStore);
  deleteChildrenFromStore(useWorkspaceCollaborationRequestsStore);
  deleteChildrenFromStore(useWorkspaceCollaboratorsStore);
  deleteChildrenFromStore(useWorkspaceFoldersStore);
  deleteChildrenFromStore(useWorkspaceFilesStore);
  deleteChildrenFromStore(useWorkspacePermissionGroupsStore);
  deleteChildrenFromStore(useWorkspaceUsageRecordsStore);
}

export function useMergeMutationHooksLoadingAndError(
  ...hooks: Array<ReturnType<typeof useRequest>>
) {
  let loading = false;
  let error: Error[] = [];
  hooks.forEach((hook) => {
    loading ||= hook.loading;
    if (hook.error) error.push(hook.error);
  });
  return { loading, error };
}
