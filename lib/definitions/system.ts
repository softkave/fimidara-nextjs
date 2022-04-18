import { defaultTo } from "lodash";

if (!process.env.NEXT_PUBLIC_WORKSPACE_ID) {
  throw new Error("NEXT_PUBLIC_WORKSPACE_ID is not set");
}

export const systemConstants = {
  maxNameLength: 150,
  maxDescriptionLength: 500,
  appShortName: "files",
  tokenQueryKey: "t",
  phoneQueryKey: "p",
  workspaceId: process.env.NEXT_PUBLIC_WORKSPACE_ID,
  userImagesFolder: defaultTo(
    process.env.NEXT_PUBLIC_USER_IMAGES_FOLDER,
    "/files/images/users"
  ),
  workspaceImagesFolder: defaultTo(
    process.env.NEXT_PUBLIC_WORKSPACE_IMAGES_FOLDER,
    "/files/images/workspaces"
  ),
  serverAddr: defaultTo(
    process.env.NEXT_PUBLIC_SERVER_ADDR,
    "http://localhost:5000"
  ),
};

export interface ISelectedIdRouteMatch {
  selected?: string;
}

export function getSelectedItemPath(path: string) {
  return `${path}/:selected`;
}

export enum SessionAgentType {
  User = "user",
  ProgramAccessToken = "program-access-token",
  ClientAssignedToken = "client-assigned-token",
}

export interface IPublicAccessOpInput {
  action: BasicCRUDActions;
  resourceType: AppResourceType;
}

export interface IPublicAccessOp {
  action: BasicCRUDActions;
  resourceType: AppResourceType;
  markedAt: Date | string;
  markedBy: IAgent;
}

export interface IAgent {
  agentId: string;
  agentType: SessionAgentType;
}

export enum AppResourceType {
  All = "*",
  Workspace = "workspace",
  CollaborationRequest = "collaboration-request",
  ProgramAccessToken = "program-access-token",
  ClientAssignedToken = "client-assigned-token",
  UserToken = "user-token",
  PresetPermissionsGroup = "preset-permissions-group",
  PermissionItem = "permission-item",
  Folder = "folder",
  File = "file",
  User = "user",
}

export const appResourceTypeLabel: Record<AppResourceType, string> = {
  [AppResourceType.All]: "Every resource",
  [AppResourceType.Workspace]: "Workspace",
  [AppResourceType.CollaborationRequest]: "Collaboration request",
  [AppResourceType.ProgramAccessToken]: "Program access token",
  [AppResourceType.ClientAssignedToken]: "Client assigned token",
  [AppResourceType.UserToken]: "User token",
  [AppResourceType.PresetPermissionsGroup]: "Preset permissions group",
  [AppResourceType.PermissionItem]: "Permission item",
  [AppResourceType.Folder]: "Folder",
  [AppResourceType.File]: "File",
  [AppResourceType.User]: "User",
};

export enum BasicCRUDActions {
  All = "*",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",

  GrantPermission = "grant-permission",
}

export function getActions(type: AppResourceType, includeWildcard = false) {
  const actions = [
    BasicCRUDActions.Create,
    BasicCRUDActions.Read,
    BasicCRUDActions.Update,
    BasicCRUDActions.Delete,
  ];

  if (includeWildcard) {
    // unshift instead of push for ordered rendering
    // in grant permission form. it may just be better to
    // sort in there, but until then, we unshift.
    actions.unshift(BasicCRUDActions.All);
  }

  if (type === AppResourceType.Workspace || type === AppResourceType.All) {
    actions.push(BasicCRUDActions.GrantPermission);
  }

  return actions;
}

export const actionLabel: Record<BasicCRUDActions, string> = {
  [BasicCRUDActions.All]: "Every action",
  [BasicCRUDActions.Create]: "Create",
  [BasicCRUDActions.Read]: "Read",
  [BasicCRUDActions.Update]: "Update",
  [BasicCRUDActions.Delete]: "Delete",
  [BasicCRUDActions.GrantPermission]: "Grant permission",
};

export interface IAppError extends Error {
  field?: string;
  action?: string;
  value?: any;
}

export const appRootPaths = {
  home: "/",
  app: "/app",
  account: "/account",
};

export const appWorkspacePaths = {
  workspaces: appRootPaths.app + "/workspaces",
  createWorkspaceForm: appRootPaths.app + "/workspaces/form",
  workspace: (workspaceId: string) =>
    appRootPaths.app + `/workspaces/${workspaceId}`,
  editWorkspaceForm(workspaceId: string) {
    return `${this.workspace(workspaceId)}/form`;
  },

  // File
  fileList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/files`;
  },
  file(workspaceId: string, fileId: string) {
    return `${this.fileList(workspaceId)}/${fileId}`;
  },
  fileForm(workspaceId: string, fileId: string) {
    return `${this.file(workspaceId, fileId)}/update-file`;
  },
  createFileForm(workspaceId: string, folderId?: string) {
    if (folderId) {
      return `${this.fileList(workspaceId)}/create-file-in-folder/${folderId}`;
    } else {
      return `${this.fileList(workspaceId)}/create-file`;
    }
  },

  // Folder
  rootFolderList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/folders`;
  },
  folder(workspaceId: string, folderId: string) {
    return `${this.rootFolderList(workspaceId)}/${folderId}`;
  },
  folderPage(workspaceId: string, folderId: string) {
    return `${this.workspace(workspaceId)}/folder-page/${folderId}`;
  },
  folderForm(workspaceId: string, folderId: string) {
    return `${this.folder(workspaceId, folderId)}/update-folder`;
  },
  createFolderForm(workspaceId: string, folderId?: string) {
    if (folderId) {
      return `${this.rootFolderList(
        workspaceId
      )}/create-folder-with-parent/${folderId}`;
    } else {
      return `${this.rootFolderList(workspaceId)}/create-folder`;
    }
  },

  // Collaborator
  collaboratorList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/collaborators`;
  },
  collaborator(workspaceId: string, collaboratorId: string) {
    return `${this.collaboratorList(workspaceId)}/${collaboratorId}`;
  },
  collaboratorForm(workspaceId: string, collaboratorId: string) {
    return `${this.collaborator(workspaceId, collaboratorId)}/form`;
  },

  // Request
  requestList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/requests`;
  },
  createRequestForm(workspaceId: string) {
    return `${this.requestList(workspaceId)}/form`;
  },
  request(workspaceId: string, requestId: string) {
    return `${this.requestList(workspaceId)}/${requestId}`;
  },
  requestForm(workspaceId: string, requestId: string) {
    return `${this.request(workspaceId, requestId)}/form`;
  },

  // Program token
  programTokenList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/program-tokens`;
  },
  createProgramTokenForm(workspaceId: string) {
    return `${this.programTokenList(workspaceId)}/form`;
  },
  programToken(workspaceId: string, tokenId: string) {
    return `${this.programTokenList(workspaceId)}/${tokenId}`;
  },
  programTokenForm(workspaceId: string, tokenId: string) {
    return `${this.programToken(workspaceId, tokenId)}/form`;
  },

  // Client token
  clientTokenList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/client-tokens`;
  },
  createClientTokenForm(workspaceId: string) {
    return `${this.clientTokenList(workspaceId)}/form`;
  },
  clientToken(workspaceId: string, tokenId: string) {
    return `${this.clientTokenList(workspaceId)}/${tokenId}`;
  },
  clientTokenForm(workspaceId: string, tokenId: string) {
    return `${this.clientToken(workspaceId, tokenId)}/form`;
  },

  // Preset
  permissionGroupList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/permission-groups`;
  },
  createPermissionGroupForm(workspaceId: string) {
    return `${this.permissionGroupList(workspaceId)}/form`;
  },
  permissionGroup(workspaceId: string, presetId: string) {
    return `${this.permissionGroupList(workspaceId)}/${presetId}`;
  },
  permissionGroupForm(workspaceId: string, presetId: string) {
    return `${this.permissionGroup(workspaceId, presetId)}/form`;
  },
};

export const appAccountPaths = {
  signup: appRootPaths.account + "/signup",
  login: appRootPaths.account + "/login",
  verifyEmail: appRootPaths.account + "/verify-email",
  forgotPassword: appRootPaths.account + "/forgot-password",
  changePassword: appRootPaths.account + "/change-password",
  settings: appRootPaths.account + "/settings",
};

export const appUserPaths = {
  settings: appRootPaths.app + "/user/settings",
};

export const appRequestsPaths = {
  requests: appRootPaths.app + "/requests",
};
