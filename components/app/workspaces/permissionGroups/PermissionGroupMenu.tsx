import { useRequest } from "ahooks";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import PermissionGroupAPI from "../../../../lib/api/endpoints/permissionGroup";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { IPermissionGroup } from "../../../../lib/definitions/permissionGroups";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

export interface IPermissionGroupMenuProps {
  permissionGroup: IPermissionGroup;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const PermissionGroupMenu: React.FC<IPermissionGroupMenuProps> = (props) => {
  const { permissionGroup, onCompleteDelete } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: permissionGroup.workspaceId,
    targetType: AppResourceType.PermissionGroup,
    containerId: permissionGroup.workspaceId,
    containerType: AppResourceType.Workspace,
    targetId: permissionGroup.resourceId,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const deleteItem = React.useCallback(async () => {
    try {
      // TODO: invalidate all the data that has assigned permissionGroups
      // when request is successful

      const result = await PermissionGroupAPI.deletePermissionGroup({
        permissionGroupId: permissionGroup.resourceId,
      });

      checkEndpointResult(result);
      message.success("Permission group deleted");
      await onCompleteDelete();
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting permission group");
    }
  }, [permissionGroup, onCompleteDelete]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
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
      } else if (info.key === MenuKeys.GrantPermission) {
        toggleVisibility();
      }
    },
    [deleteItemHelper, toggleVisibility]
  );

  return (
    <React.Fragment>
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={MenuKeys.UpdateItem}>
              <Link
                href={appWorkspacePaths.permissionGroupForm(
                  permissionGroup.workspaceId,
                  permissionGroup.resourceId
                )}
              >
                Update Group
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Access To Resource
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.DeleteItem}>Delete Group</Menu.Item>
          </Menu>
        }
      >
        <Button
          // type="text"
          className={appClasses.iconBtn}
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
      {grantPermissionFormNode}
    </React.Fragment>
  );
};

export default PermissionGroupMenu;
