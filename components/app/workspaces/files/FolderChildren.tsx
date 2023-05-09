import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { Space } from "antd";
import { Folder as FolderChildren } from "fimidara";
import Link from "next/link";
import FileListContainer from "./FileListContainer";
import FileListContainerHeader from "./FileListContainerHeader";
import FolderListContainer from "./FolderListContainer";

export interface FolderChildrenProps {
  folder?: FolderChildren;
  workspaceId: string;
  workspaceRootname: string;
}

function FolderChildren(props: FolderChildrenProps) {
  const { folder, workspaceRootname, workspaceId } = props;

  const getParentHref = () => {
    if (!folder) {
      return "#";
    }

    return folder.parentId
      ? appWorkspacePaths.folder(workspaceId, folder.parentId)
      : appWorkspacePaths.rootFolderList(workspaceId);
  };

  return (
    <div className={appClasses.main}>
      <FileListContainerHeader
        workspaceId={workspaceId}
        folder={folder}
        workspaceRootname={workspaceRootname}
      />
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        {folder && (
          <Link href={getParentHref()}>
            <span style={{ fontSize: "20px" }}>..</span> {folder.name}
          </Link>
        )}
        <FolderListContainer
          workspaceId={workspaceId}
          workspaceRootname={workspaceRootname}
          folder={folder}
        />
        <FileListContainer
          workspaceId={workspaceId}
          workspaceRootname={workspaceRootname}
          folder={folder}
        />
      </Space>
    </div>
  );
}

export default FolderChildren;
