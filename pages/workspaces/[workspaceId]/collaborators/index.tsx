import WorkspaceCollaborators from "@/components/app/workspaces/collaborators/WorkspaceCollaborators";
import { getWorkspaceServerSideProps } from "@/components/app/workspaces/utils";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import React from "react";

export interface IWorkspaceCollaboratorsPageProps {
  workspaceId: string;
}

const WorkspaceCollaboratorsPage: React.FC<IWorkspaceCollaboratorsPageProps> = (
  props
) => {
  const { workspaceId } = props;
  return <WorkspaceCollaborators workspaceId={workspaceId} />;
};

export default withPageAuthRequiredHOC(WorkspaceCollaboratorsPage);
export const getServerSideProps = getWorkspaceServerSideProps;
