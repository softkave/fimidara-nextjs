import { List } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import { getUseOrgProgramTokenListHookKey } from "../../../../lib/hooks/orgs/useOrgProgramTokenList";
import { css } from "@emotion/css";
import ProgramTokenMenu from "./ProgramTokenMenu";

export interface IProgramTokenListProps {
  orgId: string;
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
  const { orgId, tokens, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteDelete = React.useCallback(async () => {
    mutate(getUseOrgProgramTokenListHookKey(orgId));
  }, [orgId, mutate]);

  const internalRenderItem = React.useCallback(
    (item: IProgramAccessToken) => (
      <List.Item
        key={item.resourceId}
        actions={[
          <ProgramTokenMenu token={item} onCompleteDelete={onCompleteDelete} />,
        ]}
      >
        <List.Item.Meta
          title={
            <Link href={appOrgPaths.programToken(orgId, item.resourceId)}>
              {item.name}
            </Link>
          }
          description={item.description}
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

export default ProgramTokenList;
