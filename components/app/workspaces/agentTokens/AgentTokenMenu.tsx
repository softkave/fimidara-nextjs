import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useRequest } from "ahooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { AgentToken } from "fimidara";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useGrantPermission from "../../../hooks/useGrantPermission";
import IconButton from "../../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

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
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: token.workspaceId,
    targetType: "agentToken",
    containerId: token.workspaceId,
    containerType: "workspace",
    targetId: token.resourceId,
    appliesTo: "children",
  });

  const deleteToken = React.useCallback(async () => {
    try {
      const endpoints = getPublicFimidaraEndpointsUsingUserToken();
      const result = await endpoints.agentTokens.deleteToken({
        body: { tokenId: token.resourceId },
      });

      message.success("Token deleted.");
      await onCompleteDelete();
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting token.");
    }
  }, [token, onCompleteDelete]);

  const deleteTokenHelper = useRequest(deleteToken, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteToken) {
        Modal.confirm({
          title: "Are you sure you want to delete this token?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteTokenHelper.runAsync();
          },
          onCancel() {
            // do nothing
          },
        });
      } else if (info.key === MenuKeys.GrantPermission) {
        toggleVisibility();
      }
    },
    [deleteTokenHelper, toggleVisibility]
  );

  const items: MenuProps["items"] = [
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
          Update Permission Groups
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
  ];

  return (
    <React.Fragment>
      {grantPermissionFormNode}
      <Dropdown
        disabled={deleteTokenHelper.loading}
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
      >
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>
    </React.Fragment>
  );
};

export default AgentTokenMenu;
