import { Button, Dropdown, List, Menu, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useAppResponsive from "../../../../lib/hooks/useAppResponsive";
import { appClasses } from "../../../utils/theme";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { useSWRConfig } from "swr";
import { useRequest } from "ahooks";
import { SelectInfo } from "../../../utils/types";
import { getUseOrgRequestListHookKey } from "../../../../lib/hooks/orgs/useOrgRequestList";
import { ICollaborator } from "../../../../lib/definitions/user";
import CollaboratorAPI from "../../../../lib/api/endpoints/collaborators";
import { BsThreeDots } from "react-icons/bs";
import { css, cx } from "@emotion/css";

export interface ICollaboratorListProps {
  orgId: string;
  collaborators: ICollaborator[];
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

const CollaboratorList: React.FC<ICollaboratorListProps> = (props) => {
  const { orgId, collaborators } = props;
  const { mutate } = useSWRConfig();
  const responsive = useAppResponsive();
  const deleteItem = React.useCallback(
    async (itemId: string) => {
      const result = await CollaboratorAPI.removeCollaborator({
        organizationId: orgId,
        collaboratorId: itemId,
      });

      checkEndpointResult(result);
      mutate(getUseOrgRequestListHookKey(orgId));
    },
    [orgId, mutate]
  );

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo, itemId: string) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to remove this collaborator?",
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

  const renderMenu = (item: ICollaborator) => {
    return (
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu
            onSelect={(info) => onSelectMenuItem(info, item.resourceId)}
            style={{ minWidth: "150px" }}
          >
            <Menu.Item key={MenuKeys.UpdateItem}>
              <Link href={appOrgPaths.collaborator(orgId, item.resourceId)}>
                Update Permission Groups
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.DeleteItem}>Remove Collaborator</Menu.Item>
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

  return (
    <List
      className={cx(appClasses.main, classes.list)}
      itemLayout="horizontal"
      dataSource={collaborators}
      renderItem={(item) => (
        <List.Item key={item.resourceId} actions={[renderMenu(item)]}>
          <List.Item.Meta
            title={
              <Link href={appOrgPaths.request(orgId, item.resourceId)}>
                {item.firstName + " " + item.lastName}
              </Link>
            }
            description={item.email}
          />
        </List.Item>
      )}
    />
  );
};

export default CollaboratorList;
