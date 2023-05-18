import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { getResourceId } from "@/lib/utils/resource";
import { Typography } from "antd";
import { PermissionGroup } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
import { appClasses } from "../../../utils/theme";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface PermissionGroupListProps {
  workspaceId: string;
  permissionGroups: PermissionGroup[];
  renderItem?: (item: PermissionGroup) => React.ReactNode;
}

const PermissionGroupList: React.FC<PermissionGroupListProps> = (props) => {
  const { workspaceId, permissionGroups, renderItem } = props;

  const internalRenderItem = React.useCallback(
    (item: PermissionGroup) => (
      <ThumbnailContent
        key={item.resourceId}
        main={
          <div className={appClasses.thumbnailMain}>
            <Link
              href={appWorkspacePaths.permissionGroup(
                workspaceId,
                item.resourceId
              )}
            >
              {item.name}
            </Link>
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
    ),
    [workspaceId]
  );

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
