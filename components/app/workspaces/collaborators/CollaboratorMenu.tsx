import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { appClasses } from "@/components/utils/theme";
import { MenuInfo } from "@/components/utils/types";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { useWorkspaceCollaboratorDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { Collaborator } from "fimidara";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

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
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId,
    targetId: collaborator.resourceId,
    targetType: "user",
  });
  const deleteHook = useWorkspaceCollaboratorDeleteMutationHook({
    onSuccess(data, params) {
      message.success("Collaborator removed");
      onCompleteRemove();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error removing collaborator");
    },
  });

  const onSelectMenuItem = (info: MenuInfo) => {
    if (info.key === MenuKeys.DeleteItem) {
      Modal.confirm({
        title: "Are you sure you want to remove this collaborator?",
        okText: "Yes",
        cancelText: "No",
        okType: "primary",
        okButtonProps: { danger: true },
        onOk: async () => {
          await deleteHook.runAsync({
            body: { workspaceId, collaboratorId: collaborator.resourceId },
          });
        },
        onCancel() {
          // do nothing
        },
      });
    } else if (info.key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    }
  };

  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteItem,
      label: "Remove Collaborator",
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

export default CollaboratorMenu;
