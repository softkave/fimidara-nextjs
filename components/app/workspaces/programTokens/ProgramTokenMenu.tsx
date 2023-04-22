import { useRequest } from "ahooks";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import ProgramAccessTokenAPI from "../../../../lib/api/endpoints/programAccessToken";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";

export interface IProgramTokenMenuProps {
  token: IProgramAccessToken;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const ProgramTokenMenu: React.FC<IProgramTokenMenuProps> = (props) => {
  const { token, onCompleteDelete } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: token.workspaceId,
    targetType: AppResourceType.ProgramAccessToken,
    containerId: token.workspaceId,
    containerType: AppResourceType.Workspace,
    targetId: token.resourceId,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const deleteItem = React.useCallback(async () => {
    try {
      const result = await ProgramAccessTokenAPI.deleteToken({
        tokenId: token.resourceId,
      });

      checkEndpointResult(result);
      message.success("Token deleted");
      await onCompleteDelete();
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting token");
    }
  }, [token, onCompleteDelete]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: { key: string }) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this program access token?",
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

  return (
    <React.Fragment>
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={MenuKeys.UpdateItem}>
              <Link
                href={appWorkspacePaths.programTokenForm(
                  token.workspaceId,
                  token.resourceId
                )}
              >
                Update Token
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Access To Resource
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.DeleteItem}>Delete Token</Menu.Item>
          </Menu>
        }
      >
        <Button
          // type="text"
          className={appClasses.iconBtn}
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
      {grantPermissionFormNode}
    </React.Fragment>
  );
};

export default ProgramTokenMenu;
