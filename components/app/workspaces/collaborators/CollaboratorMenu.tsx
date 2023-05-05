import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import { PermissionItemAppliesTo } from "@/lib/definitions/permissionItem";
import { AppResourceType } from "@/lib/definitions/system";
import { useRequest } from "ahooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { Collaborator } from "fimidara";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useGrantPermission from "../../../hooks/useGrantPermission";
import IconButton from "../../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

export interface CollaboratorMenuProps {
  workspaceId: string;
  collaborator: Collaborator;
  onCompleteRemove: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const CollaboratorMenu: React.FC<CollaboratorMenuProps> = (props) => {
  const { workspaceId, collaborator, onCompleteRemove } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId,
    targetType: AppResourceType.User,
    containerId: workspaceId,
    containerType: AppResourceType.Workspace,
    targetId: collaborator.resourceId,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const deleteItem = React.useCallback(async () => {
    try {
      const endpoints = getPublicFimidaraEndpointsUsingUserToken();
      const result = await endpoints.collaborators.removeCollaborator({
        body: {
          workspaceId: workspaceId,
          collaboratorId: collaborator.resourceId,
        },
      });

      message.success("Collaborator removed.");
      await onCompleteRemove();
    } catch (error: any) {
      errorMessageNotificatition(error, "Error removing collaborator.");
    }
  }, [workspaceId, collaborator, onCompleteRemove]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to remove this collaborator?",
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
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteItem,
      label: "Remove Collaborator",
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

export default CollaboratorMenu;
