import { useRequest } from "ahooks";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import ClientAssignedTokenAPI from "../../../../lib/api/endpoints/clientAssignedToken";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

export interface IClientTokenMenuProps {
  token: IClientAssignedToken;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteToken = "delete-token",
  UpdatePermissionGroups = "update-permissionGroups",
  GrantPermission = "grant-permission",
}

const ClientTokenMenu: React.FC<IClientTokenMenuProps> = (props) => {
  const { token, onCompleteDelete } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: token.workspaceId,
    itemResourceType: AppResourceType.ClientAssignedToken,
    permissionOwnerId: token.workspaceId,
    permissionOwnerType: AppResourceType.Workspace,
    itemResourceId: token.resourceId,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const deleteToken = React.useCallback(async () => {
    try {
      const result = await ClientAssignedTokenAPI.deleteToken({
        tokenId: token.resourceId,
      });

      checkEndpointResult(result);
      message.success("Token deleted");
      await onCompleteDelete();
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting token");
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

  return (
    <React.Fragment>
      {grantPermissionFormNode}
      <Dropdown
        disabled={deleteTokenHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={MenuKeys.UpdatePermissionGroups}>
              <Link
                href={appWorkspacePaths.clientTokenForm(
                  token.workspaceId,
                  token.resourceId
                )}
              >
                Update Permission Groups
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Access To Resource
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.DeleteToken}>Delete Token</Menu.Item>
          </Menu>
        }
      >
        <Button
          // type="text"
          className={appClasses.iconBtn}
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
    </React.Fragment>
  );
};

export default ClientTokenMenu;
