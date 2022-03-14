import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
import { useRequest } from "ahooks";
import { SelectInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import { IPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import PresetPermissionsGroupAPI from "../../../../lib/api/endpoints/presetPermissionsGroup";
import { getFormError } from "../../../form/formUtils";

export interface IPermissionGroupMenuProps {
  preset: IPresetPermissionsGroup;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
}

const PermissionGroupMenu: React.FC<IPermissionGroupMenuProps> = (props) => {
  const { preset, onCompleteDelete } = props;
  const deleteItem = React.useCallback(async () => {
    try {
      // TODO: invalidate all the data that has assigned presets
      // when request is successful

      const result = await PresetPermissionsGroupAPI.deletePreset({
        presetId: preset.resourceId,
      });

      checkEndpointResult(result);
      message.success("Permission group deleted");
      await onCompleteDelete();
    } catch (error: any) {
      message.error(
        getFormError(processEndpointError(error)) ||
          "Error deleting permission group"
      );
    }
  }, [preset, onCompleteDelete]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this permission group?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteItemHelper.runAsync();
          },
          onCancel() {
            // do nothing
          },
        });
      }
    },
    [deleteItemHelper]
  );

  return (
    <Dropdown
      disabled={deleteItemHelper.loading}
      trigger={["click"]}
      overlay={
        <Menu onSelect={onSelectMenuItem} style={{ minWidth: "150px" }}>
          <Menu.Item key={MenuKeys.UpdateItem}>
            <Link
              href={appOrgPaths.permissionGroupForm(
                preset.organizationId,
                preset.resourceId
              )}
            >
              Update Group
            </Link>
          </Menu.Item>
          <Menu.Divider key={"divider-01"} />
          <Menu.Item key={MenuKeys.DeleteItem}>Delete Group</Menu.Item>
        </Menu>
      }
    >
      <Button
        type="text"
        className={appClasses.iconBtn}
        icon={<BsThreeDots />}
      ></Button>
    </Dropdown>
  );
};

export default PermissionGroupMenu;
