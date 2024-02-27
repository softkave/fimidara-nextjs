import { StyleableComponentProps } from "@/components/utils/styling/types";
import { appClasses } from "@/components/utils/theme";
import { Space } from "antd";
import { Folder } from "fimidara";
import FileListContainer from "./FileListContainer";
import FileListContainerHeader from "./FileListContainerHeader";
import FolderListContainer from "./FolderListContainer";
import FolderParentLink from "./FolderParentLink";

export interface FolderChildrenProps extends StyleableComponentProps {
  folder?: Folder;
  workspaceId: string;
  workspaceRootname: string;
}

function FolderChildren(props: FolderChildrenProps) {
  const { folder, workspaceRootname, workspaceId, style, className } = props;

  return (
    <div style={style} className={className}>
      <FileListContainerHeader
        workspaceId={workspaceId}
        folder={folder}
        workspaceRootname={workspaceRootname}
        className={appClasses.mb16}
      />
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <FolderParentLink workspaceId={workspaceId} folder={folder}>
          <span style={{ fontSize: "24px" }}>..</span>
        </FolderParentLink>
        <FolderListContainer
          workspaceId={workspaceId}
          workspaceRootname={workspaceRootname}
          folder={folder}
        />
        <FileListContainer
          workspaceId={workspaceId}
          workspaceRootname={workspaceRootname}
          folder={folder}
        />
      </Space>
    </div>
  );
}

export default FolderChildren;
