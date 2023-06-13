import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { appClasses } from "@/components/utils/theme";
import { MenuInfo } from "@/components/utils/types";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { appWorkspacePaths } from "@/lib/definitions/system";
import {
  useWorkspacePermissionGroupDeleteMutationHook,
  useWorkspacePermissionGroupUnassignMutationHook,
} from "@/lib/hooks/mutationHooks";
import { Dropdown, MenuProps, Modal, message } from "antd";
import { PermissionGroup } from "fimidara";
import { compact } from "lodash";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

export interface PermissionGroupMenuProps {
  permissionGroup: PermissionGroup;
  unassignParams?: { entityId: string };
  onCompleteDelete: () => any;
  onCompleteUnassignPermissionGroup: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  UnassignPermissionGroup = "unassign-permission-group",
  GrantPermission = "grant-permission",
}

const PermissionGroupMenu: React.FC<PermissionGroupMenuProps> = (props) => {
  const {
    permissionGroup,
    unassignParams,
    onCompleteDelete,
    onCompleteUnassignPermissionGroup,
  } = props;

  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: permissionGroup.workspaceId,
    targetId: permissionGroup.resourceId,
  });
  const deleteHook = useWorkspacePermissionGroupDeleteMutationHook({
    onSuccess(data, params) {
      message.success("Permission group scheduled for deletion.");
      onCompleteDelete();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting permission group.");
    },
  });
  const unassignPermissionGroupHook =
    useWorkspacePermissionGroupUnassignMutationHook({
      onSuccess(data, params) {
        message.success("Permission group unassigned.");
        onCompleteUnassignPermissionGroup();
      },
      onError(e, params) {
        errorMessageNotificatition(e, "Error unassigning permission group.");
      },
    });

  const onSelectMenuItem = (info: MenuInfo) => {
    if (info.key === MenuKeys.DeleteItem) {
      Modal.confirm({
        title: "Are you sure you want to delete this permission group?",
        okText: "Yes",
        cancelText: "No",
        okType: "primary",
        okButtonProps: { danger: true },
        onOk: async () => {
          await deleteHook.runAsync();
        },
        onCancel() {
          // do nothing
        },
      });
    } else if (info.key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    } else if (
      info.key === MenuKeys.UnassignPermissionGroup &&
      unassignParams?.entityId
    ) {
      Modal.confirm({
        title: "Are you sure you want to unassign this permission group?",
        okText: "Yes",
        cancelText: "No",
        okType: "primary",
        okButtonProps: { danger: true },
        onOk: async () => {
          await unassignPermissionGroupHook.runAsync({
            body: {
              entityId: [unassignParams.entityId],
              permissionGroups: [permissionGroup.resourceId],
            },
          });
        },
        onCancel() {
          // do nothing
        },
      });
    }
  };

  const items: MenuProps["items"] = insertAntdMenuDivider(
    compact([
      {
        key: MenuKeys.UpdateItem,
        label: (
          <Link
            href={appWorkspacePaths.permissionGroupForm(
              permissionGroup.workspaceId,
              permissionGroup.resourceId
            )}
          >
            Update
          </Link>
        ),
      },
      unassignParams && {
        key: MenuKeys.UnassignPermissionGroup,
        label: "Unassign",
      },
      {
        key: MenuKeys.GrantPermission,
        label: "Permissions",
      },
      {
        key: MenuKeys.DeleteItem,
        label: "Delete",
      },
    ])
  );

  return (
    <React.Fragment>
      <Dropdown
        disabled={deleteHook.loading}
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
        placement="bottomRight"
      >
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>
      {permissionsHook.node}
    </React.Fragment>
  );
};

export default PermissionGroupMenu;
