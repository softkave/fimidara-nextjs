"use client";

import PageContent02 from "@/components/utils/page/PageContent02";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaboratorsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { Collaborator } from "fimidara";
import React from "react";
import CollaboratorList from "./CollaboratorList";

export interface CollaboratorListContainer {
  workspaceId: string;
  renderItem?: (item: Collaborator) => React.ReactNode;
  renderList?: (items: Collaborator[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
}

const CollaboratorListContainer: React.FC<CollaboratorListContainer> = (
  props
) => {
  const { workspaceId, renderList, renderRoot, renderItem } = props;
  const pagination = usePagination();
  const { fetchState } = useWorkspaceCollaboratorsFetchHook({
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
      defaultErrorMessage="Error fetching collaborators"
      defaultLoadingMessage="Loading collaborators..."
      render={(data) => {
        if (data.length) {
          return renderList ? (
            renderList(resourceList as Collaborator[])
          ) : (
            <CollaboratorList
              workspaceId={workspaceId}
              collaborators={resourceList as Collaborator[]}
              renderItem={renderItem}
            />
          );
        } else {
          return <PageNothingFound message="No collaborators yet" />;
        }
      }}
    />
  );

  contentNode = (
    <PaginatedContent
      content={contentNode}
      pagination={count ? { ...pagination, count } : undefined}
    />
  );

  if (renderRoot) {
    return renderRoot(contentNode);
  }

  return <React.Fragment>{contentNode}</React.Fragment>;
};

export default CollaboratorListContainer;
