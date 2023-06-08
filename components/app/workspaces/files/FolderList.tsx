import ItemList from "@/components/utils/list/ItemList";
import AppIcon from "@/components/utils/page/AppIcon";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { Typography } from "antd";
import { Folder } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
import { FiFolder } from "react-icons/fi";
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
            <div className={appClasses.thumbnailMain}>
              <Link
                href={appWorkspacePaths.folder(
                  item.workspaceId,
                  item.resourceId
                )}
              >
                {item.name}
              </Link>
              {item.description && (
                <Typography.Text type="secondary">
                  {item.description}
                </Typography.Text>
              )}
            </div>
          }
          menu={
            <FolderMenu
              key="menu"
              folder={item}
              workspaceRootname={workspaceRootname}
              onScheduleDeleteSuccess={noop}
            />
          }
          prefixNode={
            <AppIcon
              icon={<FiFolder />}
              className={appClasses.alignStart}
              style={{ marginTop: "1px" }}
            />
          }
        />
      );
    },
    [renderFolderItem, workspaceRootname]
  );

  return (
    <ItemList
      bordered
      items={folders}
      renderItem={internalRenderItem}
      getId={(item: Folder) => item.resourceId}
      emptyMessage="No folders yet."
    />
  );
};

export default FolderList;
