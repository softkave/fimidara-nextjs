import { FileOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { List } from "antd";
import Link from "next/link";
import React from "react";
import { IFile } from "../../../../lib/definitions/file";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import FileMenu from "./FileMenu";

export interface IAppFileListProps {
  files: IFile[];
  workspaceRootname: string;
  renderFileItem?: (item: IFile, workspaceRootname: string) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const AppFileList: React.FC<IAppFileListProps> = (props) => {
  const { files, workspaceRootname, renderFileItem } = props;
  const internalRenderItem = React.useCallback(
    (item: IFile) => {
      if (renderFileItem) {
        return renderFileItem(item, workspaceRootname);
      }

      return (
        <List.Item
          key={item.resourceId}
          actions={[
            <FileMenu
              key="menu"
              file={item}
              workspaceRootname={workspaceRootname}
            />,
          ]}
        >
          <List.Item.Meta
            title={
              <Link
                href={appWorkspacePaths.file(item.workspaceId, item.resourceId)}
              >
                {item.name}
              </Link>
            }
            description={item.description}
            avatar={<FileOutlined />}
          />
        </List.Item>
      );
    },
    [renderFileItem, workspaceRootname]
  );

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={files}
      renderItem={internalRenderItem}
    />
  );
};

export default AppFileList;
