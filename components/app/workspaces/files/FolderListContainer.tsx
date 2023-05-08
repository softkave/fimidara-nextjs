import { addRootnameToPath } from "@/lib/definitions/folder";
import { appWorkspacePaths } from "@/lib/definitions/system";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { Button, Space } from "antd";
import { Folder } from "fimidara";
import Link from "next/link";
import React from "react";
import { useFetchPaginatedResourceListFetchState } from "../../../../lib/hooks/fetchHookUtils";
import { useWorkspaceFoldersFetchHook } from "../../../../lib/hooks/fetchHooks";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import PaginatedContent from "../../../utils/page/PaginatedContent";
import { IPaginationData } from "../../../utils/page/utils";
import { appClasses } from "../../../utils/theme";
import FileListContainerHeader from "./FileListContainerHeader";
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
  const getParentHref = () => {
    if (!folder) {
      return "";
    }

    return folder.parentId
      ? appWorkspacePaths.folder(workspaceId, folder.parentId)
      : appWorkspacePaths.rootFolderList(workspaceId);
  };

  const renderGotoParentList = () => {
    return (
      folder && (
        <Link href={getParentHref()}>
          <span style={{ fontSize: "20px" }}>..</span> {folder.name}
        </Link>
      )
    );
  };

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
      <Space direction="vertical" style={{ width: "100%" }}>
        {renderGotoParentList()}
        <PageNothingFound
          className={appClasses.maxWidth420}
          messageText="No folders yet. Create one using the plus button above."
          actions={
            folder
              ? [
                  <Link key="go-to-parent-list-btn" href={getParentHref()}>
                    <Button type="link">Go to parent list</Button>
                  </Link>,
                ]
              : undefined
          }
        />
      </Space>
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

    contentNode = (
      <Space direction="vertical" style={{ width: "100%" }}>
        {renderGotoParentList()}
        {folderNode}
      </Space>
    );
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
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <FileListContainerHeader
          workspaceId={workspaceId}
          folder={folder}
          workspaceRootname={workspaceRootname}
        />
        <PaginatedContent
          content={contentNode}
          pagination={{ ...pagination, count }}
        />
      </Space>
    </div>
  );
};

export default FolderListContainer;
