import { Space } from "antd";
import React from "react";
import ComponentHeader from "../../../utils/ComponentHeader";
import { appClasses } from "../../../utils/theme";
import LabeledNode from "../../../utils/LabeledNode";
import { IFile } from "../../../../lib/definitions/file";
import FileMenu from "./FileMenu";

export interface IFileComponentProps {
  file: IFile;
}

function FileComponent(props: IFileComponentProps) {
  const { file } = props;

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={file.name}>
          <FileMenu file={file} />
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
