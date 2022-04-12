import { List } from "antd";
import Link from "next/link";
import React from "react";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import { getUseWorkspaceRequestListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceRequestList";
import { ICollaborator } from "../../../../lib/definitions/user";
import { css } from "@emotion/css";
import CollaboratorMenu from "./CollaboratorMenu";

export interface ICollaboratorListProps {
  workspaceId: string;
  collaborators: ICollaborator[];
  renderItem?: (item: ICollaborator) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const CollaboratorList: React.FC<ICollaboratorListProps> = (props) => {
  const { workspaceId, collaborators, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteRemoveUser = React.useCallback(async () => {
    mutate(getUseWorkspaceRequestListHookKey(workspaceId));
  }, [workspaceId, mutate]);

  const internalRenderItem = React.useCallback(
    (item: ICollaborator) => (
      <List.Item
        key={item.resourceId}
        actions={[
          <CollaboratorMenu
            collaborator={item}
            workspaceId={workspaceId}
            onCompleteRemove={onCompleteRemoveUser}
          />,
        ]}
      >
        <List.Item.Meta
          title={
            <Link
              href={appWorkspacePaths.collaborator(
                workspaceId,
                item.resourceId
              )}
            >
              {item.firstName + " " + item.lastName}
            </Link>
          }
          description={item.email}
        />
      </List.Item>
    ),
    [onCompleteRemoveUser]
  );

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={collaborators}
      renderItem={renderItem || internalRenderItem}
    />
  );
};

export default CollaboratorList;
