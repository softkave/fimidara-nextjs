"use client";

import ItemList from "@/components/utils/list/ItemList";
import AppIcon from "@/components/utils/page/AppIcon";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { Folder } from "fimidara";
import { noop } from "lodash-es";
import { FolderIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
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
            <div className="flex flex-col justify-center">
              <Link
                href={appWorkspacePaths.folder(
                  item.workspaceId,
                  item.resourceId
                )}
              >
                {item.name}
              </Link>
              {item.description && (
                <span className="text-secondary">{item.description}</span>
              )}
            </div>
          }
          menu={
            <div className="flex flex-col justify-center h-full">
              <FolderMenu
                folder={item}
                workspaceRootname={workspaceRootname}
                onScheduleDeleteSuccess={noop}
              />
            </div>
          }
          prefixNode={
            <div className="flex flex-col justify-center">
              <AppIcon
                icon={<FolderIcon className="w-4 h-4" />}
                className={appClasses.alignStart}
                style={{ marginTop: "1px" }}
              />
            </div>
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
      emptyMessage="No folders yet"
      space="sm"
    />
  );
};

export default FolderList;
