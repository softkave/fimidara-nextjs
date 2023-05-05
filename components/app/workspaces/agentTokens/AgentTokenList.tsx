import { appWorkspacePaths } from "@/lib/definitions/system";
import { getResourceId } from "@/lib/utils/resource";
import { AgentToken } from "fimidara";
import Link from "next/link";
import React from "react";
import { useSWRConfig } from "swr";
import ItemList from "../../../utils/list/ItemList";
import ThumbnailContent from "../../../utils/page/ThumbnailContent";
import AgentTokenMenu from "./AgentTokenMenu";

export interface AgentTokenListProps {
  workspaceId: string;
  tokens: AgentToken[];
  renderItem?: (item: AgentToken) => React.ReactNode;
}

const AgentTokenList: React.FC<AgentTokenListProps> = (props) => {
  const { workspaceId, tokens, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteDelete = React.useCallback(async () => {
    mutate(getUseWorkspaceAgentTokenListHookKey(workspaceId));
  }, [workspaceId, mutate]);

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
          <AgentTokenMenu
            key="menu"
            token={item}
            onCompleteDelete={onCompleteDelete}
          />
        }
      />
    ),
    [onCompleteDelete, workspaceId]
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
