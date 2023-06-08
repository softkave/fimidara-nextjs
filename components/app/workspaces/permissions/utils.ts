import {
  PermissionMapItemInfo,
  PermissionMapItemInfoAppliesToPermitted,
  PermissionMapItemInfoPermitted,
} from "./types";

export function isPermissionMapItemInfoPermitted(
  p?: any
): p is PermissionMapItemInfoPermitted {
  return !!(p && (p as PermissionMapItemInfo).type === 1);
}

export function isPermissionMapItemInfoAppliesToPermitted(
  p?: any
): p is PermissionMapItemInfoAppliesToPermitted {
  return !!(p && (p as PermissionMapItemInfo).type === 2);
}
