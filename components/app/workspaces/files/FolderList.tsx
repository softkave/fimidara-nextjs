import { appWorkspacePaths } from "@/lib/definitions/system";
import { FolderOutlined } from "@ant-design/icons";
import { Folder } from "fimidara";
import Link from "next/link";
import React from "react";
import ItemList from "../../../utils/list/ItemList";
import ThumbnailContent from "../../../utils/page/ThumbnailContent";
import FolderMenu from "./FolderMenu";

export interface FolderListProps {
  folders: Folder[];
  workspaceRootname: string;
  renderFolderItem?: (
    item: Folder,
    workspaceRootname: string
  ) => React.ReactNode;
}

const FolderList: React.FC<FolderListProps> = (props) => {
  const { folders, workspaceRootname, renderFolderItem } = props;
  const internalRenderItem = React.useCallback(
    (item: Folder) => {
      if (renderFolderItem) {
        return renderFolderItem(item, workspaceRootname);
      }

      return (
        <ThumbnailContent
          key={item.resourceId}
          main={
            <div>
              <Link
                href={appWorkspacePaths.folder(
                  item.workspaceId,
                  item.resourceId
                )}
              >
                {item.name}
              </Link>
              {item.description}
            </div>
          }
          menu={
            <FolderMenu
              key="menu"
              folder={item}
              workspaceRootname={workspaceRootname}
            />
          }
          prefixNode={<FolderOutlined />}
        />
      );
    },
    [renderFolderItem, workspaceRootname]
  );

  return (
    <ItemList
      items={folders}
      renderItem={internalRenderItem}
      getId={(item: Folder) => item.resourceId}
    />
  );
};

export default FolderList;
