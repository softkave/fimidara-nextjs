import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { getResourceId } from "@/lib/utils/resource";
import { Typography } from "antd";
import { PermissionGroup } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface PermissionGroupListProps {
  workspaceId: string;
  permissionGroups: PermissionGroup[];
  selectable?: boolean;
  withCheckbox?: boolean;
  selectedMap?: Record<string, boolean>;
  onSelect?: (item: PermissionGroup) => void;
  renderItem?: (item: PermissionGroup) => React.ReactNode;
}

const PermissionGroupList: React.FC<PermissionGroupListProps> = (props) => {
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
        href={appWorkspacePaths.permissionGroup(workspaceId, item.resourceId)}
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
          <div className={appClasses.thumbnailMain}>
            {nameNode}
            {item.description && (
              <Typography.Text type="secondary">
                {item.description}
              </Typography.Text>
            )}
          </div>
        }
        menu={
          <PermissionGroupMenu
            key="menu"
            permissionGroup={item}
            onCompleteDelete={noop}
            onCompleteUnassignPermissionGroup={noop}
          />
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
      emptyMessage="No permission groups yet. Click the plus button to add one."
    />
  );
};

export default PermissionGroupList;
