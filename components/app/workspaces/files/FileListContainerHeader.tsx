import { cn } from "@/components/utils.ts";
import IconButton from "@/components/utils/buttons/IconButton";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { appClasses } from "@/components/utils/theme";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { PlusOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import Title from "antd/es/typography/Title";
import { Folder } from "fimidara";
import { noop } from "lodash-es";
import Link from "next/link";
import React from "react";
import FolderMenu from "./FolderMenu";
import RootFilesMenu from "./RootFilesMenu";

export interface IFileListContainerHeaderProps extends StyleableComponentProps {
  workspaceId: string;
  workspaceRootname: string;
  folder?: Folder;
}

enum CreateMenuKeys {
  CreateFolder = "create-folder",
  CreateFile = "create-file",
}

const FileListContainerHeader: React.FC<IFileListContainerHeaderProps> = (
  props
) => {
  const { workspaceId, folder, workspaceRootname, style, className } = props;
  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      key: CreateMenuKeys.CreateFolder,
      label: (
        <Link
          href={appWorkspacePaths.createFolderForm(
            workspaceId,
            folder?.resourceId
          )}
        >
          Add Folder
        </Link>
      ),
    },
    {
      key: CreateMenuKeys.CreateFile,
      label: (
        <Link
          href={appWorkspacePaths.createFileForm(
            workspaceId,
            folder?.resourceId
          )}
        >
          Add File
        </Link>
      ),
    },
  ]);

  return (
    <div className={cn(className, "flex")} style={style}>
      <Title level={5} className={cn(appClasses.muteMargin, "flex-1")}>
        {folder?.name || "Files"}
      </Title>
      <div className="flex items-center space-x-2">
        <Dropdown
          trigger={["click"]}
          menu={{ items, style: { minWidth: "150px" } }}
          placement="bottomRight"
        >
          <IconButton icon={<PlusOutlined />} />
        </Dropdown>
        {folder ? (
          <FolderMenu
            folder={folder}
            workspaceRootname={workspaceRootname}
            onScheduleDeleteSuccess={noop}
          />
        ) : (
          <RootFilesMenu workspaceId={workspaceId} />
        )}
      </div>
    </div>
  );
};

export default FileListContainerHeader;
