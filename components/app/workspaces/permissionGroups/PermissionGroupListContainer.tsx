import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspacePermissionGroupsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PermissionGroup } from "fimidara";
import React from "react";
import PermissionGroupList from "./PermissionGroupList";

export interface PermissionGroupListContainerProps {
  workspaceId: string;
  selectable?: boolean;
  withCheckbox?: boolean;
  selectedMap?: Record<string, boolean>;
  renderItem?: (item: PermissionGroup) => React.ReactNode;
  renderList?: (items: PermissionGroup[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  onSelect?: (item: PermissionGroup) => void;
}

const PermissionGroupListContainer: React.FC<
  PermissionGroupListContainerProps
> = (props) => {
  const {
    workspaceId,
    selectable,
    withCheckbox,
    selectedMap,
    renderItem,
    renderList,
    renderRoot,
    onSelect,
  } = props;

  const pagination = usePagination();
  const { fetchState } = useWorkspacePermissionGroupsFetchHook({
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
        message={getBaseError(error) || "Error fetching permission groups."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading permission groups..." />;
  } else if (resourceList.length === 0) {
    content = <PageNothingFound message="No permission groups yet." />;
  } else {
    content = renderList ? (
      renderList(resourceList)
    ) : (
      <PermissionGroupList
        workspaceId={workspaceId}
        permissionGroups={resourceList}
        renderItem={renderItem}
        selectable={selectable}
        withCheckbox={withCheckbox}
        selectedMap={selectedMap}
        onSelect={onSelect}
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

export default PermissionGroupListContainer;
