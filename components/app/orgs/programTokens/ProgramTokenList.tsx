import { Button, Dropdown, List, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useAppResponsive from "../../../../lib/hooks/useAppResponsive";
import { appClasses } from "../../../utils/theme";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
import { useSWRConfig } from "swr";
import { useRequest } from "ahooks";
import { SelectInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import ProgramAccessTokenAPI from "../../../../lib/api/endpoints/programAccessToken";
import { getUseOrgProgramTokenListHookKey } from "../../../../lib/hooks/orgs/useOrgProgramTokenList";
import { css } from "@emotion/css";
import { getFormError } from "../../../form/formUtils";

export interface IProgramTokenListProps {
  orgId: string;
  tokens: IProgramAccessToken[];
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const ProgramTokenList: React.FC<IProgramTokenListProps> = (props) => {
  const { orgId, tokens } = props;
  const { mutate } = useSWRConfig();
  const responsive = useAppResponsive();
  const deleteItem = React.useCallback(
    async (itemId: string) => {
      try {
        const result = await ProgramAccessTokenAPI.deleteToken({
          tokenId: itemId,
        });

        checkEndpointResult(result);
        mutate(getUseOrgProgramTokenListHookKey(orgId));
        message.success("Token deleted");
      } catch (error: any) {
        message.error(
          getFormError(processEndpointError(error)) || "Error deleting token"
        );
      }
    },
    [orgId, mutate]
  );

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo, itemId: string) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this program access token?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteItemHelper.runAsync(itemId);
          },
          onCancel() {
            // do nothing
          },
        });
      }
    },
    [deleteItemHelper]
  );

  const renderMenu = (item: IProgramAccessToken) => (
    <Dropdown
      disabled={deleteItemHelper.loading}
      trigger={["click"]}
      overlay={
        <Menu
          onSelect={(info) => onSelectMenuItem(info, item.resourceId)}
          style={{ minWidth: "150px" }}
        >
          <Menu.Item key={MenuKeys.UpdateItem}>
            <Link href={appOrgPaths.programTokenForm(orgId, item.resourceId)}>
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

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={tokens}
      renderItem={(item) => (
        <List.Item key={item.resourceId} actions={[renderMenu(item)]}>
          <List.Item.Meta
            title={
              <Link href={appOrgPaths.programToken(orgId, item.resourceId)}>
                {item.name}
              </Link>
            }
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
};

export default ProgramTokenList;
