import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import IconButton from "@/components/utils/buttons/IconButton.tsx";
import { addRootnameToPath } from "@/lib/definitions/folder";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { formatDateTime } from "@/lib/utils/dateFns";
import { File } from "fimidara";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
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
      <div className="space-y-8">
        <ComponentHeader
          title={file.name + extension}
          prefixNode={
            <FolderParentLink workspaceId={file.workspaceId} folder={file}>
              <IconButton icon={<FiArrowLeft />} />
            </FolderParentLink>
          }
        >
          <FileMenu
            file={file}
            workspaceRootname={workspaceRootname}
            onScheduleDeleteSuccess={() => {
              router.push(
                file.parentId
                  ? kAppWorkspacePaths.folder(file.workspaceId, file.parentId)
                  : kAppWorkspacePaths.folderList(file.workspaceId)
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
            node={<p className="line-clamp-2">{file.description}</p>}
          />
        )}
      </div>
    </div>
  );
}

export default FileComponent;
