export interface IPermissionGroupInput {
  permissionGroupId: string;
  order: number;
}

export interface INewPermissionGroupInput {
  name: string;
  description?: string;
}

export type IUpdatePermissionGroupInput = Partial<INewPermissionGroupInput>;

export const permissionGroupPermissionsGroupConstants = {
  maxAssignedPermissionGroups: 100,
};
