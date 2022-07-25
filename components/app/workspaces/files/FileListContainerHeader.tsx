import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Dropdown, Menu, Space, Typography } from "antd";
import Link from "next/link";
import React from "react";
import { IFolder } from "../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import FolderMenu from "./FolderMenu";
import RootFilesMenu from "./RootFilesMenu";

export interface IFileListContainerHeaderProps {
  workspaceId: string;
  workspaceRootname: string;
  folder?: IFolder;
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
  return (
    <div className={classes.root}>
      <Typography.Title level={5} className={classes.title}>
        Files
      </Typography.Title>
      <Space className={classes.sideLinks}>
        <Dropdown
          trigger={["click"]}
          overlay={
            <Menu style={{ minWidth: "150px" }}>
              <Menu.Item key={CreateMenuKeys.CreateFolder}>
                <Link
                  href={appWorkspacePaths.createFolderForm(
                    workspaceId,
                    folder?.resourceId
                  )}
                >
                  Create Folder
                </Link>
              </Menu.Item>
              <Menu.Divider key={"divider-01"} />
              <Menu.Item key={CreateMenuKeys.CreateFile}>
                <Link
                  href={appWorkspacePaths.createFileForm(
                    workspaceId,
                    folder?.resourceId
                  )}
                >
                  Create File
                </Link>
              </Menu.Item>
            </Menu>
          }
        >
          <Button
            // type="text"
            className={appClasses.iconBtn}
            icon={<PlusOutlined />}
          ></Button>
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
