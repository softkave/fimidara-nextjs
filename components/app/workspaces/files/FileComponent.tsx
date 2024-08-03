import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import BackButton from "@/components/utils/buttons/BackButton";
import { appClasses } from "@/components/utils/theme";
import { addRootnameToPath } from "@/lib/definitions/folder";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { formatDateTime } from "@/lib/utils/dateFns";
import { Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { File } from "fimidara";
import { useRouter } from "next/navigation";
import FileMenu from "./FileMenu";
import FolderParentLink from "./FolderParentLink";

export interface FileComponentProps {
  file: File;
  workspaceRootname: string;
}

function FileComponent(props: FileComponentProps) {
  const { file, workspaceRootname } = props;
  const router = useRouter();
  const extension = file.ext ? `.${file.ext}` : "";

  return (
    <div>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader
          title={file.name + extension}
          prefixNode={
            <FolderParentLink workspaceId={file.workspaceId} folder={file}>
              <BackButton />
            </FolderParentLink>
          }
        >
          <FileMenu
            file={file}
            workspaceRootname={workspaceRootname}
            onScheduleDeleteSuccess={() => {
              router.push(
                file.parentId
                  ? appWorkspacePaths.folder(file.workspaceId, file.parentId)
                  : appWorkspacePaths.folderList(file.workspaceId)
              );
            }}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          code
          direction="vertical"
          label="Resource ID"
          node={file.resourceId}
        />
        <LabeledNode
          nodeIsText
          copyable
          code
          direction="vertical"
          label="File Path"
          node={
            addRootnameToPath(file.namepath.join("/"), workspaceRootname) +
            extension
          }
        />
        <LabeledNode
          nodeIsText
          direction="vertical"
          label="Last Updated"
          node={formatDateTime(file.lastUpdatedAt)}
        />
        {file.description && (
          <LabeledNode
            direction="vertical"
            label="Description"
            node={
              <Paragraph
                ellipsis={{ rows: 2 }}
                className={appClasses.muteMargin}
              >
                {file.description}
              </Paragraph>
            }
          />
        )}
      </Space>
    </div>
  );
}

export default FileComponent;
