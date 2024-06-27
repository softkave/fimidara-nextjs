import PageContent02 from "@/components/utils/page/PageContent02";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { IPaginationData } from "@/components/utils/page/utils";
import { addRootnameToPath } from "@/lib/definitions/folder";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceFoldersFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { Folder } from "fimidara";
import React from "react";
import FolderList from "./FolderList";

export interface FolderListContainerProps {
  workspaceId: string;
  workspaceRootname: string;
  folder?: Folder;
  renderFolderItem?: (
    item: Folder,
    workspaceRootname: string
  ) => React.ReactNode;
  renderFolderList?: (
    items: Folder[],
    workspaceRootname: string
  ) => React.ReactNode;
  renderRoot?: (
    node: React.ReactNode,
    workspaceRootname: string,
    pagination: IPaginationData
  ) => React.ReactElement;
}

const FolderListContainer: React.FC<FolderListContainerProps> = (props) => {
  const {
    workspaceRootname,
    folder,
    renderFolderItem,
    renderFolderList,
    renderRoot,
  } = props;

  const pagination = usePagination();
  const { fetchState } = useWorkspaceFoldersFetchHook({
    page: pagination.page,
    pageSize: pagination?.pageSize,
    folderId: folder?.resourceId,
    folderpath: folder
      ? addRootnameToPath(folder.namepath, workspaceRootname).join("/")
      : workspaceRootname,
  });
  const { count, error, isLoading, resourceList, isDataFetched } =
    useFetchPaginatedResourceListFetchState(fetchState);

  const contentNode = (
    <PageContent02
      error={error}
      isLoading={isLoading}
      isDataFetched={isDataFetched}
      data={resourceList}
      defaultErrorMessage="Error fetching folders"
      defaultLoadingMessage="Loading folders..."
      render={(data) =>
        renderFolderList ? (
          renderFolderList(data, workspaceRootname)
        ) : (
          <FolderList
            folders={data}
            workspaceRootname={workspaceRootname}
            renderFolderItem={renderFolderItem}
          />
        )
      }
    />
  );

  if (renderRoot) {
    // TODO: handle pagination
    return renderRoot(contentNode, workspaceRootname, {
      ...pagination,
      count,
    });
  }

  // TODO: file list count
  return (
    <PaginatedContent
      content={contentNode}
      pagination={{ ...pagination, count }}
    />
  );
};

export default FolderListContainer;
