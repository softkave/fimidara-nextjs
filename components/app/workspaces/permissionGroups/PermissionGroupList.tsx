"use client";

import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { getResourceId } from "@/lib/utils/resource";
import { PermissionGroup } from "fimidara";
import { noop } from "lodash-es";
import Link from "next/link";
import PermissionGroupMenu from "./PermissionGroupMenu";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { ReactNode, FC } from "react";

export interface PermissionGroupListProps {
  workspaceId: string;
  permissionGroups: PermissionGroup[];
  selectable?: boolean;
  withCheckbox?: boolean;
  selectedMap?: Record<string, boolean>;
  onSelect?: (item: PermissionGroup) => void;
  renderItem?: (item: PermissionGroup) => ReactNode;
}

const PermissionGroupList: FC<PermissionGroupListProps> = (props) => {
  const {
    workspaceId,
    permissionGroups,
    selectedMap,
    selectable,
    withCheckbox,
    onSelect,
    renderItem,
  } = props;

  const internalRenderItem = (item: PermissionGroup) => {
    const nameNode = onSelect ? (
      item.name
    ) : (
      <Link
        href={kAppWorkspacePaths.permissionGroup(workspaceId, item.resourceId)}
      >
        {item.name}
      </Link>
    );

    return (
      <ThumbnailContent
        key={item.resourceId}
        selectable={selectable}
        withCheckbox={withCheckbox}
        selected={selectedMap && selectedMap[item.resourceId]}
        onSelect={onSelect && (() => onSelect(item))}
        main={
          <div className="flex flex-col justify-center">
            {nameNode}
            {item.description && (
              <span className="text-secondary">{item.description}</span>
            )}
          </div>
        }
        menu={
          <div className="flex flex-col justify-center h-full">
            <PermissionGroupMenu
              key="menu"
              permissionGroup={item}
              onCompleteDelete={noop}
              onCompleteUnassignPermissionGroup={noop}
            />
          </div>
        }
      />
    );
  };

  return (
    <ItemList
      bordered
      items={permissionGroups}
      renderItem={renderItem || internalRenderItem}
      getId={getResourceId}
      emptyMessage="No permission groups yet. Click the plus button to add one"
      space="md"
    />
  );
};

export default PermissionGroupList;
