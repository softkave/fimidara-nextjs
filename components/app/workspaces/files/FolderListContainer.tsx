import PageError from "@/components/utils/PageError";
import PageLoading from "@/components/utils/PageLoading";
import PageNothingFound from "@/components/utils/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { IPaginationData } from "@/components/utils/page/utils";
import { appClasses } from "@/components/utils/theme";
import { addRootnameToPath } from "@/lib/definitions/folder";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceFoldersFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
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
    workspaceId,
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
      ? addRootnameToPath(folder.namePath, workspaceRootname).join("/")
      : workspaceRootname,
  });
  const { count, error, isLoading, resourceList } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let contentNode: React.ReactNode = null;

  if (error) {
    contentNode = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching folders."}
      />
    );
  } else if (isLoading) {
    contentNode = <PageLoading messageText="Loading folders..." />;
  } else if (resourceList.length === 0) {
    contentNode = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No folders yet. Create one using the plus button above."
      />
    );
  } else {
    const folderNode = renderFolderList ? (
      renderFolderList(resourceList, workspaceRootname)
    ) : (
      <FolderList
        folders={resourceList}
        workspaceRootname={workspaceRootname}
        renderFolderItem={renderFolderItem}
      />
    );

    contentNode = folderNode;
  }

  if (renderRoot) {
    // TODO: handle pagination
    return renderRoot(contentNode, workspaceRootname, {
      ...pagination,
      count,
    });
  }

  // TODO: file list count
  return (
    <div className={appClasses.main}>
      <PaginatedContent
        content={contentNode}
        pagination={{ ...pagination, count }}
      />
    </div>
  );
};

export default FolderListContainer;
