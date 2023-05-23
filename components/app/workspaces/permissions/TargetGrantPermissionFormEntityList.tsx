import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import { getWorkspaceActionList } from "@/lib/definitions/system";
import { useFetchArbitraryFetchState } from "@/lib/hooks/fetchHookUtils";
import { useResolveEntityPermissionsFetchHook } from "@/lib/hooks/fetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { makeKey } from "@/lib/utils/fns";
import { indexArray } from "@/lib/utils/indexArray";
import { Collapse } from "antd";
import {
  ResolveEntityPermissionsEndpointParams,
  ResolvedEntityPermissionItem,
  WorkspaceAppResourceType,
} from "fimidara";
import { first, merge, set } from "lodash";
import React from "react";
import { getResourceTypeFromId } from "../../../../lib/utils/resource";
import PermissionActionList from "./PermissionActionList";
import {
  ResolvedPermissionsMap,
  TargetGrantPermissionFormEntityInfo,
} from "./types";
import { isPermissionMapItemInfoAppliesToPermitted } from "./utils";

export interface TargetGrantPermissionFormEntityListProps<
  T extends { resourceId: string }
> {
  disabled?: boolean;
  workspaceId: string;
  targetId: string;
  targetType?: WorkspaceAppResourceType;
  items: Array<T>;
  defaultUpdatedPermissions?: ResolvedPermissionsMap;
  getInfoFromItem(item: T): TargetGrantPermissionFormEntityInfo;
  onChange(
    updated: ResolvedPermissionsMap,
    original: ResolvedPermissionsMap
  ): void;
}

const separator = "#";
export const getKey = (
  item: Pick<ResolvedEntityPermissionItem, "entityId" | "action">
) => makeKey([item.entityId, item.action], separator);

/** Returns a tuple of `[entityId, action]` */
export const splitKey = (key: string) => key.split(separator);

function TargetGrantPermissionFormEntityList<T extends { resourceId: string }>(
  props: TargetGrantPermissionFormEntityListProps<T>
) {
  const {
    disabled,
    workspaceId,
    targetId,
    targetType,
    items,
    defaultUpdatedPermissions,
    getInfoFromItem,
    onChange,
  } = props;

  const actions = getWorkspaceActionList(targetType);
  const params: ResolveEntityPermissionsEndpointParams = React.useMemo(() => {
    return {
      workspaceId,
      // entity: { entityId: ["pmgroup_GrbhyTKJIhb8L9Qkej60n"] },
      entity: { entityId: items.map((item) => item.resourceId) },
      items:
        targetType === "folder"
          ? [
              {
                action: actions,
                target: [{ targetId: [targetId], targetType: [targetType] }],
                containerAppliesTo: ["self"],
              },
              {
                action: actions,
                target: [{ targetId: [targetId], targetType: [targetType] }],
                containerAppliesTo: ["selfAndChildren"],
              },
              {
                action: actions,
                target: [{ targetId: [targetId], targetType: [targetType] }],
                containerAppliesTo: ["children"],
              },
            ]
          : targetType
          ? [
              {
                action: actions,
                target: [{ targetId: [targetId], targetType: [targetType] }],
              },
            ]
          : [
              {
                action: actions,
                target: [{ targetId: [targetId] }],
              },
            ],
    };
  }, [items, targetId, targetType, workspaceId]);
  const rpHook = useResolveEntityPermissionsFetchHook(params);
  const { data, error, isLoading } = useFetchArbitraryFetchState(
    rpHook.fetchState
  );

  const serverPermissionsMap: ResolvedPermissionsMap = React.useMemo(() => {
    if (targetType === "folder") {
      const map: ResolvedPermissionsMap = {};
      data?.items.forEach((item) => {
        const key = getKey(item);
        const appliesTo = first(item.containerAppliesTo ?? []) ?? "self";

        let permitted = map[key];
        if (!permitted) permitted = map[key] = { type: 2 };
        if (!isPermissionMapItemInfoAppliesToPermitted(permitted)) return;

        let permittedAppliesTo = permitted[appliesTo];
        if (!permittedAppliesTo)
          permittedAppliesTo = permitted[appliesTo] = {
            type: 1,
            permitted: item.hasAccess,
            accessEntityId: item.accessEntityId,
          };
      });

      return map;
    } else {
      return indexArray(data?.items ?? [], {
        indexer: getKey,
        reducer: (item) => ({
          type: 1,
          permitted: item.hasAccess,
          accessEntityId: item.accessEntityId,
        }),
      });
    }
  }, [data?.items, targetType]);
  const [updatedPermissionsMap, setUpdatedPermissionsMap] =
    React.useState<ResolvedPermissionsMap>(defaultUpdatedPermissions ?? {});
  const permissionsMap = React.useMemo(() => {
    return merge({}, serverPermissionsMap, updatedPermissionsMap);
  }, [serverPermissionsMap, updatedPermissionsMap]);

  console.log(serverPermissionsMap);

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        message={getBaseError(error) || "Error resolving permissions."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Resolving permissions..." />;
  } else if (data) {
    const parentTargetType = getResourceTypeFromId(targetId);
    const itemListNode = items.map((item) => {
      const info = getInfoFromItem(item);
      return (
        <Collapse.Panel
          key={item.resourceId}
          header={info.name ?? item.resourceId}
        >
          <PermissionActionList
            disabled={disabled}
            targetType={targetType}
            parentTargetType={parentTargetType}
            onChange={(action, permitted) => {
              const key = getKey({ action, entityId: item.resourceId });
              const updated: ResolvedPermissionsMap = {
                ...updatedPermissionsMap,
              };
              set(updated, key, permitted);
              setUpdatedPermissionsMap(updated);
              onChange(updated, serverPermissionsMap);
            }}
            getActionPermission={(action) => {
              const key = getKey({ action, entityId: item.resourceId });
              const p = permissionsMap[key];

              if (info.name) {
                console.log(info.name, p);
              }

              return p;
            }}
          />
        </Collapse.Panel>
      );
    });
    content = <Collapse>{itemListNode}</Collapse>;
  }

  return <React.Fragment>{content}</React.Fragment>;
}

export default TargetGrantPermissionFormEntityList;
