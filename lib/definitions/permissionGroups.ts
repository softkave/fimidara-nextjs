import { IAgent } from "./system";

export interface IAssignedPermissionGroup {
  permissionGroupId: string;
  assignedAt: string;
  assignedBy: IAgent;
  order: number;
}

export interface IPermissionGroup {
  resourceId: string;
  workspaceId: string;
  createdAt: string;
  createdBy: IAgent;
  lastUpdatedAt?: string;
  lastUpdatedBy?: IAgent;
  name: string;
  description?: string;
  permissionGroups: IAssignedPermissionGroup[];
}

export interface IPermissionGroupInput {
  permissionGroupId: string;
  order: number;
}

export interface INewPermissionGroupInput {
  name: string;
  description?: string;
  permissionGroups?: IPermissionGroupInput[];
}

export type IUpdatePermissionGroupInput = Partial<INewPermissionGroupInput>;

export const permissionGroupPermissionsGroupConstants = {
  maxAssignedPermissionGroups: 100,
};
