import { appWorkspacePaths } from "@/lib/definitions/system";
import { FileOutlined } from "@ant-design/icons";
import { File } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
import ItemList from "../../../utils/list/ItemList";
import ThumbnailContent from "../../../utils/page/ThumbnailContent";
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

      return (
        <ThumbnailContent
          key={item.resourceId}
          main={
            <div>
              <Link
                href={appWorkspacePaths.file(item.workspaceId, item.resourceId)}
              >
                {item.name}
              </Link>
              {item.description}
            </div>
          }
          menu={
            <FileMenu
              workspaceRootname={workspaceRootname}
              file={item}
              onScheduleDeleteSuccess={noop}
            />
          }
          prefixNode={<FileOutlined />}
        />
      );
    },
    [renderFileItem, workspaceRootname]
  );

  return (
    <ItemList
      items={files}
      renderItem={internalRenderItem}
      getId={(item: File) => item.resourceId}
    />
  );
};

export default AppFileList;
