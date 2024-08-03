"use client";

import { useWorkspaceAgentTokenFetchStore } from "./agentToken.ts";
import { useWorkspaceCollaboratorFetchStore } from "./collaborator.ts";
import { useWorkspaceFileFetchStore } from "./file.ts";
import { useWorkspaceFolderFetchStore } from "./folder.ts";
import { useWorkspacePermissionGroupFetchStore } from "./permissionGroup.ts";
import { useUserSessionFetchStore } from "./session.ts";
import { useUserCollaborationRequestFetchStore } from "./userCollaborationRequest.ts";
import { useUserWorkspaceFetchStore } from "./workspace.ts";
import { useWorkspaceCollaborationRequestFetchStore } from "./workspaceCollaborationRequest.ts";

export function clearFetchSingleResourceStores(
  props: { exclude: any[] } = { exclude: [] }
) {
  const stores = [
    useUserSessionFetchStore,
    useUserWorkspaceFetchStore,
    useUserCollaborationRequestFetchStore,
    useWorkspaceCollaborationRequestFetchStore,
    useWorkspaceCollaboratorFetchStore,
    useWorkspaceAgentTokenFetchStore,
    useWorkspaceFolderFetchStore,
    useWorkspaceFileFetchStore,
    useWorkspacePermissionGroupFetchStore,
  ];

  stores.forEach((s) => {
    if (!props.exclude.includes(s)) {
      s.getState().clear();
    }
  });
}
