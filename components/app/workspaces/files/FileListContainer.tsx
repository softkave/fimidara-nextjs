import PageError from "@/components/utils/PageError";
import PageLoading from "@/components/utils/PageLoading";
import PageNothingFound from "@/components/utils/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { IPaginationData } from "@/components/utils/page/utils";
import { appClasses } from "@/components/utils/theme";
import { addRootnameToPath } from "@/lib/definitions/folder";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceFilesFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { File, Folder } from "fimidara";
import React from "react";
import AppFileList from "./AppFileList";

export interface FileListContainerProps {
  workspaceId: string;
  workspaceRootname: string;
  folder?: Folder;
  renderFileItem?: (item: File, workspaceRootname: string) => React.ReactNode;
  renderFileList?: (
    items: File[],
    workspaceRootname: string
  ) => React.ReactNode;
  renderRoot?: (
    node: React.ReactNode,
    workspaceRootname: string,
    pagination: IPaginationData
  ) => React.ReactElement;
}

const FileListContainer: React.FC<FileListContainerProps> = (props) => {
  const {
    workspaceId,
    workspaceRootname,
    folder,
    renderFileItem,
    renderFileList,
    renderRoot,
  } = props;
  const pagination = usePagination();
  const { fetchState } = useWorkspaceFilesFetchHook({
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
        messageText={getBaseError(error) || "Error fetching files."}
      />
    );
  } else if (isLoading) {
    contentNode = <PageLoading messageText="Loading files..." />;
  } else if (resourceList.length === 0) {
    contentNode = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No files yet. Create one using the plus button above."
      />
    );
  } else {
    const fileNode = renderFileList ? (
      renderFileList(resourceList, workspaceRootname)
    ) : (
      <AppFileList
        files={resourceList}
        renderFileItem={renderFileItem}
        workspaceRootname={workspaceRootname}
      />
    );

    contentNode = fileNode;
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

export default FileListContainer;
