import { List } from "antd";
import Link from "next/link";
import React from "react";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import { getUseWorkspaceClientTokenListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceClientTokenList";
import { css } from "@emotion/css";
import ClientTokenMenu from "./ClientTokenMenu";

export interface IClientTokenListProps {
  workspaceId: string;
  tokens: IClientAssignedToken[];
  renderItem?: (item: IClientAssignedToken) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const ClientTokenList: React.FC<IClientTokenListProps> = (props) => {
  const { workspaceId, tokens, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteDelete = React.useCallback(async () => {
    mutate(getUseWorkspaceClientTokenListHookKey(workspaceId));
  }, [workspaceId, mutate]);

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

  const internalRenderItem = React.useCallback(
    (item: IClientAssignedToken) => (
      <List.Item
        key={item.resourceId}
        actions={[
          <ClientTokenMenu token={item} onCompleteDelete={onCompleteDelete} />,
        ]}
      >
        <List.Item.Meta
          title={
            <Link
              href={appWorkspacePaths.clientToken(workspaceId, item.resourceId)}
            >
              {item.resourceId}
            </Link>
          }
        />
      </List.Item>
    ),
    [onCompleteDelete]
  );

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={tokens}
      renderItem={renderItem || internalRenderItem}
    />
  );
};

export default ClientTokenList;
