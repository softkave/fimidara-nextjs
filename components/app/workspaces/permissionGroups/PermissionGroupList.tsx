import { List } from "antd";
import Link from "next/link";
import React from "react";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import { IPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import { getUseWorkspacePermissionGroupListHookKey } from "../../../../lib/hooks/workspaces/useWorkspacePermissionGroupList";
import { css } from "@emotion/css";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface IPermissionGroupListProps {
  workspaceId: string;
  presets: IPresetPermissionsGroup[];
  renderItem?: (item: IPresetPermissionsGroup) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const PermissionGroupList: React.FC<IPermissionGroupListProps> = (props) => {
  const { workspaceId, presets, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteDeletePreset = React.useCallback(async () => {
    mutate(getUseWorkspacePermissionGroupListHookKey(workspaceId));
  }, [workspaceId, mutate]);

  const internalRenderItem = React.useCallback(
    (item: IPresetPermissionsGroup) => (
      <List.Item
        key={item.resourceId}
        actions={[
          <PermissionGroupMenu
            preset={item}
            onCompleteDelete={onCompleteDeletePreset}
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
    [onCompleteDeletePreset]
  );

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={presets}
      renderItem={renderItem || internalRenderItem}
    />
  );
};

export default PermissionGroupList;
