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
  AppActionType,
  ResolveEntityPermissionsEndpointParams,
  ResolvedEntityPermissionItem,
  WorkspaceAppResourceType,
} from "fimidara";
import { first, merge, set } from "lodash";
import React from "react";
import PermissionActionList from "./PermissionActionList";
import {
  PermissionMapItemInfoType,
  PermissionsMapType,
  TargetGrantPermissionFormEntityInfo,
} from "./types";

export interface TargetGrantPermissionFormEntityListProps<
  T extends { resourceId: string }
> {
  disabled?: boolean;
  targetId: string;
  targetType?: WorkspaceAppResourceType;
  items: Array<T>;
  defaultUpdatedPermissions?: PermissionsMapType;
  getInfoFromItem(item: T): TargetGrantPermissionFormEntityInfo;
  onChange(updated: PermissionsMapType, original: PermissionsMapType): void;
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
          : [
              {
                action: actions,
                target: [{ targetId: [targetId] }],
              },
            ],
    };
  }, []);
  const rpHook = useResolveEntityPermissionsFetchHook(params);
  const { data, error, isLoading } = useFetchArbitraryFetchState(
    rpHook.fetchState
  );

  const serverPermissionsMap: PermissionsMapType = React.useMemo(() => {
    if (targetType === "folder") {
      const map: PermissionsMapType = {};
      data?.items.forEach((item) => {
        let key = getKey(item);
        const appliesTo = first(item.containerAppliesTo ?? []) ?? "self";
        key = `${key}.${appliesTo}`;
        const info: PermissionMapItemInfoType = {
          permitted: item.hasAccess,
          accessEntityId: item.accessEntityId,
        };
        set(map, key, info);
      });
      return map;
    } else {
      return indexArray(data?.items ?? [], {
        indexer: getKey,
        reducer: (item) => ({
          permitted: item.hasAccess,
          accessEntityId: item.accessEntityId,
        }),
      });
    }
  }, []);
  const [updatedPermissionsMap, setUpdatedPermissionsMap] =
    React.useState<PermissionsMapType>(defaultUpdatedPermissions ?? {});
  const permissionsMap = React.useMemo(() => {
    return merge({}, serverPermissionsMap, updatedPermissionsMap);
  }, [serverPermissionsMap, updatedPermissionsMap]);

  const getInfo = (entityId: string, action: AppActionType) => {
    const key = getKey({ action, entityId });
    const info = permissionsMap[key];
    return info;
  };

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
            targetType={getResourceTypeFromId(targetId)}
            onChange={(action, permitted) => {
              const key = getKey({ action, entityId: item.resourceId });
              const updated: PermissionsMapType = {
                ...updatedPermissionsMap,
                [key]: { permitted },
              };
              setUpdatedPermissionsMap(updated);
              onChange(updated, serverPermissionsMap);
            }}
            getActionPermission={(action) => {
              const key = getKey({ action, entityId: item.resourceId });
              const info = permissionsMap[key];
              return info?.permitted;
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
