import { defaultTo } from "lodash";

if (!process.env.NEXT_PUBLIC_WORKSPACE_ID) {
  throw new Error("NEXT_PUBLIC_WORKSPACE_ID is not set");
}

const workspaceRootname = defaultTo(
  process.env.NEXT_PUBLIC_WORKSPACE_ROOTNAME,
  "fimidara"
);

export const systemConstants = {
  workspaceRootname,
  maxNameLength: 150,
  maxDescriptionLength: 500,
  appShortName: "fimidara",
  tokenQueryKey: "t",
  confirmEmailTokenQueryParam: "cet",
  defaultPage: 0,
  defaultPageSize: 10,
  workspaceId: process.env.NEXT_PUBLIC_WORKSPACE_ID,
  userImagesFolder: defaultTo(
    process.env.NEXT_PUBLIC_USER_IMAGES_FOLDER,
    `/${workspaceRootname}/files/images/users`
  ),
  workspaceImagesFolder: defaultTo(
    process.env.NEXT_PUBLIC_WORKSPACE_IMAGES_FOLDER,
    `/${workspaceRootname}/files/images/workspaces`
  ),
  endpointInfoPath: defaultTo(
    process.env.ENDPOINT_INFO_PATH,
    `/components/docs/raw/endpoints/v1`
  ),
  serverAddr: defaultTo(
    process.env.NEXT_PUBLIC_SERVER_ADDR,
    "http://localhost:5000"
  ),
  complaintEmailAddress: "abayomi@softkave.com",
  demoQueryKey: "isDemo",
  demoUserEmail: "boards-demo-user@softkave.com",
  demoUserName: "Demo User",
  minPage: 0,
  minPageSize: 1,
  maxPageSize: 1000,
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
  PermissionGroup = "permission-group",
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
  [AppResourceType.PermissionGroup]: "Permission group",
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

export const appRootPaths = {
  home: "/",
};

export const appWorkspacePaths = {
  workspaces: "/workspaces",
  createWorkspaceForm: "/workspaces/form",
  workspace: (workspaceId: string) => `/workspaces/${workspaceId}`,
  updateWorkspaceForm(workspaceId: string) {
    return `${this.workspace(workspaceId)}/update`;
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

  // Agent token
  agentTokenList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/agent-tokens`;
  },
  createAgentTokenForm(workspaceId: string) {
    return `${this.agentTokenList(workspaceId)}/form`;
  },
  agentToken(workspaceId: string, tokenId: string) {
    return `${this.agentTokenList(workspaceId)}/${tokenId}`;
  },
  agentTokenForm(workspaceId: string, tokenId: string) {
    return `${this.agentToken(workspaceId, tokenId)}/form`;
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

  // permission group
  permissionGroupList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/permission-groups`;
  },
  createPermissionGroupForm(workspaceId: string) {
    return `${this.permissionGroupList(workspaceId)}/form`;
  },
  permissionGroup(workspaceId: string, permissiongroupId: string) {
    return `${this.permissionGroupList(workspaceId)}/${permissiongroupId}`;
  },
  permissionGroupForm(workspaceId: string, permissiongroupId: string) {
    return `${this.permissionGroup(workspaceId, permissiongroupId)}/form`;
  },

  // usage records
  usage(workspaceId: string) {
    return `${this.workspace(workspaceId)}/usage`;
  },
};

export const appAccountPaths = {
  signup: "/signup",
  login: "/login",
  loginWithReturnPath(returnTo: string) {
    return `${this.login}?returnTo=${encodeURIComponent(returnTo)}`;
  },

  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  changePassword: "/change-password",
};

export const appUserPaths = {
  settings: "/settings",
  requests: "/collaboration-requests",
  request(id: string) {
    return `${this.requests}/${id}`;
  },
  workspaces: "/workspaces",
};
