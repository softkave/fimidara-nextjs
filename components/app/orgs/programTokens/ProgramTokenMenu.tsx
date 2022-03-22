import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
import { useRequest } from "ahooks";
import { BsThreeDots } from "react-icons/bs";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import ProgramAccessTokenAPI from "../../../../lib/api/endpoints/programAccessToken";
import { getFormError } from "../../../form/formUtils";

export interface IProgramTokenMenuProps {
  token: IProgramAccessToken;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
}

const ProgramTokenMenu: React.FC<IProgramTokenMenuProps> = (props) => {
  const { token, onCompleteDelete } = props;
  const deleteItem = React.useCallback(async () => {
    try {
      const result = await ProgramAccessTokenAPI.deleteToken({
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
      }
    },
    [deleteItemHelper]
  );

  return (
    <Dropdown
      disabled={deleteItemHelper.loading}
      trigger={["click"]}
      overlay={
        <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
          <Menu.Item key={MenuKeys.UpdateItem}>
            <Link
              href={appOrgPaths.programTokenForm(
                token.organizationId,
                token.resourceId
              )}
            >
              Update Token
            </Link>
          </Menu.Item>
          <Menu.Divider key={"divider-01"} />
          <Menu.Item key={MenuKeys.DeleteItem}>Delete Token</Menu.Item>
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

export default ProgramTokenMenu;
