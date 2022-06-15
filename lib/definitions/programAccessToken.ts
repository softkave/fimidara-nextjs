import {
  IAssignedPermissionGroup,
  IPermissionGroupInput,
} from "./permissionGroups";
import { IAgent } from "./system";

export interface IProgramAccessToken {
  resourceId: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: IAgent;
  workspaceId: string;
  permissionGroups: IAssignedPermissionGroup[];
  lastUpdatedAt?: string;
  lastUpdatedBy?: IAgent;
  tokenStr: string;
}

export interface INewProgramAccessTokenInput {
  name: string;
  description?: string;
  permissionGroups?: IPermissionGroupInput[];
}

export type IUpdateProgramAccessTokenInput =
  Partial<INewProgramAccessTokenInput>;
