import { IAgent } from "./system";

export interface IFile {
  resourceId: string;
  organizationId: string;
  folderId?: string;
  idPath: string[];
  namePath: string[];
  mimetype?: string;
  encoding?: string;
  size: number;
  createdBy: IAgent;
  createdAt: string;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: string;
  name: string;
  extension: string;
  description?: string;
  isPublic?: boolean;
  markedPublicAt?: string; // ISO date string
  markedPublicBy?: IAgent;
}

export interface IImageTransformationParams {
  width?: number;
  height?: number;
}

export interface IUpdateFileDetailsInput {
  description?: string;
  mimetype?: string;
}

export interface INewFileInput {
  description?: string;
  mimetype: string;
  encoding?: string;
  data: Buffer;
  path: string;
}
