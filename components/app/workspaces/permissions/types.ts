import {
  PermissionItemAppliesTo,
  ResolvedEntityPermissionItem,
} from "fimidara";

export type TargetGrantPermissionFormEntityInfo = { name?: string };
export type PermissionMapItemInfoPermitted = {
  type: 1;
  permitted: boolean;
} & Pick<ResolvedEntityPermissionItem, "accessEntityId">;
export type PermissionMapItemInfoAppliesToPermitted = {
  type: 2;
} & Partial<Record<PermissionItemAppliesTo, PermissionMapItemInfoPermitted>>;
export type PermissionMapItemInfo =
  | PermissionMapItemInfoPermitted
  | PermissionMapItemInfoAppliesToPermitted;
export type ResolvedPermissionsMap = Record<string, PermissionMapItemInfo>;
export type TargetIdPermissions = {
  original: ResolvedPermissionsMap;
  updated: ResolvedPermissionsMap;
};
export type TargetTypePermissions = Record<
  string,
  { original: ResolvedPermissionsMap; updated: ResolvedPermissionsMap }
>;
