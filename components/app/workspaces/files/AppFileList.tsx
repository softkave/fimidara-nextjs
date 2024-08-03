"use client";

import ItemList from "@/components/utils/list/ItemList";
import AppIcon from "@/components/utils/page/AppIcon";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import Text from "antd/es/typography/Text";
import { File } from "fimidara";
import { noop } from "lodash-es";
import Link from "next/link";
import React from "react";
import { FiFile } from "react-icons/fi";
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
            <div className={appClasses.thumbnailMain}>
              <Link
                href={appWorkspacePaths.file(item.workspaceId, item.resourceId)}
              >
                {item.name + extension}
              </Link>
              {item.description && (
                <Text type="secondary">{item.description}</Text>
              )}
            </div>
          }
          menu={
            <FileMenu
              workspaceRootname={workspaceRootname}
              file={item}
              onScheduleDeleteSuccess={noop}
            />
          }
          prefixNode={
            <AppIcon
              icon={<FiFile />}
              className={appClasses.alignStart}
              style={{ marginTop: "1px" }}
            />
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
    />
  );
};

export default AppFileList;
