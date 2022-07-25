import { FolderOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { List } from "antd";
import Link from "next/link";
import React from "react";
import { IFolder } from "../../../../lib/definitions/folder";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import FolderMenu from "./FolderMenu";

export interface IFolderListProps {
  folders: IFolder[];
  workspaceRootname: string;
  renderFolderItem?: (
    item: IFolder,
    workspaceRootname: string
  ) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const FolderList: React.FC<IFolderListProps> = (props) => {
  const { folders, workspaceRootname, renderFolderItem } = props;
  const internalRenderItem = React.useCallback(
    (item: IFolder) => {
      if (renderFolderItem) {
        return renderFolderItem(item, workspaceRootname);
      }

      return (
        <List.Item
          key={item.resourceId}
          actions={[
            <FolderMenu
              key="menu"
              folder={item}
              workspaceRootname={workspaceRootname}
            />,
          ]}
        >
          <List.Item.Meta
            title={
              <Link
                href={appWorkspacePaths.folder(
                  item.workspaceId,
                  item.resourceId
                )}
              >
                {item.name}
              </Link>
            }
            description={item.description}
            avatar={<FolderOutlined />}
          />
        </List.Item>
      );
    },
    [renderFolderItem, workspaceRootname]
  );

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={folders}
      renderItem={internalRenderItem}
    />
  );
};

export default FolderList;
