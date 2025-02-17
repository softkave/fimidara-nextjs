import LabeledNode from "@/components/utils/LabeledNode";
import { addRootnameToPath } from "@/lib/definitions/folder";
import { formatDateTime } from "@/lib/utils/dateFns";
import { Folder } from "fimidara";
import path from "path";
import FolderChildren from "./FolderChildren";

export interface FolderProps {
  folder: Folder;
  workspaceRootname: string;
}

function FolderComponent(props: FolderProps) {
  const { folder, workspaceRootname } = props;

  return (
    <div>
      <div className="space-y-8">
        <LabeledNode
          nodeIsText
          copyable
          code
          direction="vertical"
          label="Resource ID"
          node={folder.resourceId}
        />
        <LabeledNode
          nodeIsText
          copyable
          code
          direction="vertical"
          label="Folder Path"
          node={path.normalize(
            addRootnameToPath(
              folder.namepath.map((name) => encodeURIComponent(name)).join("/"),
              workspaceRootname
            )
          )}
        />
        <LabeledNode
          nodeIsText
          direction="vertical"
          label="Last Updated"
          node={formatDateTime(folder.lastUpdatedAt)}
        />
        {folder.description && (
          <LabeledNode
            direction="vertical"
            label="Description"
            node={<div className="line-clamp-2">{folder.description}</div>}
          />
        )}
        <FolderChildren
          folder={folder}
          workspaceId={folder.workspaceId}
          workspaceRootname={workspaceRootname}
        />
      </div>
    </div>
  );
}

export default FolderComponent;
