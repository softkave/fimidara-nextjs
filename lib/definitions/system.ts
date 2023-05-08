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

export function getActions(
  type: WorkspaceAppResourceType,
  includeWildcard = false
) {
  const actions: AppActionType[] = ["create", "read", "update", "delete"];

  if (includeWildcard) {
    // unshift instead of push for ordered rendering
    // in grant permission form. it may just be better to
    // sort in there, but until then, we unshift.
    actions.unshift("*");
  }

  if (type === "workspace" || type === "*") {
    actions.push("grantPermission");
  }

  return actions;
}

export const actionLabel: Record<AppActionType, string> = {
  ["*"]: "Every action",
  ["create"]: "Create",
  ["read"]: "Read",
  ["update"]: "Update",
  ["delete"]: "Delete",
  ["grantPermission"]: "Grant permission",
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
  rootFolderList(workspaceId: string) {
    return `${this.workspace(workspaceId)}/folders`;
  },
  folder(workspaceId: string, folderId: string) {
    return `${this.rootFolderList(workspaceId)}/${folderId}`;
  },
  folderForm(workspaceId: string, folderId: string) {
    return `${this.folder(workspaceId, folderId)}/update`;
  },
  createFolderForm(workspaceId: string, folderId?: string) {
    if (folderId) {
      return `${this.rootFolderList(workspaceId)}/new/${folderId}`;
    } else {
      return `${this.rootFolderList(workspaceId)}/new`;
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
    return `${this.workspace(workspaceId)}/requests`;
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
