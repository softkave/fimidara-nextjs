import { AppResourceType, BasicCRUDActions, IAgent } from "./system";

export enum PermissionItemAppliesTo {
  Container = "container",
  ContainerAndChildren = "container-and-children",
  Children = "children",
}

export interface IPermissionItem {
  resourceId: string;
  workspaceId: string;
  createdAt: string;
  createdBy: IAgent;
  containerId: string;
  containerType: AppResourceType;
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  targetId?: string;
  targetType: AppResourceType;
  action: BasicCRUDActions;
  grantAccess: boolean;
  appliesTo: PermissionItemAppliesTo;
}

export interface INewPermissionItemInput {
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  action: BasicCRUDActions;
  containerId: string;
  containerType: AppResourceType;
  targetId?: string;
  targetType: AppResourceType;
  grantAccess: boolean;
  appliesTo: PermissionItemAppliesTo;
}
