import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { getResourceId } from "@/lib/utils/resource";
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
          <div>
            <Link
              href={appWorkspacePaths.agentToken(workspaceId, item.resourceId)}
            >
              {item.resourceId}
            </Link>
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
      items={tokens}
      renderItem={renderItem || internalRenderItem}
      getId={getResourceId}
    />
  );
};

export default AgentTokenList;
