import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useRequest } from "ahooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { PermissionGroup } from "fimidara";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useGrantPermission from "../../../hooks/useGrantPermission";
import IconButton from "../../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

export interface PermissionGroupMenuProps {
  permissionGroup: PermissionGroup;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const PermissionGroupMenu: React.FC<PermissionGroupMenuProps> = (props) => {
  const { permissionGroup, onCompleteDelete } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: permissionGroup.workspaceId,
    targetType: "permissionGroup",
    containerId: permissionGroup.workspaceId,
    containerType: "workspace",
    targetId: permissionGroup.resourceId,
    appliesTo: "children",
  });

  const deleteItem = React.useCallback(async () => {
    try {
      // TODO: invalidate all the data that has assigned permissionGroups
      // when request is successful

      const endpoints = getPublicFimidaraEndpointsUsingUserToken();
      const result = await endpoints.permissionGroups.deletePermissionGroup({
        body: { permissionGroupId: permissionGroup.resourceId },
      });

      message.success("Permission group deleted.");
      await onCompleteDelete();
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting permission group.");
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

  const items: MenuProps["items"] = [
    {
      key: MenuKeys.UpdateItem,
      label: (
        <Link
          href={appWorkspacePaths.permissionGroupForm(
            permissionGroup.workspaceId,
            permissionGroup.resourceId
          )}
        >
          Update Permission Group
        </Link>
      ),
    },
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteItem,
      label: "Delete Permission Group",
    },
  ];

  return (
    <React.Fragment>
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
      >
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>
      {grantPermissionFormNode}
    </React.Fragment>
  );
};

export default PermissionGroupMenu;
