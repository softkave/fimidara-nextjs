import { appWorkspacePaths } from "@/lib/definitions/system";
import { useWorkspaceCollaborationRequestDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { CollaborationRequestForWorkspace } from "fimidara";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";
import IconButton from "../../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";
import { insertAntdMenuDivider } from "../../../utils/utils";

export interface IWorkspaceRequestMenuProps {
  request: CollaborationRequestForWorkspace;
  onCompleteDeleteRequest: () => void;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const WorkspaceRequestMenu: React.FC<IWorkspaceRequestMenuProps> = (props) => {
  const { request, onCompleteDeleteRequest } = props;
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: request.workspaceId,
    targetId: request.resourceId,
  });
  const deleteHook = useWorkspaceCollaborationRequestDeleteMutationHook({
    onSuccess(data, params) {
      message.success("Collaboration request scheduled for deletion.");
      onCompleteDeleteRequest();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting collaboration request.");
    },
  });

  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this collaboration request?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteHook.runAsync({
              body: { requestId: request.resourceId },
            });
          },
          onCancel() {
            // do nothing
          },
        });
      } else if (info.key === MenuKeys.GrantPermission) {
        permissionsHook.toggle();
      }
    },
    [deleteHook, permissionsHook.toggle]
  );

  const isPending = request.status === "pending";
  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      // TODO: only show if user has permission
      key: MenuKeys.UpdateItem,
      label: (
        <Link
          href={
            !isPending
              ? "#"
              : appWorkspacePaths.requestForm(
                  request.workspaceId,
                  request.resourceId
                )
          }
        >
          Update Request
        </Link>
      ),
      disabled: !isPending,
    },
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteItem,
      label: "Delete Request",
      disabled: !isPending,
    },
  ]);

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

export default WorkspaceRequestMenu;
