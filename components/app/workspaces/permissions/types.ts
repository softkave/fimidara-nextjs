import { ResolvedEntityPermissionItem } from "fimidara";

export type TargetGrantPermissionFormEntityInfo = { name?: string };
export type PermissionMapItemInfo = {
  permitted: boolean;
} & Pick<ResolvedEntityPermissionItem, "accessEntityId">;
export type ResolvedPermissionsMap = Record<string, PermissionMapItemInfo>;
export type TargetIdPermissions = {
  original: ResolvedPermissionsMap;
  updated: ResolvedPermissionsMap;
};
export type TargetTypePermissions = Record<
  string,
  { original: ResolvedPermissionsMap; updated: ResolvedPermissionsMap }
>;
