import { isArray, last } from "lodash";
import { IAgent, IPublicAccessOp, IPublicAccessOpInput } from "./system";

export interface IFolder {
  resourceId: string;
  workspaceId: string;
  idPath: string[];
  namePath: string[];
  parentId?: string;
  createdBy: IAgent;
  createdAt: Date | string;
  // maxFileSizeInBytes: number;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: Date | string;
  name: string;
  description?: string;
  publicAccessOps: IPublicAccessOp[];
}

export interface INewFolderInput {
  folderpath: string;
  description?: string;
  publicAccessOps?: IPublicAccessOpInput[];
}

export interface IUpdateFolderInput {
  description?: string;
  publicAccessOps?: IPublicAccessOpInput[];
}

export interface IFolderMatcher {
  folderpath?: string;
  folderId?: string;
}

export const folderConstants = {
  minFolderNameLength: 1,
  maxFolderNameLength: 70,
  maxFolderDepth: 10,
  nameSeparator: "/",
};

export function addRootnameToPath<
  T extends string | string[] = string | string[]
>(path: T, workspaceRootname: string | string[]): T {
  const rootname = isArray(workspaceRootname)
    ? last(workspaceRootname)
    : workspaceRootname;

  if (isArray(path)) {
    return <T>[rootname, ...path];
  }

  return <T>`${rootname}${folderConstants.nameSeparator}${path}`;
}
