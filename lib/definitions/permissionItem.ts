import { AppResourceType, BasicCRUDActions, IAgent } from "./system";

export interface IPermissionItem {
  resourceId: string;
  organizationId: string;
  createdAt: string;
  createdBy: IAgent;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  action: BasicCRUDActions;
  isExclusion?: boolean;
  isForPermissionOwnerOnly?: boolean;
}

export interface INewPermissionItemInput {
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  action: BasicCRUDActions;
  isExclusion?: boolean;
  isForPermissionOwnerOnly?: boolean;
}
