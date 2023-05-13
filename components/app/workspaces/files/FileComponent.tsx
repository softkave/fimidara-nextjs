import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { Space, Typography } from "antd";
import { File } from "fimidara";
import { useRouter } from "next/router";
import { addRootnameToPath } from "../../../../lib/definitions/folder";
import { formatDateTime } from "../../../../lib/utils/dateFns";
import BackButton from "../../../utils/buttons/BackButton";
import { appClasses } from "../../../utils/theme";
import FileMenu from "./FileMenu";
import FolderParentLink from "./FolderParentLink";

export interface FileComponentProps {
  file: File;
  workspaceRootname: string;
}

function FileComponent(props: FileComponentProps) {
  const { file, workspaceRootname } = props;
  const router = useRouter();
  const extension = file.extension ? `.${file.extension}` : "";

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
            addRootnameToPath(file.namePath.join("/"), workspaceRootname) +
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
              <Typography.Paragraph
                ellipsis={{ rows: 2 }}
                className={appClasses.muteMargin}
              >
                {file.description}
              </Typography.Paragraph>
            }
          />
        )}
      </Space>
    </div>
  );
}

export default FileComponent;
