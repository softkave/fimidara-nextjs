import { Button, Dropdown, List, Menu, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useAppResponsive from "../../../../lib/hooks/useAppResponsive";
import { appClasses } from "../../../utils/theme";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { useSWRConfig } from "swr";
import { useRequest } from "ahooks";
import { SelectInfo } from "../../../utils/types";
import { EllipsisOutlined } from "@ant-design/icons";
import { IPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import PresetPermissionsGroupAPI from "../../../../lib/api/endpoints/presetPermissionsGroup";
import { getUseOrgPermissionGroupListHookKey } from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";

export interface IPermissionGroupListProps {
  orgId: string;
  presets: IPresetPermissionsGroup[];
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
}

const PermissionGroupList: React.FC<IPermissionGroupListProps> = (props) => {
  const { orgId, presets } = props;
  const { mutate } = useSWRConfig();
  const responsive = useAppResponsive();
  const deleteItem = React.useCallback(
    async (itemId: string) => {
      const result = await PresetPermissionsGroupAPI.deletePreset({
        presetId: itemId,
      });

      checkEndpointResult(result);
      mutate(getUseOrgPermissionGroupListHookKey(orgId));
    },
    [orgId, mutate]
  );

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo, itemId: string) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this permission group?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteItemHelper.runAsync(itemId);
          },
          onCancel() {
            // do nothing
          },
        });
      }
    },
    [deleteItemHelper]
  );

  const renderMenu = (item: IPresetPermissionsGroup) => (
    <Dropdown
      disabled={deleteItemHelper.loading}
      trigger={["click"]}
      overlay={
        <Menu
          onSelect={(info) => onSelectMenuItem(info, item.resourceId)}
          style={{ minWidth: "150px" }}
        >
          <Menu.Item key={MenuKeys.UpdateItem}>
            <Link
              href={appOrgPaths.permissionGroupForm(orgId, item.resourceId)}
            >
              Update Group
            </Link>
          </Menu.Item>
          <Menu.Divider key={"divider-01"} />
          <Menu.Item key={MenuKeys.DeleteItem}>Delete Group</Menu.Item>
        </Menu>
      }
    >
      <Button type="text">
        <EllipsisOutlined />
      </Button>
    </Dropdown>
  );

  return (
    <List
      className={appClasses.main}
      itemLayout="horizontal"
      dataSource={presets}
      renderItem={(item) => (
        <List.Item actions={[renderMenu(item)]}>
          <List.Item.Meta
            title={
              <Link href={appOrgPaths.permissionGroup(orgId, item.resourceId)}>
                {item.name}
              </Link>
            }
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
};

export default PermissionGroupList;
