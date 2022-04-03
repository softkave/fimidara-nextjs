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
  isForPermissionOwner?: boolean;
  isForPermissionOwnerChildren?: boolean;
}

export interface INewPermissionItemInput {
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  action: BasicCRUDActions;
  isExclusion?: boolean;
  isForPermissionOwner?: boolean;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  isForPermissionOwnerChildren?: boolean;
}
