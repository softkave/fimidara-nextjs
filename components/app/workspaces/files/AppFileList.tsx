"use client";

import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { kAppWorkspacePaths } from "@/lib/definitions/system";
import { File } from "fimidara";
import { noop } from "lodash-es";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import FileMenu from "./FileMenu";

export interface IAppFileListProps {
  files: File[];
  workspaceRootname: string;
  renderFileItem?: (item: File, workspaceRootname: string) => React.ReactNode;
}

const AppFileList: React.FC<IAppFileListProps> = (props) => {
  const { files, workspaceRootname, renderFileItem } = props;
  const internalRenderItem = React.useCallback(
    (item: File) => {
      if (renderFileItem) {
        return renderFileItem(item, workspaceRootname);
      }

      const extension = item.ext ? `.${item.ext}` : "";
      return (
        <ThumbnailContent
          key={item.resourceId}
          main={
            <div className="flex flex-col justify-center">
              <Link
                href={kAppWorkspacePaths.file(
                  item.workspaceId,
                  item.resourceId
                )}
              >
                {item.name + extension}
              </Link>
              {item.description && (
                <span className="text-secondary">{item.description}</span>
              )}
            </div>
          }
          menu={
            <div className="flex flex-col justify-center h-full">
              <FileMenu
                workspaceRootname={workspaceRootname}
                file={item}
                onScheduleDeleteSuccess={noop}
              />
            </div>
          }
          prefixNode={
            <div className="flex flex-col justify-center">
              <FileIcon className="h-4 w-4" />
            </div>
          }
        />
      );
    },
    [renderFileItem, workspaceRootname]
  );

  return (
    <ItemList
      bordered
      items={files}
      renderItem={internalRenderItem}
      getId={(item: File) => item.resourceId}
      emptyMessage="No files yet"
      space="sm"
    />
  );
};

export default AppFileList;
