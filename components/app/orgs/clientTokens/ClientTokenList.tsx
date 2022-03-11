import { Button, Dropdown, List, Menu, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useAppResponsive from "../../../../lib/hooks/useAppResponsive";
import { appClasses } from "../../../utils/theme";
import ClientAssignedTokenAPI from "../../../../lib/api/endpoints/clientAssignedToken";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { useSWRConfig } from "swr";
import { getUseOrgClientTokenListHookKey } from "../../../../lib/hooks/orgs/useOrgClientTokenList";
import { useRequest } from "ahooks";
import { SelectInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import { css, cx } from "@emotion/css";

export interface IClientTokenListProps {
  orgId: string;
  tokens: IClientAssignedToken[];
}

enum MenuKeys {
  DeleteToken = "delete-token",
  UpdatePresets = "update-presets",
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const ClientTokenList: React.FC<IClientTokenListProps> = (props) => {
  const { orgId, tokens } = props;
  const { mutate } = useSWRConfig();
  const responsive = useAppResponsive();
  const deleteToken = React.useCallback(
    async (tokenId: string) => {
      const result = await ClientAssignedTokenAPI.deleteToken({
        tokenId,
      });

      checkEndpointResult(result);
      mutate(getUseOrgClientTokenListHookKey(orgId));
    },
    [orgId, mutate]
  );

  const deleteTokenHelper = useRequest(deleteToken, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo, tokenId: string) => {
      if (info.key === MenuKeys.DeleteToken) {
        Modal.confirm({
          title: "Are you sure you want to delete this token?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteTokenHelper.runAsync(tokenId);
          },
          onCancel() {
            // do nothing
          },
        });
      }
    },
    [deleteTokenHelper]
  );

  const renderMenu = (item: IClientAssignedToken) => (
    <Dropdown
      disabled={deleteTokenHelper.loading}
      trigger={["click"]}
      overlay={
        <Menu
          onSelect={(info) => onSelectMenuItem(info, item.resourceId)}
          style={{ minWidth: "150px" }}
        >
          <Menu.Item key={MenuKeys.UpdatePresets}>
            <Link href={appOrgPaths.clientTokenForm(orgId, item.resourceId)}>
              Update Permission Groups
            </Link>
          </Menu.Item>
          <Menu.Divider key={"divider-01"} />
          <Menu.Item key={MenuKeys.DeleteToken}>Delete Token</Menu.Item>
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

  // TODO: add a way to differentiate between the provided ID
  // and the resource ID

  // const renderDateAndAgent = (item: IClientAssignedToken) => (
  //   <Typography.Text>
  //     <Space split={<Middledot />}>
  //       {item.lastUpdatedAt
  //         ? "Last updated " +
  //           formatRelative(new Date(item.lastUpdatedAt), new Date())
  //         : "Created " + formatRelative(new Date(item.createdAt), new Date())}
  //       {item.lastUpdatedBy?.agentType || item.createdBy.agentType}
  //     </Space>
  //   </Typography.Text>
  // );

  return (
    <List
      className={cx(appClasses.main, classes.list)}
      itemLayout="horizontal"
      dataSource={tokens}
      renderItem={(item) => (
        <List.Item key={item.resourceId} actions={[renderMenu(item)]}>
          <List.Item.Meta
            title={
              <Link href={appOrgPaths.clientToken(orgId, item.resourceId)}>
                {item.providedResourceId || item.resourceId}
              </Link>
            }
          />
          {responsive.lg}
        </List.Item>
      )}
    />
  );
};

export default ClientTokenList;
