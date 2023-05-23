import { AppActionType, WorkspaceAppResourceType } from "fimidara";
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
  confirmEmailTokenQueryParam: "ct",
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

export function getWorkspaceActionList(
  type?: WorkspaceAppResourceType
): AppActionType[] {
  if (type === "permissionItem") {
    return ["*", "create", "read", "update", "delete", "grantPermission"];
  }

  return ["*", "create", "read", "update", "delete"];
}

export function getWorkspaceTypeList(): WorkspaceAppResourceType[] {
  return [
    "*",
    "workspace",
    "collaborationRequest",
    "agentToken",
    "permissionGroup",
    "permissionItem",
    "folder",
    "file",
    "user",
    "tag",
    "usageRecord",
  ];
}

export function getFolderTypeList(): WorkspaceAppResourceType[] {
  return ["*", "folder", "file"];
}

export const actionLabel: Record<AppActionType, string> = {
  ["*"]: "Every action",
  ["create"]: "Create",
  ["read"]: "Read",
  ["update"]: "Update",
  ["delete"]: "Delete",
  ["grantPermission"]: "Grant permission",
};
export const workspaceResourceTypeLabel: Record<
  WorkspaceAppResourceType,
  string
> = {
  "*": "Wildcard",
  workspace: "Workspace",
  collaborationRequest: "Collaboration request",
  agentToken: "Agent token",
  permissionGroup: "Permission group",
  permissionItem: "Permission item",
  folder: "Folder",
  file: "File",
  user: "User",
  tag: "Tag",
  usageRecord: "Usage record",
};

export const appRootPaths = {
  home: "/",
};

export const appWorkspacePaths = {
  workspaces: "/workspaces",
  createWorkspaceForm: "/workspaces/new",
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
    return `${this.file(workspaceId, fileId)}/update`;
  },
  createFileForm(workspaceId: string, folderId?: string) {
    if (folderId) {
      return `${this.fileList(workspaceId)}/new/${folderId}`;
    } else {
      return `${this.fileList(workspaceId)}/new`;
    }
  },

  // Folder
  folderList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/folders`;
  },
  folder(workspaceId: string, folderId: string) {
    return `${this.folderList(workspaceId)}/${folderId}`;
  },
  folderForm(workspaceId: string, folderId: string) {
    return `${this.folder(workspaceId, folderId)}/update`;
  },
  createFolderForm(workspaceId: string, folderId?: string) {
    if (folderId) {
      return `${this.folderList(workspaceId)}/new/${folderId}`;
    } else {
      return `${this.folderList(workspaceId)}/new`;
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
    return `${this.collaborator(workspaceId, collaboratorId)}/new`;
  },

  // Request
  requestList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/collaboration-requests`;
  },
  createRequestForm(workspaceId: string) {
    return `${this.requestList(workspaceId)}/new`;
  },
  request(workspaceId: string, requestId: string) {
    return `${this.requestList(workspaceId)}/${requestId}`;
  },
  requestForm(workspaceId: string, requestId: string) {
    return `${this.request(workspaceId, requestId)}/update`;
  },

  // Agent token
  agentTokenList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/agent-tokens`;
  },
  createAgentTokenForm(workspaceId: string) {
    return `${this.agentTokenList(workspaceId)}/new`;
  },
  agentToken(workspaceId: string, tokenId: string) {
    return `${this.agentTokenList(workspaceId)}/${tokenId}`;
  },
  agentTokenForm(workspaceId: string, tokenId: string) {
    return `${this.agentToken(workspaceId, tokenId)}/update`;
  },

  // permission group
  permissionGroupList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/permission-groups`;
  },
  createPermissionGroupForm(workspaceId: string) {
    return `${this.permissionGroupList(workspaceId)}/new`;
  },
  permissionGroup(workspaceId: string, permissiongroupId: string) {
    return `${this.permissionGroupList(workspaceId)}/${permissiongroupId}`;
  },
  permissionGroupForm(workspaceId: string, permissiongroupId: string) {
    return `${this.permissionGroup(workspaceId, permissiongroupId)}/update`;
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
