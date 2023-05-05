import { Space } from "antd";
import { Folder } from "fimidara";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import { appClasses } from "../../../utils/theme";
import FolderMenu from "./FolderMenu";

export interface FolderProps {
  folder: Folder;
  workspaceRootname: string;
}

function Folder(props: FolderProps) {
  const { folder, workspaceRootname } = props;
  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={folder.name}>
          <FolderMenu folder={folder} workspaceRootname={workspaceRootname} />
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
      </Space>
    </div>
  );
}

export default Folder;
