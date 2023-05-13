import { useWorkspaceCollaboratorDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { Collaborator } from "fimidara";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useGrantPermission from "../../../hooks/useGrantPermission";
import IconButton from "../../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";
import { insertAntdMenuDivider } from "../../../utils/utils";

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
    targetType: "user",
    containerId: workspaceId,
    containerType: "workspace",
    targetId: collaborator.resourceId,
    appliesTo: "children",
  });

  const deleteHook = useWorkspaceCollaboratorDeleteMutationHook({
    onSuccess(data, params) {
      message.success("Collaborator removed.");
      onCompleteRemove();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error removing collaborator.");
    },
  });

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
            await deleteHook.runAsync({
              body: { workspaceId, collaboratorId: collaborator.resourceId },
            });
          },
          onCancel() {
            // do nothing
          },
        });
      } else if (info.key === MenuKeys.GrantPermission) {
        toggleVisibility();
      }
    },
    [deleteHook, toggleVisibility]
  );

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
      {grantPermissionFormNode}
    </React.Fragment>
  );
};

export default CollaboratorMenu;
