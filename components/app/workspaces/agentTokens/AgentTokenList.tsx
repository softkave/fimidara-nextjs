import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { getResourceId } from "@/lib/utils/resource";
import { Typography } from "antd";
import { AgentToken } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
import AgentTokenMenu from "./AgentTokenMenu";

export interface AgentTokenListProps {
  workspaceId: string;
  tokens: AgentToken[];
  renderItem?: (item: AgentToken) => React.ReactNode;
}

const AgentTokenList: React.FC<AgentTokenListProps> = (props) => {
  const { workspaceId, tokens, renderItem } = props;

  // TODO: add a way to differentiate between the provided ID
  // and the resource ID

  const internalRenderItem = React.useCallback(
    (item: AgentToken) => (
      <ThumbnailContent
        key={item.resourceId}
        main={
          <div className={appClasses.thumbnailMain}>
            <Link
              href={appWorkspacePaths.agentToken(workspaceId, item.resourceId)}
            >
              {item.name || item.resourceId}
            </Link>
            {item.description && (
              <Typography.Text type="secondary">
                {item.description}
              </Typography.Text>
            )}
          </div>
        }
        menu={
          <AgentTokenMenu key="menu" token={item} onCompleteDelete={noop} />
        }
      />
    ),
    [workspaceId]
  );

  return (
    <ItemList
      bordered
      items={tokens}
      renderItem={renderItem || internalRenderItem}
      getId={getResourceId}
      emptyMessage="No agent tokens yet"
    />
  );
};

export default AgentTokenList;
