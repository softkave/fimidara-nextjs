import { appWorkspacePaths } from "@/lib/definitions/system";
import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Dropdown, MenuProps, Space, Typography } from "antd";
import { Folder } from "fimidara";
import Link from "next/link";
import React from "react";
import IconButton from "../../../utils/buttons/IconButton";
import FolderMenu from "./FolderMenu";
import RootFilesMenu from "./RootFilesMenu";

export interface IFileListContainerHeaderProps {
  workspaceId: string;
  workspaceRootname: string;
  folder?: Folder;
}

enum CreateMenuKeys {
  CreateFolder = "create-folder",
  CreateFile = "create-file",
}

const classes = {
  sideLinks: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
  root: css({
    display: "flex",
  }),
  title: css({
    flex: 1,
  }),
};

const FileListContainerHeader: React.FC<IFileListContainerHeaderProps> = (
  props
) => {
  const { workspaceId, folder, workspaceRootname } = props;
  const items: MenuProps["items"] = [
    {
      key: CreateMenuKeys.CreateFolder,
      label: (
        <Link
          href={appWorkspacePaths.createFolderForm(
            workspaceId,
            folder?.resourceId
          )}
        >
          Create Folder
        </Link>
      ),
    },
    {
      key: CreateMenuKeys.CreateFile,
      label: (
        <Link
          href={appWorkspacePaths.createFileForm(
            workspaceId,
            folder?.resourceId
          )}
        >
          Create File
        </Link>
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <Typography.Title level={5} className={classes.title}>
        Files
      </Typography.Title>
      <Space className={classes.sideLinks}>
        <Dropdown
          trigger={["click"]}
          menu={{ items, style: { minWidth: "150px" } }}
        >
          <IconButton icon={<PlusOutlined />} />
        </Dropdown>
        {folder ? (
          <FolderMenu folder={folder} workspaceRootname={workspaceRootname} />
        ) : (
          <RootFilesMenu workspaceId={workspaceId} />
        )}
      </Space>
    </div>
  );
};

export default FileListContainerHeader;
