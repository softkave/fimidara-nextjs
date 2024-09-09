export const kAppWorkspacePaths = {
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
  folder(workspaceId: string, folderId?: string | null) {
    if (!folderId) {
      return `${this.workspace(workspaceId)}/folders`;
    }

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
