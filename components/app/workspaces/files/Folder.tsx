import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import { appClasses } from "@/components/utils/theme";
import { Space } from "antd";
import { Folder } from "fimidara";
import { useRouter } from "next/router";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import FileListContainer from "./FileListContainer";
import FolderListContainer from "./FolderListContainer";
import FolderMenu from "./FolderMenu";

export interface FolderProps {
  folder: Folder;
  workspaceRootname: string;
}

function Folder(props: FolderProps) {
  const { folder, workspaceRootname } = props;
  const router = useRouter();

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={folder.name}>
          <FolderMenu
            folder={folder}
            workspaceRootname={workspaceRootname}
            onScheduleDeleteSuccess={() => {
              router.push(
                folder.parentId
                  ? appWorkspacePaths.folder(
                      folder.workspaceId,
                      folder.parentId
                    )
                  : appWorkspacePaths.rootFolderList(folder.workspaceId)
              );
            }}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={folder.resourceId}
        />
        {folder.description && (
          <LabeledNode
            nodeIsText
            label="Description"
            node={folder.description}
            direction="vertical"
          />
        )}
        <FolderListContainer
          workspaceId={folder.workspaceId}
          workspaceRootname={workspaceRootname}
          folder={folder}
        />
        <FileListContainer
          workspaceId={folder.workspaceId}
          workspaceRootname={workspaceRootname}
          folder={folder}
        />
      </Space>
    </div>
  );
}

export default Folder;
