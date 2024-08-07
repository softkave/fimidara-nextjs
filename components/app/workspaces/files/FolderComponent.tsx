import LabeledNode from "@/components/utils/LabeledNode";
import { appClasses } from "@/components/utils/theme";
import { addRootnameToPath } from "@/lib/definitions/folder";
import { formatDateTime } from "@/lib/utils/dateFns";
import { Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
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
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
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
            addRootnameToPath(folder.namepath.join("/"), workspaceRootname)
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
            node={
              <Paragraph
                ellipsis={{ rows: 2 }}
                className={appClasses.muteMargin}
              >
                {folder.description}
              </Paragraph>
            }
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
