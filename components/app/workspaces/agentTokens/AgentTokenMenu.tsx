import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { appClasses } from "@/components/utils/theme";
import { MenuInfo } from "@/components/utils/types";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useWorkspaceAgentTokenDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { AgentToken } from "fimidara";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

export interface AgentTokenMenuProps {
  token: AgentToken;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteToken = "delete-token",
  UpdatePermissionGroups = "update-permissionGroups",
  GrantPermission = "grant-permission",
}

const AgentTokenMenu: React.FC<AgentTokenMenuProps> = (props) => {
  const { token, onCompleteDelete } = props;
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: token.workspaceId,
    targetId: token.resourceId,
    targetType: "agentToken",
  });
  const deleteHook = useWorkspaceAgentTokenDeleteMutationHook({
    onSuccess(data, params) {
      message.success("Agent token scheduled for deletion");
      onCompleteDelete();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting token");
    },
  });

  const onSelectMenuItem = (info: MenuInfo) => {
    if (info.key === MenuKeys.DeleteToken) {
      Modal.confirm({
        title: "Are you sure you want to delete this token?",
        okText: "Yes",
        cancelText: "No",
        okType: "primary",
        okButtonProps: { danger: true },
        onOk: async () => {
          await deleteHook.runAsync({
            body: { tokenId: token.resourceId },
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
      // TODO: only show if user has permission
      key: MenuKeys.UpdatePermissionGroups,
      label: (
        <Link
          href={appWorkspacePaths.agentTokenForm(
            token.workspaceId,
            token.resourceId
          )}
        >
          Update Agent Token
        </Link>
      ),
    },
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteToken,
      label: "Delete Token",
    },
  ]);

  return (
    <React.Fragment>
      {permissionsHook.node}
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
    </React.Fragment>
  );
};

export default AgentTokenMenu;
