import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { Space } from "antd";
import { Folder } from "fimidara";
import { useRouter } from "next/router";
import FolderChildren from "./FolderChildren";
import FolderMenu from "./FolderMenu";

export interface FolderProps {
  folder: Folder;
  workspaceRootname: string;
}

function FolderComponent(props: FolderProps) {
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
        <FolderChildren
          folder={folder}
          workspaceId={folder.workspaceId}
          workspaceRootname={workspaceRootname}
        />
      </Space>
    </div>
  );
}

export default FolderComponent;
