import { Space } from "antd";
import React from "react";
import ComponentHeader from "../../../utils/ComponentHeader";
import { appClasses } from "../../../utils/theme";
import LabeledNode from "../../../utils/LabeledNode";
import { IFolder } from "../../../../lib/definitions/folder";
import FolderMenu from "./FolderMenu";

export interface IFolderProps {
  folder: IFolder;
}

function Folder(props: IFolderProps) {
  const { folder } = props;

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={folder.name}>
          <FolderMenu folder={folder} />
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
