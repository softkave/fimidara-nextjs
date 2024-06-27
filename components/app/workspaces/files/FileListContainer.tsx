import PageContent02 from "@/components/utils/page/PageContent02";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { IPaginationData } from "@/components/utils/page/utils";
import { addRootnameToPath } from "@/lib/definitions/folder";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceFilesFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
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
  const filesHook = useWorkspaceFilesFetchHook({
    page: pagination.page,
    pageSize: pagination?.pageSize,
    folderId: folder?.resourceId,
    folderpath: folder
      ? addRootnameToPath(folder.namepath, workspaceRootname).join("/")
      : workspaceRootname,
  });
  const { count, error, isLoading, resourceList, isDataFetched } =
    useFetchPaginatedResourceListFetchState(filesHook.fetchState);

  const contentNode = (
    <PageContent02
      error={error}
      isLoading={isLoading}
      isDataFetched={isDataFetched}
      data={resourceList}
      defaultErrorMessage="Error fetching files"
      defaultLoadingMessage="Loading files..."
      render={(data) =>
        renderFileList ? (
          renderFileList(data, workspaceRootname)
        ) : (
          <AppFileList
            files={data}
            renderFileItem={renderFileItem}
            workspaceRootname={workspaceRootname}
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

export default FileListContainer;
