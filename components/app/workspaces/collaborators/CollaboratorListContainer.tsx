import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaboratorsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
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
  const { count, error, isLoading, resourceList } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        message={getBaseError(error) || "Error fetching collaborators."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading collaborators..." />;
  } else if (resourceList.length === 0) {
    content = <PageNothingFound message="No collaborators yet." />;
  } else {
    content = renderList ? (
      renderList(resourceList as Collaborator[])
    ) : (
      <CollaboratorList
        workspaceId={workspaceId}
        collaborators={resourceList as Collaborator[]}
        renderItem={renderItem}
      />
    );
  }

  content = (
    <PaginatedContent
      content={content}
      pagination={count ? { ...pagination, count } : undefined}
    />
  );

  if (renderRoot) {
    return renderRoot(content);
  }

  return <React.Fragment>{content}</React.Fragment>;
};

export default CollaboratorListContainer;
