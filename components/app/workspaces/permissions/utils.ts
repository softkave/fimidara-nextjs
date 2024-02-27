import { makeKey } from "@/lib/utils/fns";
import { ResolvedEntityPermissionItem } from "fimidara";

const separator = "#";

export const getResolvedPermissionToKey = (
  entity: Pick<ResolvedEntityPermissionItem, "entityId" | "action">
) => makeKey([entity.entityId, entity.action], separator);

/** Returns a tuple of `[entityId, action]` */
export const splitResolvedPermissionKey = (key: string) => key.split(separator);
