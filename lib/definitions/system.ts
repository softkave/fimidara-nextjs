import { defaultTo } from "lodash";
import { getClientAddr } from "../api/addr";

export const systemConstants = {
  maxNameLength: 150,
  maxDescriptionLength: 500,
  domainName: getClientAddr(),
  appShortName: "files",
  tokenQueryKey: "t",
  phoneQueryKey: "p",
  organizationId: defaultTo(
    process.env.ORGANIZATION_ID,
    "8k4hfTVXx7c46jo6Q-IyD"
  ),
  userImagesFolder: defaultTo(
    process.env.USER_IMAGES_FOLDER,
    "/files/images/users"
  ),
  orgImagesFolder: defaultTo(
    process.env.ORG_IMAGES_FOLDER,
    "/files/images/orgs"
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
  Organization = "organization",
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
  [AppResourceType.Organization]: "Organization",
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

export const appOrgPaths = {
  orgs: appRootPaths.app + "/orgs",
  createOrgForm: appRootPaths.app + "/orgs/form",
  org: (orgId: string) => appRootPaths.app + `/orgs/${orgId}`,
  editOrgForm(orgId: string) {
    return `${this.org(orgId)}/form`;
  },

  // File
  fileList(orgId: string) {
    return `${this.org(orgId)}/files`;
  },
  file(orgId: string, fileId: string) {
    return `${this.fileList(orgId)}/${fileId}`;
  },
  fileForm(orgId: string, fileId: string) {
    return `${this.file(orgId, fileId)}/update-file`;
  },
  createFileForm(orgId: string, folderId?: string) {
    if (folderId) {
      return `${this.fileList(orgId)}/create-file-in-folder/${folderId}`;
    } else {
      return `${this.fileList(orgId)}/create-file`;
    }
  },

  // Folder
  rootFolderList(orgId: string) {
    return `${this.org(orgId)}/folders`;
  },
  folder(orgId: string, folderId: string) {
    return `${this.rootFolderList(orgId)}/${folderId}`;
  },
  folderPage(orgId: string, folderId: string) {
    return `${this.org(orgId)}/folder-page/${folderId}`;
  },
  folderForm(orgId: string, folderId: string) {
    return `${this.folder(orgId, folderId)}/update-folder`;
  },
  createFolderForm(orgId: string, folderId?: string) {
    if (folderId) {
      return `${this.rootFolderList(
        orgId
      )}/create-folder-with-parent/${folderId}`;
    } else {
      return `${this.rootFolderList(orgId)}/create-folder`;
    }
  },

  // Collaborator
  collaboratorList(orgId: string) {
    return `${this.org(orgId)}/collaborators`;
  },
  collaborator(orgId: string, collaboratorId: string) {
    return `${this.collaboratorList(orgId)}/${collaboratorId}`;
  },
  collaboratorForm(orgId: string, collaboratorId: string) {
    return `${this.collaborator(orgId, collaboratorId)}/form`;
  },

  // Request
  requestList(orgId: string) {
    return `${this.org(orgId)}/requests`;
  },
  createRequestForm(orgId: string) {
    return `${this.requestList(orgId)}/form`;
  },
  request(orgId: string, requestId: string) {
    return `${this.requestList(orgId)}/${requestId}`;
  },
  requestForm(orgId: string, requestId: string) {
    return `${this.request(orgId, requestId)}/form`;
  },

  // Program token
  programTokenList(orgId: string) {
    return `${this.org(orgId)}/program-tokens`;
  },
  createProgramTokenForm(orgId: string) {
    return `${this.programTokenList(orgId)}/form`;
  },
  programToken(orgId: string, tokenId: string) {
    return `${this.programTokenList(orgId)}/${tokenId}`;
  },
  programTokenForm(orgId: string, tokenId: string) {
    return `${this.programToken(orgId, tokenId)}/form`;
  },

  // Client token
  clientTokenList(orgId: string) {
    return `${this.org(orgId)}/client-tokens`;
  },
  createClientTokenForm(orgId: string) {
    return `${this.clientTokenList(orgId)}/form`;
  },
  clientToken(orgId: string, tokenId: string) {
    return `${this.clientTokenList(orgId)}/${tokenId}`;
  },
  clientTokenForm(orgId: string, tokenId: string) {
    return `${this.clientToken(orgId, tokenId)}/form`;
  },

  // Preset
  permissionGroupList(orgId: string) {
    return `${this.org(orgId)}/permission-groups`;
  },
  createPermissionGroupForm(orgId: string) {
    return `${this.permissionGroupList(orgId)}/form`;
  },
  permissionGroup(orgId: string, presetId: string) {
    return `${this.permissionGroupList(orgId)}/${presetId}`;
  },
  permissionGroupForm(orgId: string, presetId: string) {
    return `${this.permissionGroup(orgId, presetId)}/form`;
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
