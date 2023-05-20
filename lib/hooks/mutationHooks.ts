import { useRequest } from "ahooks";
import type {
  Result,
  Options as UseRequestOptions,
} from "ahooks/lib/useRequest/src/types";
import { FimidaraEndpointResult, LoginResult } from "fimidara";
import { compact, isEqual, over } from "lodash";
import React from "react";
import {
  getPrivateFimidaraEndpointsUsingUserToken,
  getPublicFimidaraEndpointsUsingUserToken,
} from "../api/fimidaraEndpoints";
import UserSessionStorageFns from "../storage/userSession";
import { indexArray } from "../utils/indexArray";
import { AnyFn } from "../utils/types";
import { FetchResourceZustandStore } from "./fetchHookUtils";
import {
  useEntityAssignedPermissionGroupsFetchStore,
  useResolveEntityPermissionsFetchStore,
  useUserWorkspacesFetchStore,
  useWorkspaceAgentTokensFetchStore,
  useWorkspaceCollaborationRequestsFetchStore,
  useWorkspaceFilesFetchStore,
  useWorkspaceFoldersFetchStore,
  useWorkspacePermissionGroupsFetchStore,
} from "./fetchHooks";
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
import { useHandleServerRecommendedActions } from "./useHandleServerRecommendedActions";

type GetEndpointFn<TEndpoints, TFn> = TFn extends AnyFn<
  [TEndpoints],
  infer TEndpointFn
>
  ? TEndpointFn
  : never;

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
    const { handleServerRecommendedActions } =
      useHandleServerRecommendedActions();
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
        const fn = over(
          compact([
            baseOnError,
            requestOptions?.onError,
            handleServerRecommendedActions,
          ])
        );
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
  (endpoints) => endpoints.users.updateUser,
  (data) => {
    useUsersStore.getState().set(data.body.user.resourceId, data.body.user);
  }
);
export const useUserCollaborationRequestResponseMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.respondToRequest
  );

export const useWorkspaceAgentTokenAddMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.agentTokens.addToken,
  (result) =>
    insertInFetchStoreAddMutationFn(
      result.body.token,
      useWorkspaceAgentTokensStore,
      useWorkspaceAgentTokensFetchStore,
      workspaceIdMatch
    )
);
export const useWorkspaceAgentTokenUpdateMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.agentTokens.updateToken,
    (data) => {
      useWorkspaceAgentTokensStore
        .getState()
        .set(data.body.token.resourceId, data.body.token);
    }
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
  (endpoints) => endpoints.files.uploadFile,
  (result, params) => {
    if (params[0].body.fileId) {
      useWorkspaceFilesStore
        .getState()
        .set(result.body.file.resourceId, result.body.file);
    } else {
      insertInFetchStoreAddMutationFn(
        result.body.file,
        useWorkspaceFilesStore,
        useWorkspaceFilesFetchStore,
        (resource, params) => {
          // TODO: handle folderpath
          const folderId = params.folderId ?? null;
          return resource.parentId === folderId;
        }
      );
    }
  }
);
export const useWorkspaceFileUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.files.updateFileDetails,
  (data) => {
    useWorkspaceFilesStore
      .getState()
      .set(data.body.file.resourceId, data.body.file);
  }
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
  (endpoints) => endpoints.folders.addFolder,
  (result) =>
    insertInFetchStoreAddMutationFn(
      result.body.folder,
      useWorkspaceFoldersStore,
      useWorkspaceFoldersFetchStore,
      (resource, params) => {
        // TODO: handle folderpath
        // Parent ID is set to null for files and folders without parent folder
        const folderId = params.folderId ?? null;
        return resource.parentId === folderId;
      }
    )
);
export const useWorkspaceFolderUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.folders.updateFolder,
  (data) => {
    useWorkspaceFoldersStore
      .getState()
      .set(data.body.folder.resourceId, data.body.folder);
  }
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
    (endpoints) => endpoints.permissionGroups.addPermissionGroup,
    (result) =>
      insertInFetchStoreAddMutationFn(
        result.body.permissionGroup,
        useWorkspacePermissionGroupsStore,
        useWorkspacePermissionGroupsFetchStore,
        workspaceIdMatch
      )
  );
export const useWorkspacePermissionGroupUpdateMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.permissionGroups.updatePermissionGroup,
    (data) => {
      useWorkspacePermissionGroupsStore
        .getState()
        .set(data.body.permissionGroup.resourceId, data.body.permissionGroup);
    }
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
export const useWorkspacePermissionGroupUnassignMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.permissionGroups.unassignPermissionGroups,
    (result, args) => {
      const argsBody = args[0].body;
      const entityIdMap = indexArray(argsBody.entityId);
      const permissionGroupIdMap = indexArray(argsBody.permissionGroups);

      useEntityAssignedPermissionGroupsFetchStore
        .getState()
        .mapFetchState((p, s) => {
          if (entityIdMap[p.entityId] && s.data?.idList) {
            const newIdList = [...s.data.idList].filter(
              (id) => !permissionGroupIdMap[id]
            );
            return { ...s, data: { ...s.data, idList: newIdList } };
          } else {
            return s;
          }
        });
    }
  );
export const useWorkspaceCollaborationRequestUpdateMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.updateRequest,
    (data) => {
      useWorkspaceCollaborationRequestsStore
        .getState()
        .set(data.body.request.resourceId, data.body.request);
    }
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
    (endpoints) => endpoints.collaborationRequests.sendRequest,
    (result) =>
      insertInFetchStoreAddMutationFn(
        result.body.request,
        useWorkspaceCollaborationRequestsStore,
        useWorkspaceCollaborationRequestsFetchStore,
        workspaceIdMatch
      )
  );
export const useWorkspaceAddMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.workspaces.addWorkspace,
  (result) =>
    insertInFetchStoreAddMutationFn(
      result.body.workspace,
      useWorkspacesStore,
      useUserWorkspacesFetchStore,
      (resource, params) => {
        // There's only one workspace fetch store per user session
        return true;
      }
    )
);
export const useWorkspaceUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.workspaces.updateWorkspace,
  (data) => {
    useWorkspacesStore
      .getState()
      .set(data.body.workspace.resourceId, data.body.workspace);
  }
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
export const usePermissionsAddMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.permissionItems.addItems,
  (data, params) => {
    // Success effect is done in-component when done. Reason is, add and
    // deleteHooks are usually called together, also, permissions form close on
    // success, so we won't need to handle them here.
  }
);
export const usePermissionsDeleteMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.permissionItems.deleteItems,
  (data, params) => {
    // Success effect is done in-component when done. Reason is, add and
    // deleteHooks are usually called together, also, permissions form close on
    // success, so we won't need to handle them here.
  }
);

export function clearOutResolvedPermissionFetchStore() {
  useResolveEntityPermissionsFetchStore.getState().clear();
}

function workspaceIdMatch<
  T0 extends { workspaceId?: string },
  T1 extends { workspaceId?: string }
>(p0: T0, p1: T1) {
  return p0.workspaceId === p1.workspaceId;
}

function insertInFetchStoreAddMutationFn<
  TResource extends { resourceId: string },
  TData extends { idList: string[] },
  TKeyParams
>(
  resource: TResource,
  useResourceListStore: ResourceZustandStore<TResource>,
  useFetchStore: FetchResourceZustandStore<TData, any, TKeyParams>,
  comparisonFn: AnyFn<[TResource, TKeyParams], boolean>
) {
  useResourceListStore.getState().set(resource.resourceId, resource);
  const fetchState = useFetchStore
    .getState()
    .findFetchState((params, state) => comparisonFn(resource, params));

  if (fetchState) {
    useFetchStore.getState().setFetchState(
      fetchState[0],
      (state) => {
        if (!state?.data) return state as any;
        const idList = [resource.resourceId].concat(state?.data?.idList ?? []);
        return {
          ...state,
          data: {
            ...state?.data,
            idList,
            count: idList.length,
          },
        };
      },
      /** initialize */ false
    );
  }
}

function updateUserSessionWhenResultIsLoginResult(
  result: FimidaraEndpointResult<LoginResult>
) {
  const { user, clientAssignedToken, token } = result.body;

  // Persist user token to local storage if it's already there. If it's there,
  // it means during the user's last login, the user opted-in to "remember me".
  if (UserSessionStorageFns.getUserToken()) {
    UserSessionStorageFns.saveUserToken(token);
    UserSessionStorageFns.saveClientAssignedToken(clientAssignedToken);
  }

  const states = [...useUserSessionFetchStore.getState().states];
  useUsersStore.getState().set(user.resourceId, user);

  if (states[0]) {
    const [params, fetchState] = states[0];
    states[0] = [
      params,
      {
        ...fetchState,
        data: {
          id: user.resourceId,
          initialized: true,
          other: { clientToken: clientAssignedToken, userToken: token },
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
          id: user.resourceId,
          initialized: true,
          other: { clientToken: clientAssignedToken, userToken: token },
        },
      },
    ]);
  }

  useUserSessionFetchStore.setState({ states });
}

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

export function useMergeMutationHookStates(...hooks: Array<Result<any, any>>) {
  let loading = false;
  let error: Error[] = [];
  const previousErrorsRef = React.useRef<Error[]>([]);

  hooks.forEach((hook) => {
    loading ||= hook.loading;
    if (hook.error) error.push(hook.error);
  });

  if (isEqual(previousErrorsRef.current, error)) {
    error = previousErrorsRef.current;
  } else {
    previousErrorsRef.current = error;
  }

  return { error, loading };
}
