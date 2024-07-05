import { FimidaraPermissionAction, FimidaraResourceType } from "fimidara";
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
    "https://api.fimidara.com"
  ),
  minPage: 0,
  minPageSize: 1,
  maxPageSize: 1000,
};

export function getWorkspaceTypeList(): FimidaraResourceType[] {
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
    "fileBackendConfig",
    "fileBackendMount",
  ];
}

export function getFolderTypeList(): FimidaraResourceType[] {
  return ["*", "folder", "file"];
}

export const kActionLabel: Record<FimidaraPermissionAction, string> = {
  "*": "Every action",
  updateWorkspace: "Update workspace",
  deleteWorkspace: "Delete workspace",
  readWorkspace: "Read workspace",
  addFolder: "Add folder",
  readFolder: "Read folder",
  updateFolder: "Update folder",
  transferFolder: "Transfer folder",
  deleteFolder: "Delete folder",
  uploadFile: "Upload file",
  readFile: "Read file",
  transferFile: "Transfer file",
  deleteFile: "Delete file",
  addCollaborator: "Add collaborator",
  readCollaborator: "Read collaborator",
  removeCollaborator: "Remove collaborator",
  readCollaborationRequest: "Read collaboration request",
  revokeCollaborationRequest: "Revoke collaboration request",
  updateCollaborationRequest: "Update collaboration request",
  deleteCollaborationRequest: "Delete collaboration request",
  updatePermission: "Update permission",
  readPermission: "Read permission",
  addAgentToken: "Add agent token",
  readAgentToken: "Read agent token",
  updateAgentToken: "Update agent token",
  deleteAgentToken: "Delete agent token",
  addTag: "Add tag",
  readTag: "Read tag",
  updateTag: "Update tag",
  deleteTag: "Delete tag",
  assignTag: "Assign tag",
  readUsageRecord: "Read usage record",
  addFileBackendConfig: "Add backend config",
  deleteFileBackendConfig: "Delete backend config",
  readFileBackendConfig: "Read backend config",
  updateFileBackendConfig: "Update backend config",
  addFileBackendMount: "Add backend mount",
  deleteFileBackendMount: "Delete backend mount",
  ingestFileBackendMount: "Ingest backend mount",
  readFileBackendMount: "Read backend mount",
  updateFileBackendMount: "Update backend mount",
};

export const kResourceTypeLabel: Record<FimidaraResourceType, string> = {
  "*": "Every resource",
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
  system: "System",
  public: "Public",
  job: "Job",
  presignedPath: "Presigned path",
  fileBackendConfig: "Backend config",
  fileBackendMount: "Backend mount",
};

export const kResourceTypeToPermittedActions: Record<
  FimidaraResourceType,
  /** group inherits from item */
  { item: FimidaraPermissionAction[]; group?: FimidaraPermissionAction[] }
> = {
  "*": { item: ["*"] },
  workspace: {
    item: ["*", "updateWorkspace", "readWorkspace", "deleteWorkspace"],
  },
  collaborationRequest: {
    item: [
      "*",
      "updateCollaborationRequest",
      "readCollaborationRequest",
      "revokeCollaborationRequest",
      "deleteCollaborationRequest",
    ],
    group: ["addCollaborator"],
  },
  agentToken: {
    item: ["*", "updateAgentToken", "readAgentToken", "deleteAgentToken"],
    group: ["addAgentToken"],
  },
  permissionGroup: { item: ["*", "updatePermission", "readPermission"] },
  permissionItem: { item: ["*", "updatePermission", "readPermission"] },
  folder: {
    item: [
      "*",
      "addFolder",
      "updateFolder",
      "transferFolder",
      "readFolder",
      "deleteFolder",
    ],
  },
  file: { item: ["*", "uploadFile", "transferFile", "readFile", "deleteFile"] },
  user: { item: ["*", "removeCollaborator", "readCollaborator"] },
  tag: {
    item: ["*", "updateTag", "readTag", "deleteTag", "assignTag"],
    group: ["addTag"],
  },
  usageRecord: { item: ["*", "readUsageRecord"] },
  fileBackendConfig: {
    item: [
      "*",
      "updateFileBackendConfig",
      "readFileBackendConfig",
      "deleteFileBackendConfig",
    ],
    group: ["addFileBackendConfig"],
  },
  fileBackendMount: {
    item: [
      "*",
      "updateFileBackendMount",
      "readFileBackendMount",
      "deleteFileBackendMount",
    ],
    group: ["addFileBackendMount"],
  },
  system: { item: [] },
  public: { item: [] },
  job: { item: [] },
  presignedPath: { item: [] },
};

export const kResourceTypeToChildrenTypesMap: Record<
  FimidaraResourceType,
  FimidaraResourceType[]
> = {
  "*": ["*"],
  workspace: [
    "collaborationRequest",
    "agentToken",
    "permissionGroup",
    "permissionItem",
    "folder",
    "file",
    "user",
    "tag",
    "usageRecord",
    "fileBackendConfig",
    "fileBackendMount",
  ],
  collaborationRequest: [],
  agentToken: [],
  permissionGroup: [],
  permissionItem: [],
  folder: ["folder", "file"],
  file: [],
  user: [],
  tag: [],
  usageRecord: [],
  fileBackendConfig: [],
  fileBackendMount: [],
  system: [],
  public: [],
  job: [],
  presignedPath: [],
};

/** resource types to prevent UI actions on, for whatever reason */
export const kDisabledResourceTypes: FimidaraResourceType[] = [
  // server/internal resource types
  "*",
  "job",
  "presignedPath",
  "public",
  "system",

  // we do not fully support tags yet
  "tag",
];

/** actions to prevent UI actions on, for whatever reason */
export const kDisabledPermissions: FimidaraPermissionAction[] = [
  // we don't full support tags yet
  "addTag",
  "updateTag",
  "readTag",
  "deleteTag",
  "assignTag",

  // we don't support transfer file and folder yet
  "transferFile",
  "transferFolder",

  // we don't support manually ingesting mounts yet. it's automatically
  // triggered in the server for now
  "ingestFileBackendMount",
];

export const appRootPaths = {
  home: "/",
  internal: "/internal",
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
export const appInternalPaths = {
  waitlist: `${appRootPaths.internal}/waitlist`,
  users: `${appRootPaths.internal}/users`,
  workspaces: `${appRootPaths.internal}/workspaces`,
};
export const appUserPaths = {
  settings: "/settings",
  requests: "/collaboration-requests",
  request(id: string) {
    return `${this.requests}/${id}`;
  },
  workspaces: "/workspaces",
};
