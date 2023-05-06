import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { getResourceId } from "@/lib/utils/resource";
import { PermissionGroup } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
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
          <div>
            <Link
              href={appWorkspacePaths.permissionGroup(
                workspaceId,
                item.resourceId
              )}
            >
              {item.name}
            </Link>
            {item.description}
          </div>
        }
        menu={
          <PermissionGroupMenu
            key="menu"
            permissionGroup={item}
            onCompleteDelete={noop}
          />
        }
      />
    ),
    [workspaceId]
  );

  return (
    <ItemList
      items={permissionGroups}
      renderItem={renderItem || internalRenderItem}
      getId={getResourceId}
    />
  );
};

export default PermissionGroupList;
