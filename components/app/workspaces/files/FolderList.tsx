import { List } from "antd";
import Link from "next/link";
import React from "react";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { css } from "@emotion/css";
import { IFolder } from "../../../../lib/definitions/folder";
import FolderMenu from "./FolderMenu";
import { FolderOutlined } from "@ant-design/icons";

export interface IFolderListProps {
  folders: IFolder[];
  renderFolderItem?: (item: IFolder) => React.ReactNode;
}

const classes = {
  list: css({
    "& .ant-list-item-action > li": {
      padding: "0px",
    },
  }),
};

const FolderList: React.FC<IFolderListProps> = (props) => {
  const { folders, renderFolderItem } = props;
  const internalRenderItem = React.useCallback(
    (item: IFolder) => (
      <List.Item
        key={item.resourceId}
        actions={[<FolderMenu key="menu" folder={item} />]}
      >
        <List.Item.Meta
          title={
            <Link
              href={appWorkspacePaths.folder(item.workspaceId, item.resourceId)}
            >
              {item.name}
            </Link>
          }
          description={item.description}
          avatar={<FolderOutlined />}
        />
      </List.Item>
    ),
    []
  );

  return (
    <List
      className={classes.list}
      itemLayout="horizontal"
      dataSource={folders}
      renderItem={renderFolderItem || internalRenderItem}
    />
  );
};

export default FolderList;
