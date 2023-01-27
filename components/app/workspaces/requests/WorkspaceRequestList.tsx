import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Dropdown, List, Menu, message, Modal } from "antd";
import { last } from "lodash";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSWRConfig } from "swr";
import CollaborationRequestAPI from "../../../../lib/api/endpoints/collaborationRequest";
import { checkEndpointResult } from "../../../../lib/api/utils";
import {
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from "../../../../lib/definitions/collaborationRequest";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { getUseWorkspaceRequestListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceRequestList";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { SelectInfo } from "../../../utils/types";

export interface IWorkspaceRequestListProps {
  workspaceId: string;
  requests: ICollaborationRequest[];
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

const WorkspaceRequestList: React.FC<IWorkspaceRequestListProps> = (props) => {
  const { workspaceId, requests } = props;
  const { mutate } = useSWRConfig();
  const deleteItem = React.useCallback(
    async (itemId: string) => {
      try {
        const result = await CollaborationRequestAPI.deleteRequest({
          requestId: itemId,
        });

        checkEndpointResult(result);
        mutate(getUseWorkspaceRequestListHookKey(workspaceId));
        message.success("Request sent");
      } catch (error: any) {
        errorMessageNotificatition(error, "Error deleting request");
      }
    },
    [workspaceId, mutate]
  );

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo, itemId: string) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this collaboration request?",
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

  const renderMenu = (item: ICollaborationRequest) => {
    const status = last(item.statusHistory);
    const isPending = status?.status === CollaborationRequestStatusType.Pending;
    return (
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu
            onSelect={(info) => onSelectMenuItem(info, item.resourceId)}
            style={{ minWidth: "150px" }}
          >
            <Menu.Item key={MenuKeys.UpdateItem} disabled={!isPending}>
              <Link
                href={appWorkspacePaths.requestForm(
                  workspaceId,
                  item.resourceId
                )}
              >
                Update Request
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.DeleteItem} disabled={!isPending}>
              Delete Request
            </Menu.Item>
          </Menu>
        }
      >
        <Button
          // type="text"
          className={appClasses.iconBtn}
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
    );
  };

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={requests}
      renderItem={(item) => (
        <List.Item key={item.resourceId} actions={[renderMenu(item)]}>
          <List.Item.Meta
            title={
              <Link
                href={appWorkspacePaths.request(workspaceId, item.resourceId)}
              >
                {item.recipientEmail}
              </Link>
            }
            description={last(item.statusHistory)?.status}
          />
        </List.Item>
      )}
    />
  );
};

export default WorkspaceRequestList;
