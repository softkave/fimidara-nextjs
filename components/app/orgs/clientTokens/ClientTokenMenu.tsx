import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import {
  appOrgPaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import ClientAssignedTokenAPI from "../../../../lib/api/endpoints/clientAssignedToken";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
import { useRequest } from "ahooks";
import { MenuInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import { getFormError } from "../../../form/formUtils";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";

export interface IClientTokenMenuProps {
  token: IClientAssignedToken;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteToken = "delete-token",
  UpdatePresets = "update-presets",
  GrantPermission = "grant-permission",
}

const ClientTokenMenu: React.FC<IClientTokenMenuProps> = (props) => {
  const { token, onCompleteDelete } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    orgId: token.organizationId,
    itemResourceType: AppResourceType.ClientAssignedToken,
    permissionOwnerId: token.organizationId,
    permissionOwnerType: AppResourceType.Organization,
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
      message.error(
        getFormError(processEndpointError(error)) || "Error deleting token"
      );
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
            <Menu.Item key={MenuKeys.UpdatePresets}>
              <Link
                href={appOrgPaths.clientTokenForm(
                  token.organizationId,
                  token.resourceId
                )}
              >
                Update Permission Groups
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Permission
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
