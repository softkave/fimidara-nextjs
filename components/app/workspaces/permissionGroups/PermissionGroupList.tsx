import { appWorkspacePaths } from "@/lib/definitions/system";
import { getUseWorkspacePermissionGroupListHookKey } from "@/lib/hooks/workspaces/useWorkspacePermissionGroupList";
import { getResourceId } from "@/lib/utils/resource";
import { PermissionGroup } from "fimidara";
import Link from "next/link";
import React from "react";
import { useSWRConfig } from "swr";
import ItemList from "../../../utils/list/ItemList";
import ThumbnailContent from "../../../utils/page/ThumbnailContent";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface PermissionGroupListProps {
  workspaceId: string;
  permissionGroups: PermissionGroup[];
  renderItem?: (item: PermissionGroup) => React.ReactNode;
}

const PermissionGroupList: React.FC<PermissionGroupListProps> = (props) => {
  const { workspaceId, permissionGroups, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteDeletePermissionGroup = React.useCallback(async () => {
    mutate(getUseWorkspacePermissionGroupListHookKey(workspaceId));
  }, [workspaceId, mutate]);

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
            onCompleteDelete={onCompleteDeletePermissionGroup}
          />
        }
      />
    ),
    [onCompleteDeletePermissionGroup, workspaceId]
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
