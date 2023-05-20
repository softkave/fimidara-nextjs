import { PermissionItemAppliesTo } from "fimidara";

export type TargetGrantPermissionFormEntityInfo = { name?: string };
export type PermissionMapItemInfoTargetTypePermitted = Partial<
  Record<PermissionItemAppliesTo, boolean>
>;
export type PermissionMapItemInfoPermitted =
  | boolean
  | PermissionMapItemInfoTargetTypePermitted;
export type PermissionMapItemInfoType = {
  permitted: PermissionMapItemInfoPermitted;
  accessEntityId?: string;
};
export type PermissionsMapType = Record<string, PermissionMapItemInfoType>;
export type TargetIdPermissions = {
  original: PermissionsMapType;
  updated: PermissionsMapType;
};
export type TargetTypePermissions = Record<
  string,
  { original: PermissionsMapType; updated: PermissionsMapType }
>;
