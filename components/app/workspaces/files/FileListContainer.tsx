import { Button, Space } from "antd";
import Link from "next/link";
import React from "react";
import { IFile } from "../../../../lib/definitions/file";
import { IFolder } from "../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import useFileList from "../../../../lib/hooks/workspaces/useFileList";
import useWorkspace from "../../../../lib/hooks/workspaces/useWorkspace";
import { getBaseError } from "../../../../lib/utilities/errors";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import AppFileList from "./AppFileList";
import FileListContainerHeader from "./FileListContainerHeader";
import FolderList from "./FolderList";

export interface IFileListContainerProps {
  workspaceId: string;
  workspaceRootname: string;
  folder?: IFolder;
  renderFolderItem?: (
    item: IFolder,
    workspaceRootname: string
  ) => React.ReactNode;
  renderFolderList?: (
    items: IFolder[],
    workspaceRootname: string
  ) => React.ReactNode;
  renderFileItem?: (item: IFile, workspaceRootname: string) => React.ReactNode;
  renderFileList?: (
    items: IFile[],
    workspaceRootname: string
  ) => React.ReactNode;
  renderRoot?: (
    node: React.ReactNode,
    workspaceRootname: string
  ) => React.ReactElement;
}

const FileListContainer: React.FC<IFileListContainerProps> = (props) => {
  const {
    workspaceId,
    workspaceRootname,
    folder,
    renderFileItem,
    renderFileList,
    renderFolderItem,
    renderFolderList,
    renderRoot,
  } = props;

  const loadWorkspace = useWorkspace(workspaceId);
  const {
    data: fileListData,
    error: loadFileListError,
    isLoading: isLoadingFileList,
  } = useFileList({
    folderId: folder?.resourceId,
  });

  let content: React.ReactNode = null;
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
          <a>
            <span style={{ fontSize: "20px" }}>..</span> {folder.name}
          </a>
        </Link>
      )
    );
  };

  if (loadFileListError || loadWorkspace.error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(loadFileListError) ||
          getBaseError(loadWorkspace.error) ||
          "Error fetching files and folders"
        }
      />
    );
  } else if (
    isLoadingFileList ||
    !fileListData ||
    loadWorkspace.isLoading ||
    !loadWorkspace.data
  ) {
    content = <PageLoading messageText="Loading files and folders..." />;
  } else if (
    fileListData.files.length === 0 &&
    fileListData.folders.length === 0
  ) {
    content = (
      <Space direction="vertical" style={{ width: "100%" }}>
        {renderGotoParentList()}
        <PageNothingFound
          className={appClasses.maxWidth420}
          messageText="No files and folders yet. Create one using the plus button above."
          actions={
            folder
              ? [
                  <Link
                    passHref
                    key="go-to-parent-list-btn"
                    href={getParentHref()}
                  >
                    <Button type="link">Go to parent list</Button>
                  </Link>,
                ]
              : undefined
          }
        />
      </Space>
    );
  } else {
    const folderNode = fileListData.folders.length ? (
      renderFolderList ? (
        renderFolderList(fileListData.folders, workspaceRootname)
      ) : (
        <FolderList
          folders={fileListData.folders}
          workspaceRootname={workspaceRootname}
          renderFolderItem={renderFolderItem}
        />
      )
    ) : null;

    const fileNode = fileListData.files.length ? (
      renderFileList ? (
        renderFileList(fileListData.files, workspaceRootname)
      ) : (
        <AppFileList
          files={fileListData.files}
          renderFileItem={renderFileItem}
          workspaceRootname={loadWorkspace.data.workspace.rootname}
        />
      )
    ) : null;

    content = (
      <Space direction="vertical" style={{ width: "100%" }}>
        {renderGotoParentList()}
        {folderNode}
        {fileNode}
      </Space>
    );
  }

  if (renderRoot) {
    return renderRoot(content, workspaceRootname);
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <FileListContainerHeader
          workspaceId={workspaceId}
          folder={folder}
          workspaceRootname={workspaceRootname}
        />
        {content}
      </Space>
    </div>
  );
};

export default FileListContainer;
