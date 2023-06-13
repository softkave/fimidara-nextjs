import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import { getWorkspaceActionList } from "@/lib/definitions/system";
import { useFetchArbitraryFetchState } from "@/lib/hooks/fetchHookUtils";
import { useResolveEntityPermissionsFetchHook } from "@/lib/hooks/fetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { makeKey } from "@/lib/utils/fns";
import { indexArray } from "@/lib/utils/indexArray";
import { getResourceTypeFromId } from "@/lib/utils/resource";
import { Collapse } from "antd";
import {
  ResolveEntityPermissionsEndpointParams,
  ResolvedEntityPermissionItem,
  WorkspaceAppResourceType,
} from "fimidara";
import { merge, set } from "lodash";
import React from "react";
import PermissionActionList from "./PermissionActionList";
import {
  ResolvedPermissionsMap,
  TargetGrantPermissionFormEntityInfo,
} from "./types";

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

  const actions = React.useMemo(
    () => getWorkspaceActionList(targetType ?? getResourceTypeFromId(targetId)),
    [targetId, targetType]
  );
  const params: ResolveEntityPermissionsEndpointParams = React.useMemo(() => {
    return {
      workspaceId,
      entity: { entityId: items.map((item) => item.resourceId) },
      items:
        targetType === "folder"
          ? [
              {
                action: actions,
                target: [{ targetId: [targetId], targetType: [targetType] }],
                containerAppliesTo: ["children", "selfAndChildren"],
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
  }, [items, targetId, targetType, workspaceId, actions]);
  const rpHook = useResolveEntityPermissionsFetchHook(params);
  const { data, error, isLoading } = useFetchArbitraryFetchState(
    rpHook.fetchState
  );

  const serverPermissionsMap: ResolvedPermissionsMap = React.useMemo(() => {
    return indexArray(data?.items ?? [], {
      indexer: getKey,
      reducer: (item) => ({
        type: 1,
        permitted: item.hasAccess,
        accessEntityId: item.accessEntityId,
      }),
    });
  }, [data?.items]);
  const [updatedPermissionsMap, setUpdatedPermissionsMap] =
    React.useState<ResolvedPermissionsMap>(defaultUpdatedPermissions ?? {});
  const permissionsMap = React.useMemo(() => {
    return merge({}, serverPermissionsMap, updatedPermissionsMap);
  }, [serverPermissionsMap, updatedPermissionsMap]);

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
    const itemListNode = items.map((item) => {
      const info = getInfoFromItem(item);
      return (
        <Collapse.Panel
          key={item.resourceId}
          header={info.name ?? item.resourceId}
        >
          <PermissionActionList
            disabled={disabled}
            actions={actions}
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
