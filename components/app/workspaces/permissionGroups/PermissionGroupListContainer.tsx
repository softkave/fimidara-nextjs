"use client";

import PageContent02 from "@/components/utils/page/PageContent02";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspacePermissionGroupsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
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
  const { count, error, isLoading, resourceList, isDataFetched } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let contentNode = (
    <PageContent02
      error={error}
      isLoading={isLoading}
      isDataFetched={isDataFetched}
      data={resourceList}
      defaultErrorMessage="Error fetching permission groups"
      defaultLoadingMessage="Loading permission groups..."
      render={(data) => {
        if (data.length) {
          return renderList ? (
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
        } else {
          return <PageNothingFound message="No permission groups yet" />;
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

export default PermissionGroupListContainer;
