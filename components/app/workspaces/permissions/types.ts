import { ResolvedEntityPermissionItem } from "fimidara";

export type TargetGrantPermissionFormEntityInfo = { name?: string };

export type PermissionMapItemInfo = Pick<
  ResolvedEntityPermissionItem,
  "entityId" | "action" | "access"
>;

export type ResolvedPermissionsMap = Record<
  string,
  PermissionMapItemInfo | undefined
>;

export type TargetIdPermissions = {
  original: ResolvedPermissionsMap;
  updated: ResolvedPermissionsMap;
};
