import { Button, Space, Typography } from "antd";
import Link from "next/link";
import React from "react";
import { IFile } from "../../../../lib/definitions/file";
import { IFolder } from "../../../../lib/definitions/folder";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useFileList from "../../../../lib/hooks/orgs/useFileList";
import { getBaseError } from "../../../../lib/utilities/errors";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import AppFileList from "./AppFileList";
import FileListContainerHeader from "./FileListContainerHeader";
import FolderList from "./FolderList";

export interface IFileListContainerProps {
  orgId: string;
  folder?: IFolder;
  renderFolderItem?: (item: IFolder) => React.ReactNode;
  renderFolderList?: (items: IFolder[]) => React.ReactNode;
  renderFileItem?: (item: IFile) => React.ReactNode;
  renderFileList?: (items: IFile[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
}

const FileListContainer: React.FC<IFileListContainerProps> = (props) => {
  const {
    orgId,
    folder,
    renderFileItem,
    renderFileList,
    renderFolderItem,
    renderFolderList,
    renderRoot,
  } = props;

  const { data, error, isLoading, mutate } = useFileList({
    organizationId: orgId,
    folderId: folder?.resourceId,
  });

  let content: React.ReactNode = null;
  const getParentHref = () => {
    if (!folder) {
      return "";
    }

    return folder.parentId
      ? appOrgPaths.folder(orgId, folder.parentId)
      : appOrgPaths.rootFolderList(orgId);
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

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching files and folders"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading files and folders..." />;
  } else if (data.files.length === 0 && data.folders.length === 0) {
    content = (
      <Space direction="vertical" style={{ width: "100%" }}>
        {renderGotoParentList()}
        <PageNothingFound
          className={appClasses.maxWidth420}
          messageText="No files and folders yet. Create one using the plus button above."
          actions={
            folder
              ? [
                  <Link href={getParentHref()}>
                    <Button type="link">Go to parent list</Button>
                  </Link>,
                ]
              : undefined
          }
        />
      </Space>
    );
  } else {
    const folderNode = data.folders.length ? (
      renderFolderList ? (
        renderFolderList(data.folders)
      ) : (
        <FolderList
          folders={data.folders}
          renderFolderItem={renderFolderItem}
        />
      )
    ) : null;

    const fileNode = data.files.length ? (
      renderFileList ? (
        renderFileList(data.files)
      ) : (
        <AppFileList files={data.files} renderFileItem={renderFileItem} />
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
    return renderRoot(content);
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <FileListContainerHeader
          orgId={orgId}
          folder={folder}
          onCompleteRemove={mutate}
        />
        {content}
      </Space>
    </div>
  );
};

export default FileListContainer;
