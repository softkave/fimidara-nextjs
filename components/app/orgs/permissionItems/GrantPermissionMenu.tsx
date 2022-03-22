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
import { SelectInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import { getFormError } from "../../../form/formUtils";

export interface IGrantPermissionMenuProps {
  permissionOwnerType: AppResourceType;
  permissionOwnerId: string;
  type: AppResourceType;
  id?: string;
}

enum MenuKeys {
  GrantPermission = "grant-permission",
}

const GrantPermissionMenu: React.FC<IGrantPermissionMenuProps> = (props) => {
  const { permissionOwnerId, permissionOwnerType, type, id } = props;
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
    (info: SelectInfo) => {
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
      }
    },
    [deleteTokenHelper]
  );

  return (
    <Dropdown
      disabled={deleteTokenHelper.loading}
      trigger={["click"]}
      overlay={
        <Menu onSelect={onSelectMenuItem} style={{ minWidth: "150px" }}>
          <Menu.Item key={MenuKeys.GrantPermission}>Grant Permission</Menu.Item>
        </Menu>
      }
    >
      <Button
        type="text"
        className={appClasses.iconBtn}
        icon={<BsThreeDots />}
      ></Button>
    </Dropdown>
  );
};

export default GrantPermissionMenu;
