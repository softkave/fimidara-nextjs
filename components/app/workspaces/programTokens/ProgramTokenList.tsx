import { List } from "antd";
import Link from "next/link";
import React from "react";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import { getUseWorkspaceProgramTokenListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceProgramTokenList";
import { css } from "@emotion/css";
import ProgramTokenMenu from "./ProgramTokenMenu";

export interface IProgramTokenListProps {
  workspaceId: string;
  tokens: IProgramAccessToken[];
  renderItem?: (item: IProgramAccessToken) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const ProgramTokenList: React.FC<IProgramTokenListProps> = (props) => {
  const { workspaceId, tokens, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteDelete = React.useCallback(async () => {
    mutate(getUseWorkspaceProgramTokenListHookKey(workspaceId));
  }, [workspaceId, mutate]);

  const internalRenderItem = React.useCallback(
    (item: IProgramAccessToken) => (
      <List.Item
        key={item.resourceId}
        actions={[
          <ProgramTokenMenu
            key={"menu"}
            token={item}
            onCompleteDelete={onCompleteDelete}
          />,
        ]}
      >
        <List.Item.Meta
          title={
            <Link
              href={appWorkspacePaths.programToken(
                workspaceId,
                item.resourceId
              )}
            >
              {item.name}
            </Link>
          }
          description={item.description}
        />
      </List.Item>
    ),
    [onCompleteDelete, workspaceId]
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

export default ProgramTokenList;
