import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import { Space } from "antd";
import React from "react";
import WorkspaceContainer from "../../../../components/app/workspaces/WorkspaceContainer";
import FileListContainer from "../../../../components/app/workspaces/files/FileListContainer";
import FolderListContainer from "../../../../components/app/workspaces/files/FolderListContainer";

export interface IWorkspaceFilesPageProps {
  workspaceId: string;
}

const WorkspaceFilePage: React.FC<IWorkspaceFilesPageProps> = (props) => {
  const { workspaceId } = props;
  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <Space direction="vertical" size={32} style={{ width: "100%" }}>
          <FileListContainer
            workspaceId={workspaceId}
            workspaceRootname={workspace.rootname}
          />
          <FolderListContainer
            workspaceId={workspaceId}
            workspaceRootname={workspace.rootname}
          />
        </Space>
      )}
    />
  );
};

export default withPageAuthRequiredHOC(WorkspaceFilePage);
export const getServerSideProps = getWorkspaceServerSideProps;
