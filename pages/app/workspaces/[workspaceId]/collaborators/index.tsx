import React from "react";
import WorkspaceCollaborators from "../../../../../components/app/workspaces/collaborators/WorkspaceCollaborators";
import Workspace from "../../../../../components/app/workspaces/Workspace";
import { getWorkspaceServerSideProps } from "../../../../../components/app/workspaces/utils";
import withPageAuthRequired from "../../../../../components/hoc/withPageAuthRequired";
import { appWorkspacePaths } from "../../../../../lib/definitions/system";

export interface IWorkspaceCollaboratorsPageProps {
  workspaceId: string;
}

const WorkspaceCollaboratorsPage: React.FC<IWorkspaceCollaboratorsPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.collaboratorList(workspaceId)}
    >
      <WorkspaceCollaborators workspaceId={workspaceId} />
    </Workspace>
  );
};

export default withPageAuthRequired(WorkspaceCollaboratorsPage);
export const getServerSideProps = getWorkspaceServerSideProps;
