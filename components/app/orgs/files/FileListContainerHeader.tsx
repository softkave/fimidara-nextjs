import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Typography, Button, Space, Dropdown, Menu } from "antd";
import Link from "next/link";
import React from "react";
import { IFolder } from "../../../../lib/definitions/folder";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import FolderMenu from "./FolderMenu";
import RootFilesMenu from "./RootFilesMenu";

export interface IFileListContainerHeaderProps {
  orgId: string;
  folder?: IFolder;
  onCompleteRemove: () => any;
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
  const { orgId, folder, onCompleteRemove } = props;
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
                  href={appOrgPaths.createFolderForm(orgId, folder?.resourceId)}
                >
                  Create Folder
                </Link>
              </Menu.Item>
              <Menu.Divider key={"divider-01"} />
              <Menu.Item key={CreateMenuKeys.CreateFile}>
                <Link
                  href={appOrgPaths.createFileForm(orgId, folder?.resourceId)}
                >
                  Create File
                </Link>
              </Menu.Item>
            </Menu>
          }
        >
          <Button
            type="text"
            className={appClasses.iconBtn}
            icon={<PlusOutlined />}
          ></Button>
        </Dropdown>
        {folder ? (
          <FolderMenu folder={folder} />
        ) : (
          <RootFilesMenu orgId={orgId} />
        )}
      </Space>
    </div>
  );
};

export default FileListContainerHeader;
