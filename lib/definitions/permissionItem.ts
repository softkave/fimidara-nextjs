import { AppResourceType, BasicCRUDActions, IAgent } from "./system";

export enum PermissionItemAppliesTo {
  Owner = "owner",
  OwnerAndChildren = "owner-and-children",
  Children = "children",
}

export interface IPermissionItem {
  resourceId: string;
  workspaceId: string;
  createdAt: string;
  createdBy: IAgent;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  action: BasicCRUDActions;
  grantAccess: boolean;
  appliesTo: PermissionItemAppliesTo;
}

export interface INewPermissionItemInput {
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  action: BasicCRUDActions;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  grantAccess: boolean;
  appliesTo: PermissionItemAppliesTo;
}
