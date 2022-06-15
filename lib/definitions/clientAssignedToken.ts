import {
  IAssignedPermissionGroup,
  IPermissionGroupInput,
} from "./permissionGroups";
import { IAgent } from "./system";

export interface IClientAssignedToken {
  resourceId: string;
  providedResourceId?: string;
  createdAt: string;
  createdBy: IAgent;
  lastUpdatedBy?: IAgent;
  lastUpdatedAt?: string;
  workspaceId: string;
  version: number;
  permissionGroups: IAssignedPermissionGroup[];
  issuedAt: string;
  expires?: number;
  tokenStr: string;
}

export interface INewClientAssignedTokenInput {
  expires?: number;
  permissionGroups?: IPermissionGroupInput[];
  providedResourceId?: string;
}

export const clientAssignedTokenConstants = { providedResourceMaxLength: 300 };
