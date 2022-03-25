import { Space } from "antd";
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
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No files and folders yet. Create one using the plus button above."
      />
    );
  } else {
    const folderNode =
      data.folders && renderFolderList ? (
        renderFolderList(data.folders)
      ) : (
        <FolderList
          folders={data.folders}
          renderFolderItem={renderFolderItem}
        />
      );

    const fileNode =
      data.files && renderFileList ? (
        renderFileList(data.files)
      ) : (
        <AppFileList files={data.files} renderFileItem={renderFileItem} />
      );

    content = (
      <Space direction="vertical">
        {folder && (
          <Link
            href={
              folder.parentId
                ? appOrgPaths.folder(orgId, folder.parentId)
                : appOrgPaths.rootFolderList(orgId)
            }
          >
            ..
          </Link>
        )}
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
