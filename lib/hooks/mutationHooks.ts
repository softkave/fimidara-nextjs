"use client";

import type { Result } from "ahooks/lib/useRequest/src/types";
import { isEqual, uniq } from "lodash-es";
import React from "react";
import {
  getPrivateFimidaraEndpointsUsingUserToken,
  getPublicFimidaraEndpointsUsingUserToken,
} from "../api/fimidaraEndpoints";
import { AnyFn } from "../utils/types";
import {
  useResolveEntityPermissionsFetchStore,
  useUserWorkspacesFetchStore,
  useWorkspaceAgentTokensFetchStore,
  useWorkspaceCollaborationRequestsFetchStore,
  useWorkspaceFilesFetchStore,
  useWorkspaceFoldersFetchStore,
  useWorkspacePermissionGroupsFetchStore,
} from "./fetchHooks";
import { FetchResourceZustandStore } from "./fetchHooks/makeFetchResourceStoreHook.ts";
import { ResourceZustandStore } from "./makeResourceListStore";
import { makeEndpointMutationHook } from "./mutationHooks/makeEndpointMutationHook.ts";
import { updateUserSessionWhenResultIsLoginResult } from "./mutationHooks/updateUserSessionWhenResultIsLoginResult.ts";
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

export const useUserSignupMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.users.signup,
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
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.users.updateUser,
  (data) => {
    useUsersStore.getState().set(data.user.resourceId, data.user);
  }
);
export const useUserCollaborationRequestResponseMutationHook =
  makeEndpointMutationHook(
    getPrivateFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.respondToRequest
  );
export const useWorkspaceAgentTokenAddMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.agentTokens.addToken,
  (result) =>
    insertInFetchStoreAddMutationFn(
      result.token,
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
        .set(data.token.resourceId, data.token);
    }
  );
export const useWorkspaceAgentTokenDeleteMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.agentTokens.deleteToken,
    (data, params) => {
      const body = params[0];
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
      const body = params[0];

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
    if (params[0].fileId) {
      useWorkspaceFilesStore
        .getState()
        .set(result.file.resourceId, result.file);
    } else {
      insertInFetchStoreAddMutationFn(
        result.file,
        useWorkspaceFilesStore,
        useWorkspaceFilesFetchStore,
        (resource, params) => {
          // TODO: handle folderpath
          // Parent ID is set to null for files and folders without parent folder,
          // and for those, parentId is undefined.
          if (resource.parentId === null) {
            return params.folderId === undefined;
          } else {
            return params.folderId === resource.parentId;
          }
        }
      );
    }
  }
);
export const useWorkspaceFileUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.files.updateFileDetails,
  (data) => {
    useWorkspaceFilesStore.getState().set(data.file.resourceId, data.file);
  }
);
export const useWorkspaceFileDeleteMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.files.deleteFile,
  (data, params) => {
    const body = params[0];
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
      result.folder,
      useWorkspaceFoldersStore,
      useWorkspaceFoldersFetchStore,
      (resource, params) => {
        // TODO: handle folderpath
        // Parent ID is set to null for files and folders without parent folder,
        // and for those, parentId is undefined.
        if (resource.parentId === null) {
          return params.folderId === undefined;
        } else {
          return params.folderId === resource.parentId;
        }
      }
    )
);
export const useWorkspaceFolderUpdateMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.folders.updateFolder,
  (data) => {
    useWorkspaceFoldersStore
      .getState()
      .set(data.folder.resourceId, data.folder);
  }
);
export const useWorkspaceFolderDeleteMutationHook = makeEndpointMutationHook(
  getPublicFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.folders.deleteFolder,
  (data, params) => {
    const body = params[0];
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
        result.permissionGroup,
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
        .set(data.permissionGroup.resourceId, data.permissionGroup);
    }
  );
export const useWorkspacePermissionGroupDeleteMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.permissionGroups.deletePermissionGroup,
    (data, params) => {
      const body = params[0];
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
    (endpoints) => endpoints.permissionGroups.unassignPermissionGroups
  );
export const useWorkspaceCollaborationRequestUpdateMutationHook =
  makeEndpointMutationHook(
    getPublicFimidaraEndpointsUsingUserToken,
    (endpoints) => endpoints.collaborationRequests.updateRequest,
    (data) => {
      useWorkspaceCollaborationRequestsStore
        .getState()
        .set(data.request.resourceId, data.request);
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
      const body = params[0];
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
        result.request,
        useWorkspaceCollaborationRequestsStore,
        useWorkspaceCollaborationRequestsFetchStore,
        workspaceIdMatch
      )
  );
export const useWorkspaceAddMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.workspaces.addWorkspace,
  (result) =>
    insertInFetchStoreAddMutationFn(
      result.workspace,
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
      .set(data.workspace.resourceId, data.workspace);
  }
);
// export const useWorkspaceDeleteMutationHook = makeEndpointMutationHook(
//   getPublicFimidaraEndpointsUsingUserToken,
//   (endpoints) => endpoints.workspaces.deleteWorkspace,
//   (data, params) => {
//     const body = params[0]?;
//     let resourceId = body?.workspaceId;

//     if (resourceId) {
//       deleteWorkspaceChildren(resourceId);
//       useWorkspacesStore.getState().remove(resourceId);
//     }
//   }
// );
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
export const useWaitlistedUsersUpgradeMutationHook = makeEndpointMutationHook(
  getPrivateFimidaraEndpointsUsingUserToken,
  (endpoints) => endpoints.internals.upgradeWaitlistedUsers
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
        const idList = uniq(
          [resource.resourceId].concat(state?.data?.idList ?? [])
        );
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
