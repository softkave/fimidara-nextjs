import { IAgent, IPublicAccessOp, IPublicAccessOpInput } from "./system";

export interface IFolder {
  resourceId: string;
  organizationId: string;
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
  folderPath: string;
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
  folderPath?: string;
  folderId?: string;
  organizationId?: string;
}

export const folderConstants = {
  minFolderNameLength: 1,
  maxFolderNameLength: 50,
  maxFolderDepth: 10,
  nameSeparator: "/",
};
