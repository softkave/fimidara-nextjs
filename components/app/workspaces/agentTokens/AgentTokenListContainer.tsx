import PageContent02 from "@/components/utils/page/PageContent02";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceAgentTokensFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { AgentToken } from "fimidara";
import React from "react";
import AgentTokenList from "./AgentTokenList";

export interface AgentTokenListContainerProps {
  workspaceId: string;
  renderItem?: (item: AgentToken) => React.ReactNode;
  renderList?: (items: AgentToken[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
}

const AgentTokenListContainer: React.FC<AgentTokenListContainerProps> = (
  props
) => {
  const { workspaceId, renderList, renderRoot, renderItem } = props;
  const pagination = usePagination();
  const { fetchState } = useWorkspaceAgentTokensFetchHook({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const { count, error, isLoading, resourceList, isDataFetched } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let contentNode = (
    <PageContent02
      error={error}
      isLoading={isLoading}
      isDataFetched={isDataFetched}
      data={resourceList}
      defaultErrorMessage="Error fetching agent tokens"
      defaultLoadingMessage="Loading agent tokens..."
      render={(data) => {
        if (data.length) {
          return renderList ? (
            renderList(data)
          ) : (
            <AgentTokenList
              workspaceId={workspaceId}
              tokens={resourceList}
              renderItem={renderItem}
            />
          );
        } else {
          return (
            <PageNothingFound
              message={
                "No agent tokens yet. " +
                "You can create one using the plus button above"
              }
            />
          );
        }
      }}
    />
  );

  contentNode = (
    <PaginatedContent
      content={contentNode}
      pagination={{ ...pagination, count }}
    />
  );

  if (renderRoot) {
    return renderRoot(contentNode);
  }

  return <React.Fragment>{contentNode}</React.Fragment>;
};

export default AgentTokenListContainer;
