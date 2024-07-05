import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import {
  kActionLabel,
  kResourceTypeToChildrenTypesMap,
  kResourceTypeToPermittedActions,
} from "@/lib/definitions/system";
import { useFetchArbitraryFetchState } from "@/lib/hooks/fetchHookUtils";
import { useResolveEntityPermissionsFetchHook } from "@/lib/hooks/fetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { makeKey } from "@/lib/utils/fns";
import { indexArray } from "@/lib/utils/indexArray";
import { Collapse } from "antd";
import {
  FimidaraPermissionAction,
  FimidaraResourceType,
  ResolveEntityPermissionItemInput,
  ResolveEntityPermissionsEndpointParams,
  ResolvedEntityPermissionItem,
} from "fimidara";
import { flatten, merge, set, uniq } from "lodash";
import React from "react";
import EntityPermissionForm from "./EntityPermissionForm";
import {
  PermissionMapItemInfo,
  ResolvedPermissionsMap,
  TargetGrantPermissionFormEntityInfo,
} from "./types";

export interface TargetGrantPermissionFormEntityListProps<
  T extends { resourceId: string }
> {
  disabled?: boolean;
  workspaceId: string;
  targetId: string;
  targetType: FimidaraResourceType;
  entities: Array<T>;
  defaultUpdatedPermissions?: ResolvedPermissionsMap;
  getInfoFromItem(item: T): TargetGrantPermissionFormEntityInfo;
  onChange(
    updated: ResolvedPermissionsMap,
    original: ResolvedPermissionsMap
  ): void;
}

type CollapseItemType = Required<
  React.ComponentProps<typeof Collapse>
>["items"][number];

const separator = "#";
export const resolvedPermissionToKey = (
  entity: Pick<ResolvedEntityPermissionItem, "entityId" | "action">
) => makeKey([entity.entityId, entity.action], separator);

/** Returns a tuple of `[entityId, action]` */
export const splitKey = (key: string) => key.split(separator);

function resolveChildrenTypes(type: FimidaraResourceType) {
  const visited = new Map<FimidaraResourceType, FimidaraResourceType>();
  const children: FimidaraResourceType[] = [];
  const visitNext: FimidaraResourceType[] = [type];

  for (let next = visitNext.shift(); next; next = visitNext.shift()) {
    const c01 = kResourceTypeToChildrenTypesMap[next];
    c01.forEach((t01) => {
      if (!visited.has(t01)) {
        visited.set(t01, t01);
        children.push(t01);
        visitNext.push(t01);
      }
    });
  }

  return children;
}

function resolveActions(types: FimidaraResourceType[]) {
  return uniq(
    flatten(
      types.map((type) => {
        const actions = kResourceTypeToPermittedActions[type];
        return actions.item.concat(actions.group ?? []);
      })
    )
  );
}

function TargetGrantPermissionFormEntityList<T extends { resourceId: string }>(
  props: TargetGrantPermissionFormEntityListProps<T>
) {
  const {
    disabled,
    workspaceId,
    targetId,
    targetType,
    entities,
    defaultUpdatedPermissions,
    getInfoFromItem,
    onChange,
  } = props;

  const types = React.useMemo(
    () => resolveChildrenTypes(targetType),
    [targetType]
  );

  const everyAction = React.useMemo(
    () => Object.keys(kActionLabel) as FimidaraPermissionAction[],
    []
  );

  const actions = React.useMemo(() => {
    const itemActions = kResourceTypeToPermittedActions[targetType];
    return uniq(itemActions.item.concat(resolveActions(types)));
  }, [targetType, types]);

  const params = React.useMemo((): ResolveEntityPermissionsEndpointParams => {
    return {
      workspaceId,
      items: entities.map((entity): ResolveEntityPermissionItemInput => {
        return {
          entityId: entity.resourceId,
          action: actions,
          target: { targetId },
        };
      }),
    };
  }, [entities, targetId, targetType, workspaceId, actions]);

  const rpHook = useResolveEntityPermissionsFetchHook(params);
  const rpState = useFetchArbitraryFetchState(rpHook.fetchState);

  const rpMap: ResolvedPermissionsMap = React.useMemo(() => {
    return indexArray(rpState.data?.items ?? [], {
      indexer: resolvedPermissionToKey,
    });
  }, [rpState.data?.items]);

  const [updatedPermissionsMap, setUpdatedPermissionsMap] =
    React.useState<ResolvedPermissionsMap>(defaultUpdatedPermissions ?? {});

  const activePermissionsMap = React.useMemo(() => {
    return merge({}, rpMap, updatedPermissionsMap);
  }, [rpMap, updatedPermissionsMap]);

  const handleChange = React.useCallback(
    (
      entity: T,
      action: FimidaraPermissionAction,
      permitted: PermissionMapItemInfo
    ) => {
      const key = resolvedPermissionToKey({
        action,
        entityId: entity.resourceId,
      });
      const updated: ResolvedPermissionsMap = {
        ...updatedPermissionsMap,
      };

      set(updated, key, permitted);
      setUpdatedPermissionsMap(updated);
      onChange(updated, rpMap);
    },
    [rpMap]
  );

  const collapseItems = entities.map((entity): CollapseItemType => {
    const info = getInfoFromItem(entity);
    return {
      key: entity.resourceId,
      label: info.name,
      children: (
        <EntityPermissionForm
          actions={actions}
          everyAction={everyAction}
          entity={entity}
          disabled={disabled}
          permissionsMap={activePermissionsMap}
          onChange={handleChange}
        />
      ),
    };
  });

  let content: React.ReactNode = null;

  if (rpState.error) {
    content = (
      <PageError
        message={getBaseError(rpState.error) || "Error resolving permissions"}
      />
    );
  } else if (rpState.isLoading) {
    content = <PageLoading message="Resolving permissions..." />;
  } else if (rpState.data) {
    content = <Collapse items={collapseItems} />;
  }

  return <React.Fragment>{content}</React.Fragment>;
}

export default TargetGrantPermissionFormEntityList;
