import { Space } from "antd";
import { IFile } from "../../../../lib/definitions/file";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import { appClasses } from "../../../utils/theme";
import FileMenu from "./FileMenu";

export interface IFileComponentProps {
  file: IFile;
  workspaceRootname: string;
}

function FileComponent(props: IFileComponentProps) {
  const { file, workspaceRootname } = props;
  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={file.name}>
          <FileMenu file={file} workspaceRootname={workspaceRootname} />
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
