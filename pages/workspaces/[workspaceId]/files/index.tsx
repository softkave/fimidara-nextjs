import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer";
import FolderChildren from "@/components/app/workspaces/files/FolderChildren";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

export interface IWorkspaceFilesPageProps {
  workspaceId: string;
}

const WorkspaceFilePage: React.FC<IWorkspaceFilesPageProps> = (props) => {
  const { workspaceId } = props;
  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <FolderChildren
          workspaceId={workspace.resourceId}
          workspaceRootname={workspace.rootname}
        />
      )}
    />
  );
};

export default withPageAuthRequiredHOC(WorkspaceFilePage);
export const getServerSideProps = getWorkspaceServerSideProps;
