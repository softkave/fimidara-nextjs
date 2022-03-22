import { List } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import { IPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import { getUseOrgPermissionGroupListHookKey } from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import { css } from "@emotion/css";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface IPermissionGroupListProps {
  orgId: string;
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
  const { orgId, presets, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteDeletePreset = React.useCallback(async () => {
    mutate(getUseOrgPermissionGroupListHookKey(orgId));
  }, [orgId, mutate]);

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
            <Link href={appOrgPaths.permissionGroup(orgId, item.resourceId)}>
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
