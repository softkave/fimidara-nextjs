import { List } from "antd";
import Link from "next/link";
import React from "react";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import { IPermissionGroup } from "../../../../lib/definitions/permissionGroups";
import { getUseWorkspacePermissionGroupListHookKey } from "../../../../lib/hooks/workspaces/useWorkspacePermissionGroupList";
import { css } from "@emotion/css";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface IPermissionGroupListProps {
  workspaceId: string;
  permissionGroups: IPermissionGroup[];
  renderItem?: (item: IPermissionGroup) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const PermissionGroupList: React.FC<IPermissionGroupListProps> = (props) => {
  const { workspaceId, permissionGroups, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteDeletePermissionGroup = React.useCallback(async () => {
    mutate(getUseWorkspacePermissionGroupListHookKey(workspaceId));
  }, [workspaceId, mutate]);

  const internalRenderItem = React.useCallback(
    (item: IPermissionGroup) => (
      <List.Item
        key={item.resourceId}
        actions={[
          <PermissionGroupMenu
            key="menu"
            permissionGroup={item}
            onCompleteDelete={onCompleteDeletePermissionGroup}
          />,
        ]}
      >
        <List.Item.Meta
          title={
            <Link
              href={appWorkspacePaths.permissionGroup(
                workspaceId,
                item.resourceId
              )}
            >
              {item.name}
            </Link>
          }
          description={item.description}
        />
      </List.Item>
    ),
    [onCompleteDeletePermissionGroup, workspaceId]
  );

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={permissionGroups}
      renderItem={renderItem || internalRenderItem}
    />
  );
};

export default PermissionGroupList;
