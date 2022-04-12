import { IAgent, IPublicAccessOp } from "./system";

export interface IFile {
  resourceId: string;
  workspaceId: string;
  folderId?: string;
  idPath: string[];
  namePath: string[];
  mimetype?: string;
  encoding?: string;
  size: number;
  createdBy: IAgent;
  createdAt: Date | string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: Date | string;
  name: string;
  extension: string;
  description?: string;
  publicAccessOps: IPublicAccessOp[];
}

export interface IImageTransformationParams {
  width?: number;
  height?: number;
}

export interface IUpdateFileDetailsInput {
  description?: string;
  mimetype?: string;
}

export enum UploadFilePublicAccessActions {
  None = "none",
  Read = "read",
  ReadAndUpdate = "read-update",
  ReadUpdateAndDelete = "read-update-delete",
}

export interface IFileMatcher {
  filepath?: string;
  fileId?: string;
  workspaceId?: string;
}

export const fileConstants = {
  maxFileSizeInBytes: 10 * 1024 ** 3, // 10Gb
  fileNameAndExtensionSeparator: ".",
  maxMimeTypeCharLength: 100,
  maxEncodingCharLength: 100,
  maxExtensionCharLength: 100,
  maxFileWidth: 10000, // px
  maxFileHeight: 10000, // px
  uploadedFileFieldName: "data",
};
