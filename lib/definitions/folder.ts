import { IAgent, IPublicAccessOp, IPublicAccessOpInput } from "./system";

export interface IFolder {
  resourceId: string;
  workspaceId: string;
  idPath: string[];
  namePath: string[];
  parentId?: string;
  createdBy: IAgent;
  createdAt: Date | string;
  maxFileSizeInBytes: number;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: Date | string;
  name: string;
  description?: string;
  publicAccessOps: IPublicAccessOp[];
}

export interface INewFolderInput {
  folderpath: string;
  description?: string;
  maxFileSizeInBytes?: number;
  publicAccessOps?: IPublicAccessOpInput[];
}

export interface IUpdateFolderInput {
  description?: string;
  maxFileSizeInBytes?: number;
  publicAccessOps?: IPublicAccessOpInput[];
}

export interface IFolderMatcher {
  folderpath?: string;
  folderId?: string;
  workspaceId?: string;
}

export const folderConstants = {
  minFolderNameLength: 1,
  maxFolderNameLength: 70,
  maxFolderDepth: 10,
  nameSeparator: "/",
};
