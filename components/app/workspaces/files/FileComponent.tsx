import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { Space } from "antd";
import { File } from "fimidara";
import { useRouter } from "next/router";
import FileMenu from "./FileMenu";

export interface FileComponentProps {
  file: File;
  workspaceRootname: string;
}

function FileComponent(props: FileComponentProps) {
  const { file, workspaceRootname } = props;
  const router = useRouter();

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={file.name}>
          <FileMenu
            file={file}
            workspaceRootname={workspaceRootname}
            onScheduleDeleteSuccess={() => {
              router.push(
                file.parentId
                  ? appWorkspacePaths.folder(file.workspaceId, file.parentId)
                  : appWorkspacePaths.rootFolderList(file.workspaceId)
              );
            }}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={file.resourceId}
        />
        {file.description && (
          <LabeledNode
            nodeIsText
            label="Description"
            node={file.description}
            direction="vertical"
          />
        )}
      </Space>
    </div>
  );
}

export default FileComponent;
